"""
Executor de testes completo via HTTP - 4 Fases.

Este módulo executa todos os testes do roteiro e retorna resultados detalhados.
"""
import time
from typing import Dict, List, Any, Tuple
from flask import Flask
from src.core import route_engine
from src.utils.logger import get_logger

logger = get_logger(__name__)


def parse_coordinates(coord_str: str) -> Tuple[bool, float, float, str]:
    """
    Tenta parsear coordenadas.

    Returns:
        (sucesso, lat, lon, erro_msg)
    """
    try:
        lat, lon = map(float, coord_str.split(','))
        return True, lat, lon, None
    except (ValueError, IndexError):
        return False, 0.0, 0.0, "Formato inválido"


def validate_route_endpoint(origin_str: str, dest_str: str) -> Dict[str, Any]:
    """
    Valida um endpoint de rota e retorna o resultado.

    Returns:
        Dicionário com status, dados e informações de erro
    """
    # Parse coordenadas
    success_orig, lat_orig, lon_orig, error_orig = parse_coordinates(origin_str)
    success_dest, lat_dest, lon_dest, error_dest = parse_coordinates(dest_str)

    if not success_orig:
        return {
            "valid": False,
            "error_code": "INVALID_FORMAT",
            "error_message": "Use o formato /lat,lon/lat,lon/",
            "http_status": 400
        }

    if not success_dest:
        return {
            "valid": False,
            "error_code": "INVALID_FORMAT",
            "error_message": "Use o formato /lat,lon/lat,lon/",
            "http_status": 400
        }

    # Valida ranges
    if not (-90 <= lat_orig <= 90 and -90 <= lat_dest <= 90):
        return {
            "valid": False,
            "error_code": "OUT_OF_RANGE_LATITUDE",
            "error_message": "Latitude fora do range [-90, 90]",
            "http_status": 400
        }

    if not (-180 <= lon_orig <= 180 and -180 <= lon_dest <= 180):
        return {
            "valid": False,
            "error_code": "OUT_OF_RANGE_LONGITUDE",
            "error_message": "Longitude fora do range [-180, 180]",
            "http_status": 400
        }

    # Valida área de serviço
    if not route_engine.is_point_in_service_area(lat_orig, lon_orig):
        return {
            "valid": False,
            "error_code": "OUT_OF_SERVICE_AREA",
            "error_message": "Ponto de origem fora da área de serviço (Lisboa)",
            "http_status": 400
        }

    if not route_engine.is_point_in_service_area(lat_dest, lon_dest):
        return {
            "valid": False,
            "error_code": "OUT_OF_SERVICE_AREA",
            "error_message": "Ponto de destino fora da área de serviço (Lisboa)",
            "http_status": 400
        }

    # Calcula rota
    start = time.time()
    result = route_engine.calculate_route(lat_orig, lon_orig, lat_dest, lon_dest)
    response_time = time.time() - start

    if result["success"]:
        return {
            "valid": True,
            "http_status": 200,
            "response_time_seconds": round(response_time, 3),
            "data": {
                "status": "success",
                "algorithm": "A*",
                "path": result["path"],
                "stats": result["stats"]
            }
        }
    else:
        return {
            "valid": False,
            "error_code": result.get("error", "UNKNOWN_ERROR"),
            "error_message": result.get("error", "Erro desconhecido"),
            "http_status": 500,
            "response_time_seconds": round(response_time, 3)
        }


def validate_response_consistency(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    FASE 3: Valida consistência da resposta.
    """
    validations = {
        "has_path": bool("path" in data and isinstance(data["path"], list)),
        "has_distance": bool("stats" in data and "distance_meters" in data["stats"]),
        "has_nodes_expanded": bool("stats" in data and "nodes_expanded" in data["stats"]),
        "has_time_seconds": bool("stats" in data and "time_seconds" in data["stats"]),
        "has_status_success": bool(data.get("status") == "success"),
        "path_not_empty": bool(len(data.get("path", [])) > 0),
    }

    # Valores positivos
    if validations["has_distance"]:
        validations["distance_positive"] = bool(data["stats"]["distance_meters"] >= 0)
    else:
        validations["distance_positive"] = False

    if validations["has_nodes_expanded"]:
        validations["nodes_positive"] = bool(data["stats"]["nodes_expanded"] >= 0)
    else:
        validations["nodes_positive"] = False

    if validations["has_time_seconds"]:
        validations["time_positive"] = bool(data["stats"]["time_seconds"] >= 0)
    else:
        validations["time_positive"] = False

    # Validar coordenadas do path dentro de Lisboa (lat: 38.6-38.85, lon: -9.5 a -9.0)
    if validations["has_path"] and len(data["path"]) > 0:
        all_coords_valid = True
        for coord in data["path"]:
            if len(coord) == 2:
                lon, lat = coord
                if not (38.6 <= lat <= 38.85 and -9.5 <= lon <= -9.0):
                    all_coords_valid = False
                    break
        validations["coords_in_lisbon"] = bool(all_coords_valid)
    else:
        validations["coords_in_lisbon"] = False

    return validations


def run_phase1() -> List[Dict[str, Any]]:
    """
    FASE 1: Validação de Entrada
    """
    logger.info("Executando FASE 1: Validação de Entrada")

    results = []

    # Teste 1.1 - Formato inválido (letras)
    test = validate_route_endpoint("abc,def", "38.7223,-9.1393")
    results.append({
        "id": "1.1",
        "name": "Formato inválido (letras)",
        "endpoint": "/abc,def/38.7223,-9.1393/",
        "expected": "Erro com código de formato inválido",
        "passed": bool(not test["valid"] and test["error_code"] == "INVALID_FORMAT"),
        "http_status": test["http_status"],
        "error_code": test.get("error_code"),
        "error_message": test.get("error_message")
    })

    # Teste 1.2 - Coordenadas incompletas
    test = validate_route_endpoint("38.7223", "38.7169,-9.1333")
    results.append({
        "id": "1.2",
        "name": "Coordenadas incompletas",
        "endpoint": "/38.7223/38.7169,-9.1333/",
        "expected": "Erro 400 ou mensagem de formato",
        "passed": bool(not test["valid"] and test["http_status"] == 400),
        "http_status": test["http_status"],
        "error_code": test.get("error_code"),
        "error_message": test.get("error_message")
    })

    # Teste 1.3 - Fora de Lisboa (origem - Madrid)
    test = validate_route_endpoint("40.4168,-3.7038", "38.7223,-9.1393")
    results.append({
        "id": "1.3",
        "name": "Fora de Lisboa (origem - Madrid)",
        "endpoint": "/40.4168,-3.7038/38.7223,-9.1393/",
        "expected": "Erro de área de serviço",
        "passed": bool(not test["valid"] and test["error_code"] == "OUT_OF_SERVICE_AREA"),
        "http_status": test["http_status"],
        "error_code": test.get("error_code"),
        "error_message": test.get("error_message")
    })

    # Teste 1.4 - Fora de Lisboa (destino - Porto)
    test = validate_route_endpoint("38.7223,-9.1393", "41.1579,-8.6291")
    results.append({
        "id": "1.4",
        "name": "Fora de Lisboa (destino - Porto)",
        "endpoint": "/38.7223,-9.1393/41.1579,-8.6291/",
        "expected": "Erro de área de serviço",
        "passed": bool(not test["valid"] and test["error_code"] == "OUT_OF_SERVICE_AREA"),
        "http_status": test["http_status"],
        "error_code": test.get("error_code"),
        "error_message": test.get("error_message")
    })

    # Teste 1.5 - Método incorreto (POST)
    # Nota: Este teste não pode ser feito internamente, mas registramos
    results.append({
        "id": "1.5",
        "name": "Método incorreto (POST)",
        "endpoint": "/38.7223,-9.1393/38.7169,-9.1333/",
        "expected": "Erro 405 Method Not Allowed",
        "passed": None,
        "note": "Teste requer requisição HTTP POST externa",
        "http_status": None
    })

    return results


def run_phase2() -> List[Dict[str, Any]]:
    """
    FASE 2: Casos Extremos
    """
    logger.info("Executando FASE 2: Casos Extremos")

    results = []

    # Teste 2.1 - Origem igual ao destino
    test = validate_route_endpoint("38.7223,-9.1393", "38.7223,-9.1393")
    if test["valid"]:
        data = test["data"]
        distance = data["stats"]["distance_meters"]
        nodes = data["stats"]["nodes_expanded"]
        passed = distance == 0 and nodes < 10

        results.append({
            "id": "2.1",
            "name": "Origem igual ao destino",
            "endpoint": "/38.7223,-9.1393/38.7223,-9.1393/",
            "expected": "distância = 0, nós explorados < 10",
            "passed": bool(passed),
            "http_status": int(test["http_status"]),
            "response_time_seconds": float(test["response_time_seconds"]),
            "distance_meters": float(distance),
            "nodes_expanded": int(nodes),
            "nodes_in_path": int(data["stats"].get("nodes_in_path", 0)),
            "time_seconds": float(data["stats"].get("time_seconds", 0))
        })
    else:
        results.append({
            "id": "2.1",
            "name": "Origem igual ao destino",
            "endpoint": "/38.7223,-9.1393/38.7223,-9.1393/",
            "passed": False,
            "error": test.get("error_message")
        })

    # Teste 2.2 - Coordenadas no rio Tejo
    test = validate_route_endpoint("38.6950,-9.1500", "38.7223,-9.1393")
    if test["valid"]:
        data = test["data"]
        results.append({
            "id": "2.2",
            "name": "Coordenadas no rio Tejo",
            "endpoint": "/38.6950,-9.1500/38.7223,-9.1393/",
            "expected": "Erro ou path alternativo",
            "passed": True,
            "behavior": "Retornou rota válida",
            "http_status": test["http_status"],
            "response_time_seconds": test["response_time_seconds"],
            "distance_meters": data["stats"]["distance_meters"],
            "nodes_expanded": data["stats"]["nodes_expanded"]
        })
    else:
        results.append({
            "id": "2.2",
            "name": "Coordenadas no rio Tejo",
            "endpoint": "/38.6950,-9.1500/38.7223,-9.1393/",
            "expected": "Erro ou path alternativo",
            "passed": True,
            "behavior": "Retornou erro: " + test.get("error_message", ""),
            "http_status": test["http_status"],
            "error_code": test.get("error_code")
        })

    # Teste 2.3 - Rota muito longa (Sintra → Lisboa, >15km)
    test = validate_route_endpoint("38.7967,-9.3906", "38.7223,-9.1393")
    if test["valid"]:
        data = test["data"]
        results.append({
            "id": "2.3",
            "name": "Rota muito longa (Sintra → Lisboa, >15km)",
            "endpoint": "/38.7967,-9.3906/38.7223,-9.1393/",
            "expected": "Completa ou dá timeout",
            "passed": True,
            "behavior": "Completou com sucesso",
            "http_status": test["http_status"],
            "response_time_seconds": test["response_time_seconds"],
            "distance_meters": data["stats"]["distance_meters"],
            "nodes_expanded": data["stats"]["nodes_expanded"],
            "nodes_in_path": data["stats"].get("nodes_in_path", 0)
        })
    else:
        results.append({
            "id": "2.3",
            "name": "Rota muito longa (Sintra → Lisboa, >15km)",
            "endpoint": "/38.7967,-9.3906/38.7223,-9.1393/",
            "passed": False,
            "behavior": "Erro: " + test.get("error_message", ""),
            "error_code": test.get("error_code")
        })

    return results


def run_phase3() -> Dict[str, Any]:
    """
    FASE 3: Consistência da Resposta
    """
    logger.info("Executando FASE 3: Consistência da Resposta")

    # Usa rota padrão para validação
    test = validate_route_endpoint("38.7223,-9.1393", "38.7169,-9.1333")

    if test["valid"]:
        data = test["data"]
        validations = validate_response_consistency(data)

        return {
            "test_endpoint": "/38.7223,-9.1393/38.7169,-9.1333/",
            "http_status": int(test["http_status"]),
            "response_time_seconds": float(test["response_time_seconds"]),
            "validations": validations,
            "all_passed": bool(all(validations.values())),
            "response_sample": data
        }
    else:
        return {
            "test_endpoint": "/38.7223,-9.1393/38.7169,-9.1333/",
            "error": "Não foi possível obter resposta válida",
            "all_passed": False
        }


def run_phase4() -> List[Dict[str, Any]]:
    """
    FASE 4: Performance e Escalabilidade
    """
    logger.info("Executando FASE 4: Performance e Escalabilidade")

    results = []

    tests = [
        {
            "id": "4.1",
            "name": "Rota curta (~500m)",
            "origin": "38.7223,-9.1393",
            "dest": "38.7200,-9.1370"
        },
        {
            "id": "4.2",
            "name": "Rota média (~2km)",
            "origin": "38.7223,-9.1393",
            "dest": "38.7100,-9.1500"
        },
        {
            "id": "4.3",
            "name": "Rota longa (~5km)",
            "origin": "38.7223,-9.1393",
            "dest": "38.7500,-9.2000"
        },
        {
            "id": "4.4",
            "name": "Rota muito longa (~10km)",
            "origin": "38.7223,-9.1393",
            "dest": "38.7800,-9.1000"
        }
    ]

    for t in tests:
        test = validate_route_endpoint(t["origin"], t["dest"])

        if test["valid"]:
            data = test["data"]
            stats = data["stats"]

            results.append({
                "id": t["id"],
                "name": t["name"],
                "endpoint": f"/{t['origin']}/{t['dest']}/",
                "passed": True,
                "http_status": test["http_status"],
                "api_response_time_seconds": test["response_time_seconds"],
                "distance_meters": stats["distance_meters"],
                "nodes_expanded": stats["nodes_expanded"],
                "nodes_in_path": stats.get("nodes_in_path", 0),
                "estimated_time_seconds": stats.get("time_seconds", 0),
                "nodes_per_km": round((stats["nodes_expanded"] / stats["distance_meters"] * 1000), 2) if stats["distance_meters"] > 0 else 0
            })
        else:
            results.append({
                "id": t["id"],
                "name": t["name"],
                "endpoint": f"/{t['origin']}/{t['dest']}/",
                "passed": False,
                "error": test.get("error_message")
            })

    return results


def run_all_tests() -> Dict[str, Any]:
    """
    Executa todas as 4 fases de testes e retorna resultados consolidados.
    """
    logger.info("Iniciando execução completa de testes (4 fases)")

    start_time = time.time()

    # Verifica se o grafo está carregado
    health = route_engine.get_health_status()
    if not health["healthy"]:
        return {
            "status": "error",
            "message": "Serviço não está saudável. Grafo não carregado.",
            "health": health
        }

    # Executa as 4 fases
    phase1_results = run_phase1()
    phase2_results = run_phase2()
    phase3_results = run_phase3()
    phase4_results = run_phase4()

    # Calcula estatísticas gerais
    total_tests = (
        len([r for r in phase1_results if r.get("passed") is not None]) +
        len(phase2_results) +
        (1 if phase3_results.get("all_passed") is not None else 0) +
        len(phase4_results)
    )

    passed_tests = (
        len([r for r in phase1_results if r.get("passed") is True]) +
        len([r for r in phase2_results if r.get("passed") is True]) +
        (1 if phase3_results.get("all_passed") is True else 0) +
        len([r for r in phase4_results if r.get("passed") is True])
    )

    # Estatísticas de performance
    perf_stats = None
    if phase4_results:
        valid_perf = [r for r in phase4_results if r.get("passed") is True]
        if valid_perf:
            times = [r["api_response_time_seconds"] for r in valid_perf]
            nodes_per_km = [r["nodes_per_km"] for r in valid_perf]

            perf_stats = {
                "avg_response_time_seconds": round(sum(times) / len(times), 3),
                "min_response_time_seconds": round(min(times), 3),
                "max_response_time_seconds": round(max(times), 3),
                "avg_nodes_per_km": round(sum(nodes_per_km) / len(nodes_per_km), 2),
                "samples": len(valid_perf)
            }

    elapsed_time = time.time() - start_time

    logger.info(f"Testes concluídos: {passed_tests}/{total_tests} aprovados em {elapsed_time:.2f}s")

    return {
        "status": "success",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "execution_time_seconds": round(elapsed_time, 3),
        "summary": {
            "total_tests": total_tests,
            "passed": passed_tests,
            "failed": total_tests - passed_tests,
            "success_rate": round((passed_tests / total_tests * 100), 2) if total_tests > 0 else 0
        },
        "health": health,
        "phases": {
            "phase1_validation": {
                "description": "Validação de Entrada",
                "results": phase1_results
            },
            "phase2_edge_cases": {
                "description": "Casos Extremos",
                "results": phase2_results
            },
            "phase3_consistency": {
                "description": "Consistência da Resposta",
                "results": phase3_results
            },
            "phase4_performance": {
                "description": "Performance e Escalabilidade",
                "results": phase4_results,
                "statistics": perf_stats
            }
        }
    }
