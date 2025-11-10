"""
Definições de Exceções e Respostas HTTP.

Este módulo centraliza todas as mensagens de erro e códigos de status HTTP
utilizados pela API de cálculo de rotas.
"""


class HTTPException:
    """
    Classe base para exceções HTTP com código de status.
    
    Attributes:
        code (str): Código identificador do erro (ex: 'INVALID_FORMAT')
        message (str): Mensagem descritiva do erro em português
        status_code (int): Código de status HTTP (ex: 400, 404, 503)
    """
    
    def __init__(self, code: str, message: str, status_code: int):
        """
        Inicializa uma exceção HTTP.
        
        Args:
            code: Código identificador do erro
            message: Mensagem descritiva do erro
            status_code: Código de status HTTP
        """
        self.code = code
        self.message = message
        self.status_code = status_code
    
    def to_dict(self) -> dict:
        """
        Converte a exceção em um dicionário para resposta JSON.
        
        Returns:
            dict: Dicionário com chaves 'status', 'code' e 'message'
            
        Example:
            >>> exc = HTTPException("ERROR", "Mensagem", 400)
            >>> exc.to_dict()
            {'status': 'error', 'code': 'ERROR', 'message': 'Mensagem'}
        """
        return {
            "status": "error",
            "code": self.code,
            "message": self.message
        }


# --- ERROS DE VALIDAÇÃO (400 Bad Request) ---

class InvalidFormatException(HTTPException):
    """Exceção para formato inválido de coordenadas."""
    
    def __init__(self):
        super().__init__(
            code="INVALID_FORMAT",
            message="Use o formato /lat,lon/lat,lon/",
            status_code=400
        )


class OutOfRangeLatitudeException(HTTPException):
    """Exceção para latitude fora do intervalo válido."""
    
    def __init__(self):
        super().__init__(
            code="OUT_OF_RANGE",
            message="Latitude deve estar entre -90 e 90",
            status_code=400
        )


class OutOfRangeLongitudeException(HTTPException):
    """Exceção para longitude fora do intervalo válido."""
    
    def __init__(self):
        super().__init__(
            code="OUT_OF_RANGE",
            message="Longitude deve estar entre -180 e 180",
            status_code=400
        )


class OutOfServiceAreaOriginException(HTTPException):
    """Exceção para ponto de origem fora da área de serviço."""
    
    def __init__(self):
        super().__init__(
            code="OUT_OF_SERVICE_AREA",
            message="Ponto de origem fora da área de serviço (Lisboa)",
            status_code=400
        )


class OutOfServiceAreaDestException(HTTPException):
    """Exceção para ponto de destino fora da área de serviço."""
    
    def __init__(self):
        super().__init__(
            code="OUT_OF_SERVICE_AREA",
            message="Ponto de destino fora da área de serviço (Lisboa)",
            status_code=400
        )


# --- ERROS DE ROTA (404 Not Found) ---

class NoRouteFoundException(HTTPException):
    """Exceção quando nenhuma rota é encontrada."""
    
    def __init__(self):
        super().__init__(
            code="NO_ROUTE_FOUND",
            message="Não foi possível encontrar uma rota entre os pontos",
            status_code=404
        )


# --- ERROS DE SERVIDOR (503 Service Unavailable) ---

class MapNotLoadedException(HTTPException):
    """Exceção quando o mapa não está carregado."""
    
    def __init__(self):
        super().__init__(
            code="MAP_NOT_LOADED",
            message="O mapa não está disponível no momento",
            status_code=503
        )


class CalculationErrorException(HTTPException):
    """Exceção para erro genérico de cálculo."""
    
    def __init__(self):
        super().__init__(
            code="CALCULATION_ERROR",
            message="Erro ao calcular a rota",
            status_code=500
        )


# --- MAPEAMENTO DE CÓDIGOS DE ERRO ---

ERROR_MAP = {
    "MAP_NOT_LOADED": MapNotLoadedException(),
    "NO_ROUTE_FOUND": NoRouteFoundException(),
    "CALCULATION_ERROR": CalculationErrorException()
}


def get_error_response(error_code: str) -> HTTPException:
    """
    Retorna a exceção HTTP apropriada baseada no código de erro.
    
    Args:
        error_code: Código do erro retornado pelo motor de rotas
        
    Returns:
        HTTPException: Instância da exceção correspondente ao código
        
    Example:
        >>> exc = get_error_response("NO_ROUTE_FOUND")
        >>> exc.status_code
        404
    """
    return ERROR_MAP.get(error_code, HTTPException(
        code=error_code,
        message="Erro desconhecido",
        status_code=500
    ))
