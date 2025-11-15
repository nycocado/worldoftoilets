"""
Definição das rotas da API.
"""
from flask import Blueprint, jsonify
from src.core import route_engine
from src.core.config import Config
from src.api.test_runner import run_all_tests
from src.utils.exceptions import (
    InvalidFormatException,
    OutOfRangeLatitudeException,
    OutOfRangeLongitudeException,
    OutOfServiceAreaOriginException,
    OutOfServiceAreaDestException,
    get_error_response
)
from src.utils.logger import get_logger

logger = get_logger(__name__)

api_bp = Blueprint('api', __name__)


@api_bp.route('/')
def index():
    """
    Endpoint de informação sobre a API.
    
    Returns:
        tuple: Tupla contendo (response_json, status_code)
            
    Example:
        GET http://localhost:5000/
        
        Response:
        {
            "status": "online",
            "service": "Route Calculator API",
            "mode": "walking",
            "area": "Lisbon, Portugal",
            "usage": "GET /<lat_origin>,<lon_origin>/<lat_dest>,<lon_dest>/"
        }
    """
    return jsonify({
        "status": "online",
        "service": "Route Calculator API",
        "version": "1.0.0",
        "mode": Config.NETWORK_TYPE,
        "area": Config.SERVICE_AREA,
        "usage": "GET /<lat_origin>,<lon_origin>/<lat_dest>,<lon_dest>/"
    })


@api_bp.route('/health')
def health():
    """
    Endpoint de health check.

    Returns:
        tuple: Tupla contendo (response_json, status_code)
    """
    health_status = route_engine.get_health_status()
    status_code = 200 if health_status["healthy"] else 503
    return jsonify(health_status), status_code


@api_bp.route('/test')
def test():
    """
    Endpoint para executar testes do serviço e retornar resultados em JSON.

    ⚠️ ATENÇÃO: Este endpoint só está disponível quando DEBUG=True

    Executa:
    - Testes de validação de entrada
    - Testes de cálculo de rotas
    - Testes de performance

    Returns:
        tuple: Tupla contendo (response_json, status_code)

    Example:
        GET http://localhost:5000/test

        Response (200 OK):
        {
            "status": "success",
            "timestamp": "2025-11-15 16:45:00",
            "execution_time_seconds": 2.345,
            "summary": {
                "total_tests": 7,
                "passed": 7,
                "failed": 0,
                "success_rate": 100.0
            },
            "health": { ... },
            "results": {
                "validation": [ ... ],
                "routes": [ ... ]
            },
            "performance": { ... }
        }

        Response (403 Forbidden) quando DEBUG=False:
        {
            "status": "error",
            "code": "DEBUG_MODE_REQUIRED",
            "message": "Este endpoint só está disponível em modo DEBUG"
        }
    """
    # Verifica se está em modo DEBUG
    if not Config.DEBUG:
        logger.warning("Tentativa de acesso ao /test com DEBUG=False")
        return jsonify({
            "status": "error",
            "code": "DEBUG_MODE_REQUIRED",
            "message": "Este endpoint só está disponível em modo DEBUG"
        }), 403

    logger.info("Requisição para /test recebida (DEBUG=True)")
    results = run_all_tests()
    status_code = 200 if results.get("status") == "success" else 503
    return jsonify(results), status_code


@api_bp.route('/<string:origin_str>/<string:dest_str>/')
def get_route(origin_str: str, dest_str: str):
    """
    Calcula e retorna a rota mais curta entre dois pontos.
    
    Args:
        origin_str: String no formato 'latitude,longitude' do ponto de origem
        dest_str: String no formato 'latitude,longitude' do ponto de destino
        
    Returns:
        tuple: Tupla contendo (response_json, status_code)
            
    Example:
        GET http://localhost:5000/38.7072,-9.1365/38.7139,-9.1334/
        
        Response (200 OK):
        {
            "status": "success",
            "algorithm": "A*",
            "path": [[lon1, lat1], [lon2, lat2], ...],
            "stats": {
                "distance_meters": 1234.56,
                "time_seconds": 949.66,
                "nodes_in_path": 15,
                "nodes_expanded": 87
            }
        }
    """
    # --- VALIDAÇÃO DE FORMATO ---
    try:
        lat_orig, lon_orig = map(float, origin_str.split(','))
        lat_dest, lon_dest = map(float, dest_str.split(','))
    except (ValueError, IndexError):
        exc = InvalidFormatException()
        logger.warning(f"Formato inválido: {origin_str}/{dest_str}")
        return jsonify(exc.to_dict()), exc.status_code

    # --- VALIDAÇÃO DE RANGE ---
    if not (-90 <= lat_orig <= 90 and -90 <= lat_dest <= 90):
        exc = OutOfRangeLatitudeException()
        logger.warning(f"Latitude fora do range: {lat_orig}, {lat_dest}")
        return jsonify(exc.to_dict()), exc.status_code

    if not (-180 <= lon_orig <= 180 and -180 <= lon_dest <= 180):
        exc = OutOfRangeLongitudeException()
        logger.warning(f"Longitude fora do range: {lon_orig}, {lon_dest}")
        return jsonify(exc.to_dict()), exc.status_code

    # --- VALIDAÇÃO DE ÁREA DE SERVIÇO ---
    if not route_engine.is_point_in_service_area(lat_orig, lon_orig):
        exc = OutOfServiceAreaOriginException()
        logger.warning(f"Origem fora da área: {lat_orig}, {lon_orig}")
        return jsonify(exc.to_dict()), exc.status_code

    if not route_engine.is_point_in_service_area(lat_dest, lon_dest):
        exc = OutOfServiceAreaDestException()
        logger.warning(f"Destino fora da área: {lat_dest}, {lon_dest}")
        return jsonify(exc.to_dict()), exc.status_code

    # --- CÁLCULO DA ROTA ---
    result = route_engine.calculate_route(
        lat_orig, lon_orig, lat_dest, lon_dest)

    if not result["success"]:
        exc = get_error_response(result["error"])
        return jsonify(exc.to_dict()), exc.status_code

    # --- RESPOSTA DE SUCESSO ---
    return jsonify({
        "status": "success",
        "algorithm": "A*",
        "path": result["path"],
        "stats": result["stats"]
    })
