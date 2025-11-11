#!/usr/bin/env python3
"""
Script de pré-carregamento do grafo OSM.

Este script é executado antes do gunicorn iniciar para garantir que o cache
do grafo esteja populado, evitando timeout durante a inicialização dos workers.
"""
import sys
import os

# Garante que o PYTHONPATH está configurado
sys.path.insert(0, '/app')

from src.utils.logger import setup_logging, get_logger
from src.core import route_engine
from src.core.config import Config

# Configura logging
setup_logging()
logger = get_logger(__name__)


def main():
    """
    Pré-carrega o grafo do OSM.
    """
    logger.info("=" * 60)
    logger.info("PRÉ-CARREGAMENTO DO GRAFO OSM")
    logger.info("=" * 60)

    try:
        # Valida configurações
        Config.validate()
        logger.info(f"Área de serviço: {Config.SERVICE_AREA}")
        logger.info(f"Diretório de cache: {Config.GRAPH_CACHE_DIR}")

        # Inicializa o route engine (baixa o grafo se necessário)
        logger.info("Iniciando carregamento do grafo...")
        success = route_engine.initialize()

        if success:
            logger.info("=" * 60)
            logger.info("✅ GRAFO CARREGADO COM SUCESSO")
            logger.info("=" * 60)

            # Exibe estatísticas
            status = route_engine.get_health_status()
            logger.info(f"Nós: {status.get('graph_nodes', 0):,}")
            logger.info(f"Arestas: {status.get('graph_edges', 0):,}")

            return 0
        else:
            logger.error("=" * 60)
            logger.error("❌ FALHA AO CARREGAR O GRAFO")
            logger.error("=" * 60)
            return 1

    except Exception as e:
        logger.error(f"❌ Erro fatal durante pré-carregamento: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
