"""
Configuração centralizada do serviço de rotas.

Todas as configurações são carregadas de variáveis de ambiente com valores padrão.
"""
import os
from typing import Optional
from pathlib import Path


class Config:
    """Configuração da aplicação carregada de variáveis de ambiente."""
    
    # Servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "5000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    WORKERS: int = int(os.getenv("WORKERS", "4"))
    
    # Área geográfica
    SERVICE_AREA: str = os.getenv("SERVICE_AREA", "Lisbon, Portugal")
    NETWORK_TYPE: str = os.getenv("NETWORK_TYPE", "walk")
    
    # Parâmetros de rota
    WALKING_SPEED_MPS: float = float(os.getenv("WALKING_SPEED_MPS", "1.3"))
    
    # Cache e otimização
    GRAPH_CACHE_DIR: Optional[str] = os.getenv("GRAPH_CACHE_DIR")
    GRAPH_FILE_PATH: Optional[str] = os.getenv("GRAPH_FILE_PATH")
    SIMPLIFY_GRAPH: bool = os.getenv("SIMPLIFY_GRAPH", "True").lower() == "true"
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Timeouts
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "30"))
    GRAPH_LOAD_TIMEOUT: int = int(os.getenv("GRAPH_LOAD_TIMEOUT", "300"))
    
    @classmethod
    def display(cls) -> str:
        """Retorna string com configurações ativas (sem dados sensíveis)."""
        return f"""
╔════════════════════════════════════════════════════════╗
║           ROUTE CALCULATOR SERVICE CONFIG              ║
╠════════════════════════════════════════════════════════╣
║ Host:              {cls.HOST:30} ║
║ Port:              {cls.PORT:<30} ║
║ Debug:             {cls.DEBUG!s:<30} ║
║ Workers:           {cls.WORKERS:<30} ║
║ Service Area:      {cls.SERVICE_AREA:30} ║
║ Network Type:      {cls.NETWORK_TYPE:30} ║
║ Walking Speed:     {cls.WALKING_SPEED_MPS} m/s{'':<25} ║
║ Simplify Graph:    {cls.SIMPLIFY_GRAPH!s:<30} ║
║ Log Level:         {cls.LOG_LEVEL:30} ║
║ Request Timeout:   {cls.REQUEST_TIMEOUT}s{'':<27} ║
╚════════════════════════════════════════════════════════╝
"""
    
    @classmethod
    def validate(cls) -> bool:
        """Valida as configurações críticas."""
        if cls.PORT < 1 or cls.PORT > 65535:
            raise ValueError(f"PORT inválida: {cls.PORT}")
        if cls.WORKERS < 1:
            raise ValueError(f"WORKERS deve ser >= 1: {cls.WORKERS}")
        if cls.WALKING_SPEED_MPS <= 0:
            raise ValueError(f"WALKING_SPEED_MPS deve ser > 0: {cls.WALKING_SPEED_MPS}")
        return True
