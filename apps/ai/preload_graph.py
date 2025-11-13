#!/usr/bin/env python3
"""
Script de download do grafo OSM.

Este script é executado antes do gunicorn iniciar para garantir que o grafo
esteja disponível em cache, evitando timeout durante a inicialização dos workers.
Ele apenas baixa o grafo se não existir, sem carregá-lo em memória.
"""
import sys
import os
import pickle

# Garante que o PYTHONPATH está configurado
sys.path.insert(0, '/app')

from src.utils.logger import setup_logging, get_logger
from src.core.config import Config

# Configura logging
setup_logging()
logger = get_logger(__name__)


def main():
    """
    Baixa o grafo do OSM se não existir em cache.
    Não carrega o grafo em memória, apenas garante que existe.
    """
    logger.info("=" * 60)
    logger.info("VERIFICAÇÃO DO GRAFO OSM")
    logger.info("=" * 60)

    try:
        # Valida configurações
        Config.validate()
        logger.info(f"Área de serviço: {Config.SERVICE_AREA}")
        logger.info(f"Diretório de cache: {Config.GRAPH_CACHE_DIR}")

        # Verifica se existe arquivo de cache
        if Config.GRAPH_FILE_PATH:
            # Caso 1: Arquivo específico configurado
            if os.path.exists(Config.GRAPH_FILE_PATH):
                logger.info(f"✅ Grafo já existe em: {Config.GRAPH_FILE_PATH}")
                return 0
            else:
                logger.error(f"❌ Arquivo configurado não encontrado: {Config.GRAPH_FILE_PATH}")
                return 1
        elif Config.GRAPH_CACHE_DIR:
            # Caso 2: Diretório de cache
            os.makedirs(Config.GRAPH_CACHE_DIR, exist_ok=True)
            cache_file = os.path.join(Config.GRAPH_CACHE_DIR, "graph.pkl")

            if os.path.exists(cache_file):
                logger.info(f"✅ Grafo já existe em cache: {cache_file}")
                logger.info("=" * 60)
                logger.info("✅ VERIFICAÇÃO CONCLUÍDA - GRAFO DISPONÍVEL")
                logger.info("=" * 60)
                return 0
            else:
                # Baixa o grafo
                logger.info(f"Cache não encontrado. Baixando grafo do OSM para: {Config.SERVICE_AREA}")
                import osmnx as ox

                G = ox.graph_from_place(
                    Config.SERVICE_AREA,
                    network_type=Config.NETWORK_TYPE,
                    simplify=Config.SIMPLIFY_GRAPH
                )

                # Adiciona tempo de viagem estimado em cada rua antes de salvar
                logger.info("Adicionando tempo de viagem às arestas...")
                for _, _, _, data in G.edges(keys=True, data=True):
                    data["tempo_viagem"] = data.get("length", 0) / Config.WALKING_SPEED_MPS

                # Salva em formato pickle
                logger.info(f"Salvando grafo em cache: {cache_file}")
                with open(cache_file, 'wb') as f:
                    pickle.dump(G, f, protocol=pickle.HIGHEST_PROTOCOL)

                logger.info("=" * 60)
                logger.info("✅ GRAFO BAIXADO E SALVO COM SUCESSO")
                logger.info("=" * 60)
                logger.info(f"Nós: {len(G.nodes):,}")
                logger.info(f"Arestas: {len(G.edges):,}")

                return 0
        else:
            # Caso 3: Sem cache configurado, não é necessário baixar
            logger.info("⚠️  Cache não configurado. Grafo será baixado durante inicialização.")
            return 0

    except Exception as e:
        logger.error(f"❌ Erro fatal durante verificação do grafo: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
