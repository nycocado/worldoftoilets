"""
API Flask para Cálculo de Rotas.

Este módulo expõe endpoints HTTP para calcular rotas a pé em Lisboa, Portugal,
utilizando o algoritmo A* sobre dados do OpenStreetMap.
"""
from flask import Flask
from src.api.routes import api_bp
from src.core import route_engine
from src.core.config import Config
from src.utils.logger import setup_logging, get_logger

# Configura logging
setup_logging()
logger = get_logger(__name__)


def create_app() -> Flask:
    """
    Factory function para criar a aplicação Flask.
    
    Returns:
        Flask: Aplicação Flask configurada
    """
    app = Flask(__name__)
    
    # Registra blueprints
    app.register_blueprint(api_bp)
    
    # Valida configurações
    try:
        Config.validate()
    except ValueError as e:
        logger.error(f"Erro na configuração: {e}")
        raise
    
    return app


# --- INICIALIZAÇÃO ---
logger.info("Iniciando o servidor de rotas...")
if not route_engine.initialize():
    logger.warning("AVISO: O servidor iniciou, mas o mapa não foi carregado corretamente.")

app = create_app()


if __name__ == '__main__':
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
