"""
Motor de Cálculo de Rotas.

Este módulo é responsável por carregar o mapa de ruas de Lisboa usando OSMnx
e calcular rotas ótimas entre dois pontos usando o algoritmo A* (A-star).
"""
import osmnx as ox
import heapq
import math
from shapely.geometry import Point
from typing import Optional, Tuple, List, Dict, Any
from src.core.config import Config
from src.utils.logger import get_logger

logger = get_logger(__name__)

# --- VARIÁVEIS DE ESTADO (carregadas na inicialização) ---
G = None  #: Grafo de ruas não projetado (lat/lon)
G_proj = None  #: Grafo de ruas projetado (coordenadas cartesianas)
boundary_polygon = None  #: Polígono que define a área de serviço


def initialize() -> bool:
    """
    Carrega o mapa de ruas e prepara o sistema de rotas.
    
    Esta função deve ser chamada uma única vez durante a inicialização do servidor.
    Ela carrega o grafo de ruas de Lisboa usando OSMnx, adiciona pesos de tempo
    de viagem às arestas, cria uma versão projetada para cálculos euclidianos
    e define a área de serviço.
    
    Returns:
        bool: True se o mapa foi carregado com sucesso, False caso contrário
        
    Side Effects:
        - Define as variáveis globais G, G_proj e boundary_polygon
        - Imprime mensagens de status no console
        
    Example:
        >>> if initialize():
        ...     print("Sistema pronto")
        ... else:
        ...     print("Erro ao inicializar")
    """
    global G, G_proj, boundary_polygon
    
    logger.info(f"Carregando mapa de {Config.SERVICE_AREA}...")
    
    try:
        # Carrega o grafo de ruas
        if Config.GRAPH_FILE_PATH:
            logger.info(f"Tentando carregar grafo do arquivo: {Config.GRAPH_FILE_PATH}")
            G = ox.load_graphml(Config.GRAPH_FILE_PATH)
        else:
            logger.info(f"Baixando grafo do OSM para: {Config.SERVICE_AREA}")
            G = ox.graph_from_place(
                Config.SERVICE_AREA, 
                network_type=Config.NETWORK_TYPE, 
                simplify=Config.SIMPLIFY_GRAPH
            )
            
            # Salva o grafo se houver diretório de cache
            if Config.GRAPH_CACHE_DIR:
                import os
                os.makedirs(Config.GRAPH_CACHE_DIR, exist_ok=True)
                cache_file = os.path.join(Config.GRAPH_CACHE_DIR, "graph.graphml")
                ox.save_graphml(G, cache_file)
                logger.info(f"Grafo salvo em cache: {cache_file}")
        
        # Adiciona tempo de viagem estimado em cada rua
        for _, _, _, data in G.edges(keys=True, data=True):
            data["tempo_viagem"] = data.get("length", 0) / Config.WALKING_SPEED_MPS
        
        # Cria versão projetada (necessária para cálculos de distância euclidiana)
        G_proj = ox.project_graph(G)
        
        # Carrega a fronteira geográfica da área
        gdf = ox.geocode_to_gdf(Config.SERVICE_AREA)
        boundary_polygon = gdf.unary_union
        
        logger.info("✅ Mapa carregado com sucesso.")
        print(Config.display())
        return True
        
    except Exception as e:
        logger.error(f"❌ Erro ao carregar o mapa: {e}", exc_info=True)
        return False


def is_point_in_service_area(lat: float, lon: float) -> bool:
    """
    Verifica se um ponto está dentro da área de serviço.
    
    Args:
        lat: Latitude do ponto em graus decimais
        lon: Longitude do ponto em graus decimais
        
    Returns:
        bool: True se o ponto está dentro da área de serviço (Lisboa),
              False caso contrário ou se o mapa não foi carregado
              
    Example:
        >>> is_point_in_service_area(38.7223, -9.1393)  # Centro de Lisboa
        True
        >>> is_point_in_service_area(41.1579, -8.6291)  # Porto
        False
    """
    if boundary_polygon is None:
        return False
    return boundary_polygon.contains(Point(lon, lat))


def calculate_route(
    origin_lat: float, 
    origin_lon: float, 
    dest_lat: float, 
    dest_lon: float
) -> Dict[str, Any]:
    """
    Calcula a rota mais curta entre origem e destino usando algoritmo A*.
    
    Args:
        origin_lat: Latitude do ponto de origem em graus decimais
        origin_lon: Longitude do ponto de origem em graus decimais
        dest_lat: Latitude do ponto de destino em graus decimais
        dest_lon: Longitude do ponto de destino em graus decimais
        
    Returns:
        dict: Dicionário com o resultado do cálculo
            Em caso de sucesso:
                {
                    'success': True,
                    'path': List[Tuple[float, float]],  # Lista de (lon, lat)
                    'stats': {
                        'distance_meters': float,
                        'time_seconds': float,
                        'nodes_in_path': int,
                        'nodes_expanded': int
                    }
                }
            Em caso de erro:
                {
                    'success': False,
                    'error': str  # 'MAP_NOT_LOADED' ou 'NO_ROUTE_FOUND'
                }
                
    Example:
        >>> result = calculate_route(38.7072, -9.1365, 38.7139, -9.1334)
        >>> if result['success']:
        ...     print(f"Distância: {result['stats']['distance_meters']}m")
    """
    if not all([G, G_proj]):
        logger.error("Tentativa de calcular rota sem mapa carregado")
        return {"success": False, "error": "MAP_NOT_LOADED"}
    
    try:
        # Encontra os nós (cruzamentos) mais próximos das coordenadas
        start_node = ox.nearest_nodes(G, X=origin_lon, Y=origin_lat)
        end_node = ox.nearest_nodes(G, X=dest_lon, Y=dest_lat)
        
        logger.debug(f"Calculando rota de {start_node} para {end_node}")
        
        # Executa o algoritmo A*
        path_nodes, nodes_expanded = _a_star_search(start_node, end_node)
        
        if not path_nodes:
            logger.warning(f"Nenhuma rota encontrada entre ({origin_lat},{origin_lon}) e ({dest_lat},{dest_lon})")
            return {"success": False, "error": "NO_ROUTE_FOUND"}
        
        # Calcula estatísticas da rota
        distance_m, time_s = _calculate_path_stats(path_nodes)
        
        # Converte nós em coordenadas geográficas
        path_coords = [(G.nodes[node]['x'], G.nodes[node]['y']) for node in path_nodes]
        
        logger.info(f"Rota calculada: {distance_m:.2f}m, {time_s:.2f}s, {len(path_nodes)} nós")
        
        return {
            "success": True,
            "path": path_coords,
            "stats": {
                "distance_meters": round(distance_m, 2),
                "time_seconds": round(time_s, 2),
                "nodes_in_path": len(path_nodes),
                "nodes_expanded": nodes_expanded
            }
        }
    except Exception as e:
        logger.error(f"Erro ao calcular rota: {e}", exc_info=True)
        return {"success": False, "error": "CALCULATION_ERROR"}


def _a_star_search(start_node: int, end_node: int) -> Tuple[Optional[List[int]], int]:
    """
    Implementação do algoritmo A* para busca de caminho mais curto.
    
    Args:
        start_node: ID do nó inicial no grafo
        end_node: ID do nó final no grafo
        
    Returns:
        tuple: (path, nodes_expanded)
            - path: Lista de IDs dos nós no caminho, ou None se não encontrado
            - nodes_expanded: Número de nós explorados durante a busca
            
    Note:
        Utiliza a distância euclidiana no grafo projetado como heurística.
    """
    def heuristic(node1: int, node2: int) -> float:
        """
        Calcula a distância euclidiana entre dois nós.
        
        Args:
            node1: ID do primeiro nó
            node2: ID do segundo nó
            
        Returns:
            float: Distância euclidiana em metros (no grafo projetado)
        """
        x1, y1 = G_proj.nodes[node1]['x'], G_proj.nodes[node1]['y']
        x2, y2 = G_proj.nodes[node2]['x'], G_proj.nodes[node2]['y']
        return math.sqrt((x1 - x2)**2 + (y1 - y2)**2)
    
    g_costs = {start_node: 0.0}
    came_from = {start_node: None}
    open_set = [(0.0, start_node)]
    nodes_expanded = 0
    
    while open_set:
        _, current = heapq.heappop(open_set)
        nodes_expanded += 1
        
        if current == end_node:
            # Reconstrói o caminho
            path = []
            while current is not None:
                path.append(current)
                current = came_from.get(current)
            return path[::-1], nodes_expanded
        
        for neighbor in G.neighbors(current):
            edge_length = min(
                data.get("length", float('inf')) 
                for data in G[current][neighbor].values()
            )
            
            tentative_g = g_costs[current] + edge_length
            
            if tentative_g < g_costs.get(neighbor, float('inf')):
                g_costs[neighbor] = tentative_g
                came_from[neighbor] = current
                f_cost = tentative_g + heuristic(neighbor, end_node)
                heapq.heappush(open_set, (f_cost, neighbor))
    
    return None, nodes_expanded


def _calculate_path_stats(path: List[int]) -> Tuple[float, float]:
    """
    Calcula a distância total e tempo de viagem de um caminho.
    
    Args:
        path: Lista de IDs dos nós que compõem o caminho
        
    Returns:
        tuple: (distance, time)
            - distance: Distância total em metros
            - time: Tempo estimado de viagem em segundos
            
    Example:
        >>> path = [123, 456, 789]
        >>> distance, time = _calculate_path_stats(path)
        >>> print(f"{distance:.2f}m em {time:.2f}s")
    """
    if not path or len(path) < 2:
        return 0.0, 0.0
    
    total_distance = 0.0
    total_time = 0.0
    
    for u, v in zip(path[:-1], path[1:]):
        edge_data = min(
            G.get_edge_data(u, v).values(), 
            key=lambda d: d['length']
        )
        total_distance += edge_data.get('length', 0)
        total_time += edge_data.get('tempo_viagem', 0)
    
    return total_distance, total_time


def get_health_status() -> Dict[str, Any]:
    """
    Retorna o status de saúde do serviço.
    
    Returns:
        dict: Status de saúde com informações do grafo
    """
    return {
        "healthy": G is not None and G_proj is not None,
        "graph_loaded": G is not None,
        "graph_nodes": len(G.nodes) if G else 0,
        "graph_edges": len(G.edges) if G else 0,
        "service_area": Config.SERVICE_AREA
    }
