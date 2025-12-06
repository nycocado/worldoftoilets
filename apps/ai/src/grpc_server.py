"""
Servidor gRPC para o serviço de cálculo de rotas.

Este módulo implementa o servidor gRPC que expõe o serviço de cálculo de rotas.
"""
import grpc
from concurrent import futures
import threading
from typing import Optional

from src.grpc_generated import route_pb2, route_pb2_grpc
from src.core import route_engine
from src.core.config import Config
from src.utils.logger import get_logger
from src.utils.exceptions import (
    InvalidFormatException,
    OutOfRangeLatitudeException,
    OutOfRangeLongitudeException,
    OutOfServiceAreaOriginException,
    OutOfServiceAreaDestException,
)

logger = get_logger(__name__)

# Variável global para o servidor gRPC
_grpc_server: Optional[grpc.Server] = None


class RouteServiceServicer(route_pb2_grpc.RouteServiceServicer):
    """
    Implementação do serviço gRPC de cálculo de rotas.
    """

    def CalculateRoute(
        self, request: route_pb2.RouteRequest, context: grpc.ServicerContext
    ) -> route_pb2.RouteResponse:
        """
        Calcula uma rota entre dois pontos geográficos.

        Args:
            request: Requisição contendo as coordenadas de origem e destino
            context: Contexto gRPC

        Returns:
            RouteResponse com a rota calculada ou erro
        """
        lat_orig = request.origin_lat
        lon_orig = request.origin_lon
        lat_dest = request.dest_lat
        lon_dest = request.dest_lon

        logger.info(
            f"Requisição gRPC de rota: ({lat_orig},{lon_orig}) -> ({lat_dest},{lon_dest})"
        )

        # --- VALIDAÇÃO DE RANGE ---
        if not (-90 <= lat_orig <= 90 and -90 <= lat_dest <= 90):
            exc = OutOfRangeLatitudeException()
            logger.warning(f"Latitude fora do range: {lat_orig}, {lat_dest}")
            return route_pb2.RouteResponse(
                success=False, error_code=exc.code, error_message=exc.message
            )

        if not (-180 <= lon_orig <= 180 and -180 <= lon_dest <= 180):
            exc = OutOfRangeLongitudeException()
            logger.warning(f"Longitude fora do range: {lon_orig}, {lon_dest}")
            return route_pb2.RouteResponse(
                success=False, error_code=exc.code, error_message=exc.message
            )

        # --- VALIDAÇÃO DE ÁREA DE SERVIÇO ---
        if not route_engine.is_point_in_service_area(lat_orig, lon_orig):
            exc = OutOfServiceAreaOriginException()
            logger.warning(f"Origem fora da área: {lat_orig}, {lon_orig}")
            return route_pb2.RouteResponse(
                success=False, error_code=exc.code, error_message=exc.message
            )

        if not route_engine.is_point_in_service_area(lat_dest, lon_dest):
            exc = OutOfServiceAreaDestException()
            logger.warning(f"Destino fora da área: {lat_dest}, {lon_dest}")
            return route_pb2.RouteResponse(
                success=False, error_code=exc.code, error_message=exc.message
            )

        # --- CÁLCULO DA ROTA ---
        result = route_engine.calculate_route(lat_orig, lon_orig, lat_dest, lon_dest)

        if not result["success"]:
            logger.error(f"Erro no cálculo da rota: {result.get('error', 'Desconhecido')}")
            return route_pb2.RouteResponse(
                success=False,
                error_code="ROUTE_CALCULATION_FAILED",
                error_message=result.get("error", "Erro desconhecido"),
            )

        # --- RESPOSTA DE SUCESSO ---
        # Converte o caminho de lista de [lon, lat] para mensagens Point
        path_points = [
            route_pb2.Point(lon=coord[0], lat=coord[1]) for coord in result["path"]
        ]

        stats = route_pb2.RouteStats(
            distance_meters=result["stats"]["distance_meters"],
            time_seconds=result["stats"]["time_seconds"],
            nodes_in_path=result["stats"]["nodes_in_path"],
            nodes_expanded=result["stats"]["nodes_expanded"],
        )

        logger.info(
            f"Rota calculada com sucesso: {stats.distance_meters:.2f}m, {stats.nodes_in_path} nós"
        )

        return route_pb2.RouteResponse(
            success=True, algorithm="A*", path=path_points, stats=stats
        )

    def HealthCheck(
        self, request: route_pb2.HealthCheckRequest, context: grpc.ServicerContext
    ) -> route_pb2.HealthCheckResponse:
        """
        Verifica o status de saúde do serviço.

        Args:
            request: Requisição de health check (vazia)
            context: Contexto gRPC

        Returns:
            HealthCheckResponse com o status do serviço
        """
        health_status = route_engine.get_health_status()

        return route_pb2.HealthCheckResponse(
            healthy=health_status["healthy"],
            status=health_status["status"],
            graph_loaded=health_status["graph_loaded"],
            graph_nodes=health_status.get("graph_nodes", 0),
            graph_edges=health_status.get("graph_edges", 0),
        )


def start_grpc_server() -> grpc.Server:
    """
    Inicia o servidor gRPC em uma thread separada.

    Returns:
        grpc.Server: Instância do servidor gRPC
    """
    global _grpc_server

    if _grpc_server is not None:
        logger.warning("Servidor gRPC já está em execução")
        return _grpc_server

    # Cria o servidor gRPC com thread pool
    _grpc_server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

    # Adiciona o serviço ao servidor
    route_pb2_grpc.add_RouteServiceServicer_to_server(
        RouteServiceServicer(), _grpc_server
    )

    # Define a porta
    grpc_port = Config.GRPC_PORT
    _grpc_server.add_insecure_port(f"[::]:{grpc_port}")

    # Inicia o servidor
    _grpc_server.start()
    logger.info(f"Servidor gRPC iniciado na porta {grpc_port}")

    return _grpc_server


def stop_grpc_server(grace_period: int = 5):
    """
    Para o servidor gRPC.

    Args:
        grace_period: Tempo em segundos para aguardar antes de forçar o encerramento
    """
    global _grpc_server

    if _grpc_server is not None:
        logger.info("Encerrando servidor gRPC...")
        _grpc_server.stop(grace_period)
        _grpc_server = None
        logger.info("Servidor gRPC encerrado")


def start_grpc_server_in_thread() -> threading.Thread:
    """
    Inicia o servidor gRPC em uma thread daemon separada.

    Returns:
        threading.Thread: Thread onde o servidor gRPC está rodando
    """
    def run_server():
        server = start_grpc_server()
        # Aguarda o servidor ser encerrado
        server.wait_for_termination()

    thread = threading.Thread(target=run_server, daemon=True)
    thread.start()
    logger.info("Thread do servidor gRPC iniciada")
    return thread


if __name__ == "__main__":
    # Inicializa o route engine
    logger.info("Iniciando servidor gRPC de rotas...")
    if not route_engine.initialize():
        logger.warning(
            "AVISO: O servidor iniciou, mas o mapa não foi carregado corretamente."
        )

    # Inicia o servidor
    server = start_grpc_server()

    # Mantém o servidor rodando
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        stop_grpc_server()
