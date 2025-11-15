-- ============================================================================
-- 1. ANÁLISE DE UTILIZADORES
-- ============================================================================

-- 1.1. Utilizadores mais ativos (ranking por quantidade de comentários)
-- Retorna os top 10 utilizadores com mais comentários, incluindo as suas informações básicas
SELECT
    u.id,
    u.public_id,
    u.name,
    u.points,
    u.icon,
    COUNT(DISTINCT c.id) as total_comments,
    COUNT(DISTINCT r.id) as total_replies
FROM user u
LEFT JOIN interaction i ON i.user_id = u.id AND i.discriminator = 'comment' AND i.deleted_at IS NULL
LEFT JOIN comment c ON c.interaction_id = i.id AND c.deleted_at IS NULL
LEFT JOIN reply r ON r.user_id = u.id AND r.deleted_at IS NULL
WHERE u.deactivated_at IS NULL
GROUP BY u.id, u.public_id, u.name, u.points, u.icon
ORDER BY total_comments DESC, total_replies DESC
LIMIT 10;

-- 1.2. Utilizadores por faixa etária
-- Agrupa utilizadores por idade e mostra a distribuição
SELECT
    CASE
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) < 18 THEN 'Menor de 18'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 18 AND 25 THEN '18-25'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 26 AND 35 THEN '26-35'
        WHEN TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) BETWEEN 36 AND 50 THEN '36-50'
        ELSE 'Acima de 50'
    END as faixa_etaria,
    COUNT(*) as total_utilizadores,
    AVG(points) as media_pontos
FROM user
WHERE deactivated_at IS NULL
GROUP BY faixa_etaria
ORDER BY MIN(TIMESTAMPDIFF(YEAR, birth_date, CURDATE()));

-- 1.3. Utilizadores com mais pontos (ranking geral)
-- Top 20 utilizadores ordenados por pontuação
SELECT
    u.id,
    u.public_id,
    u.name,
    u.points,
    u.icon,
    u.created_at as membro_desde,
    COUNT(DISTINCT i.id) as total_interacoes
FROM user u
LEFT JOIN interaction i ON i.user_id = u.id AND i.deleted_at IS NULL
WHERE u.deactivated_at IS NULL
GROUP BY u.id, u.public_id, u.name, u.points, u.icon, u.created_at
ORDER BY u.points DESC, total_interacoes DESC
LIMIT 20;

-- ============================================================================
-- 2. ANÁLISE DE CASAS DE BANHO (TOILETS)
-- ============================================================================

-- 2.1. Casas de banho mais bem avaliadas
-- Retorna as casas de banho com melhor média geral de avaliação
SELECT
    t.id,
    t.public_id,
    t.name,
    t.address,
    c.name as cidade,
    co.name as pais,
    a.name as tipo_acesso,
    COUNT(DISTINCT cm.id) as total_avaliacoes,
    ROUND(AVG((cr.clean + cr.structure + cr.accessibility) / 3), 2) as media_geral,
    ROUND(AVG(cr.clean), 2) as media_limpeza,
    ROUND(AVG(cr.structure), 2) as media_estrutura,
    ROUND(AVG(cr.accessibility), 2) as media_acessibilidade,
    ROUND(AVG(CASE WHEN cr.paper = TRUE THEN 100 ELSE 0 END), 2) as percentual_com_papel
FROM toilet t
INNER JOIN city c ON c.id = t.city_id
INNER JOIN country co ON co.id = c.country_id
INNER JOIN access a ON a.id = t.access_id
LEFT JOIN interaction i ON i.toilet_id = t.id AND i.discriminator = 'comment' AND i.deleted_at IS NULL
LEFT JOIN comment cm ON cm.interaction_id = i.id AND cm.deleted_at IS NULL
LEFT JOIN comment_rate cr ON cr.id = cm.id
WHERE t.status = 'active' AND t.deleted_at IS NULL
GROUP BY t.id, t.public_id, t.name, t.address, c.name, co.name, a.name
HAVING total_avaliacoes >= 5
ORDER BY media_geral DESC, total_avaliacoes DESC
LIMIT 20;

-- 2.2. Distribuição de casas de banho por cidade
-- Mostra quantas casas de banho ativas existem em cada cidade
SELECT
    co.name as pais,
    c.name as cidade,
    COUNT(t.id) as total_casas_banho,
    COUNT(DISTINCT p.id) as total_parceiros,
    AVG(
        (SELECT AVG((cr.clean + cr.structure + cr.accessibility) / 3)
         FROM interaction i2
         INNER JOIN comment cm2 ON cm2.interaction_id = i2.id
         INNER JOIN comment_rate cr ON cr.id = cm2.id
         WHERE i2.toilet_id = t.id AND i2.discriminator = 'comment' AND i2.deleted_at IS NULL
        )
    ) as media_avaliacoes_cidade
FROM city c
INNER JOIN country co ON co.id = c.country_id
LEFT JOIN toilet t ON t.city_id = c.id AND t.status = 'active' AND t.deleted_at IS NULL
LEFT JOIN partner p ON p.toilet_id = t.id AND p.status = 'active'
GROUP BY co.name, c.name
ORDER BY total_casas_banho DESC, co.name, c.name;

-- 2.3. Casas de banho com extras/comodidades
-- Lista casas de banho e as suas comodidades disponíveis
SELECT
    t.id,
    t.public_id,
    t.name,
    t.address,
    GROUP_CONCAT(te.name SEPARATOR ', ') as comodidades,
    COUNT(DISTINCT e.id) as total_extras
FROM toilet t
LEFT JOIN extra e ON e.toilet_id = t.id
LEFT JOIN type_extra te ON te.id = e.type_extra_id
WHERE t.status = 'active' AND t.deleted_at IS NULL
GROUP BY t.id, t.public_id, t.name, t.address
ORDER BY total_extras DESC, t.name;

-- 2.4. Casas de banho próximas a uma coordenada (exemplo: busca por proximidade)
-- Encontra casas de banho num raio aproximado (usando cálculo simples de distância)
-- Exemplo: coordenadas de referência (38.7223, -9.1393) - Lisboa
SELECT
    t.id,
    t.public_id,
    t.name,
    t.address,
    t.latitude,
    t.longitude,
    ROUND(
        6371 * ACOS(
            COS(RADIANS(38.7223)) * COS(RADIANS(t.latitude)) *
            COS(RADIANS(t.longitude) - RADIANS(-9.1393)) +
            SIN(RADIANS(38.7223)) * SIN(RADIANS(t.latitude))
        ), 2
    ) as distancia_km,
    a.name as tipo_acesso
FROM toilet t
INNER JOIN access a ON a.id = t.access_id
WHERE t.status = 'active'
    AND t.deleted_at IS NULL
    AND t.latitude BETWEEN 38.6223 AND 38.8223
    AND t.longitude BETWEEN -9.2393 AND -9.0393
ORDER BY distancia_km
LIMIT 20;

-- 2.5. Busca textual de casas de banho (usando FULLTEXT)
-- Pesquisa por nome ou morada usando o índice FULLTEXT
SELECT
    t.id,
    t.public_id,
    t.name,
    t.address,
    c.name as cidade,
    MATCH(t.name, t.address) AGAINST('centro' IN NATURAL LANGUAGE MODE) as relevancia
FROM toilet t
INNER JOIN city c ON c.id = t.city_id
WHERE t.status = 'active'
    AND t.deleted_at IS NULL
    AND MATCH(t.name, t.address) AGAINST('centro' IN NATURAL LANGUAGE MODE)
ORDER BY relevancia DESC
LIMIT 20;

-- ============================================================================
-- 3. ANÁLISE DE COMENTÁRIOS E AVALIAÇÕES
-- ============================================================================

-- 3.1. Comentários recentes com informações completas
-- Lista os comentários mais recentes com dados do utilizador, casa de banho e avaliação
SELECT
    c.id,
    c.public_id,
    c.text,
    c.score,
    c.state,
    u.name as utilizador,
    u.icon as utilizador_icon,
    t.name as casa_banho,
    t.address as morada,
    cr.clean as avaliacao_limpeza,
    cr.structure as avaliacao_estrutura,
    cr.accessibility as avaliacao_acessibilidade,
    cr.paper as tem_papel,
    (SELECT COUNT(*) FROM react r WHERE r.comment_id = c.id AND r.discriminator = 'like') as total_likes,
    (SELECT COUNT(*) FROM react r WHERE r.comment_id = c.id AND r.discriminator = 'dislike') as total_dislikes,
    (SELECT COUNT(*) FROM reply r WHERE r.comment_id = c.id AND r.deleted_at IS NULL) as total_respostas,
    c.created_at
FROM comment c
INNER JOIN interaction i ON i.id = c.interaction_id
INNER JOIN user u ON u.id = i.user_id
INNER JOIN toilet t ON t.id = i.toilet_id
LEFT JOIN comment_rate cr ON cr.id = c.id
WHERE c.deleted_at IS NULL AND c.state = 'visible'
ORDER BY c.created_at DESC
LIMIT 50;

-- 3.2. Estatísticas gerais de avaliação
-- Resumo das médias de avaliação em todo o sistema
SELECT
    COUNT(DISTINCT c.id) as total_avaliacoes,
    COUNT(DISTINCT t.id) as total_casas_banho_avaliadas,
    ROUND(AVG(cr.clean), 2) as media_limpeza_geral,
    ROUND(AVG(cr.structure), 2) as media_estrutura_geral,
    ROUND(AVG(cr.accessibility), 2) as media_acessibilidade_geral,
    ROUND(AVG((cr.clean + cr.structure + cr.accessibility) / 3), 2) as media_geral,
    ROUND(AVG(CASE WHEN cr.paper = TRUE THEN 100 ELSE 0 END), 2) as percentual_com_papel_geral,
    MIN(c.created_at) as primeira_avaliacao,
    MAX(c.created_at) as ultima_avaliacao
FROM comment c
INNER JOIN interaction i ON i.id = c.interaction_id
INNER JOIN toilet t ON t.id = i.toilet_id
INNER JOIN comment_rate cr ON cr.id = c.id
WHERE c.deleted_at IS NULL;

-- 3.3. Comentários com mais envolvimento (likes + respostas)
-- Identifica os comentários mais populares
SELECT
    c.id,
    c.public_id,
    c.text,
    u.name as autor,
    t.name as casa_banho,
    (SELECT COUNT(*) FROM react r WHERE r.comment_id = c.id AND r.discriminator = 'like') as likes,
    (SELECT COUNT(*) FROM react r WHERE r.comment_id = c.id AND r.discriminator = 'dislike') as dislikes,
    (SELECT COUNT(*) FROM reply r WHERE r.comment_id = c.id AND r.deleted_at IS NULL) as respostas,
    (
        (SELECT COUNT(*) FROM react r WHERE r.comment_id = c.id AND r.discriminator = 'like') +
        (SELECT COUNT(*) FROM reply r WHERE r.comment_id = c.id AND r.deleted_at IS NULL)
    ) as envolvimento_total,
    c.created_at
FROM comment c
INNER JOIN interaction i ON i.id = c.interaction_id
INNER JOIN user u ON u.id = i.user_id
INNER JOIN toilet t ON t.id = i.toilet_id
WHERE c.deleted_at IS NULL AND c.state = 'visible'
ORDER BY envolvimento_total DESC, likes DESC
LIMIT 20;

-- ============================================================================
-- 4. ANÁLISE DE INTERAÇÕES
-- ============================================================================

-- 4.1. Distribuição de interações por tipo
-- Mostra quantas interações de cada tipo existem no sistema
SELECT
    discriminator as tipo_interacao,
    COUNT(*) as total,
    COUNT(CASE WHEN deleted_at IS NOT NULL THEN 1 END) as eliminadas,
    COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) as ativas,
    MIN(created_at) as primeira_interacao,
    MAX(created_at) as ultima_interacao
FROM interaction
GROUP BY discriminator
ORDER BY total DESC;

-- 4.2. Utilizadores com mais interações diversificadas
-- Identifica utilizadores que usam diferentes tipos de interação
SELECT
    u.id,
    u.public_id,
    u.name,
    COUNT(DISTINCT i.discriminator) as tipos_interacao_diferentes,
    COUNT(CASE WHEN i.discriminator = 'comment' THEN 1 END) as comentarios,
    COUNT(CASE WHEN i.discriminator = 'view' THEN 1 END) as visualizacoes,
    COUNT(CASE WHEN i.discriminator = 'suggestion' THEN 1 END) as sugestoes,
    COUNT(CASE WHEN i.discriminator = 'report' THEN 1 END) as relatorios,
    COUNT(*) as total_interacoes
FROM user u
INNER JOIN interaction i ON i.user_id = u.id AND i.deleted_at IS NULL
WHERE u.deactivated_at IS NULL
GROUP BY u.id, u.public_id, u.name
ORDER BY tipos_interacao_diferentes DESC, total_interacoes DESC
LIMIT 20;

-- 4.3. Casas de banho mais visualizadas
-- Lista casas de banho com mais visualizações (views)
SELECT
    t.id,
    t.public_id,
    t.name,
    t.address,
    c.name as cidade,
    COUNT(i.id) as total_visualizacoes,
    COUNT(DISTINCT i.user_id) as utilizadores_unicos,
    MAX(i.created_at) as ultima_visualizacao
FROM toilet t
INNER JOIN city c ON c.id = t.city_id
LEFT JOIN interaction i ON i.toilet_id = t.id AND i.discriminator = 'view' AND i.deleted_at IS NULL
WHERE t.status = 'active' AND t.deleted_at IS NULL
GROUP BY t.id, t.public_id, t.name, t.address, c.name
ORDER BY total_visualizacoes DESC
LIMIT 20;

-- ============================================================================
-- 5. ANÁLISE DE DENÚNCIAS E MODERAÇÃO
-- ============================================================================

-- 5.1. Denúncias pendentes por tipo
-- Mostra todas as denúncias aguardando revisão, agrupadas por tipo
SELECT
    'Utilizador' as tipo_denuncia,
    tru.name as motivo,
    COUNT(*) as total_pendentes,
    MIN(ru.created_at) as mais_antigo,
    MAX(ru.created_at) as mais_recente
FROM report_user ru
INNER JOIN type_report_user tru ON tru.id = ru.type_report_user_id
WHERE ru.status = 'pending'
GROUP BY tru.name

UNION ALL

SELECT
    'Casa de Banho' as tipo_denuncia,
    trt.name as motivo,
    COUNT(*) as total_pendentes,
    MIN(rt.created_at) as mais_antigo,
    MAX(rt.created_at) as mais_recente
FROM report_toilet rt
INNER JOIN type_report_toilet trt ON trt.id = rt.type_report_toilet_id
WHERE rt.status = 'pending'
GROUP BY trt.name

UNION ALL

SELECT
    'Comentário' as tipo_denuncia,
    trc.name as motivo,
    COUNT(*) as total_pendentes,
    MIN(rc.created_at) as mais_antigo,
    MAX(rc.created_at) as mais_recente
FROM report_comment rc
INNER JOIN type_report_comment trc ON trc.id = rc.type_report_comment_id
WHERE rc.status = 'pending'
GROUP BY trc.name

UNION ALL

SELECT
    'Resposta' as tipo_denuncia,
    trr.name as motivo,
    COUNT(*) as total_pendentes,
    MIN(rr.created_at) as mais_antigo,
    MAX(rr.created_at) as mais_recente
FROM report_reply rr
INNER JOIN type_report_reply trr ON trr.id = rr.type_report_reply_id
WHERE rr.status = 'pending'
GROUP BY trr.name

ORDER BY tipo_denuncia, total_pendentes DESC;

-- 5.2. Desempenho de moderadores
-- Analisa a atividade dos moderadores nas revisões
SELECT
    u.id,
    u.name as moderador,
    COUNT(DISTINCT ru.id) as denuncias_utilizador_revistas,
    COUNT(DISTINCT rt.id) as denuncias_casa_banho_revistas,
    COUNT(DISTINCT rc.id) as denuncias_comentario_revistas,
    COUNT(DISTINCT rr.id) as denuncias_resposta_revistas,
    COUNT(DISTINCT s.id) as sugestoes_revistas,
    COUNT(DISTINCT p.id) as parceiros_revistos,
    (
        COUNT(DISTINCT ru.id) + COUNT(DISTINCT rt.id) +
        COUNT(DISTINCT rc.id) + COUNT(DISTINCT rr.id) +
        COUNT(DISTINCT s.id) + COUNT(DISTINCT p.id)
    ) as total_revisoes
FROM user u
LEFT JOIN report_user ru ON ru.reviewed_by_id = u.id
LEFT JOIN report_toilet rt ON rt.reviewed_by_id = u.id
LEFT JOIN report_comment rc ON rc.reviewed_by_id = u.id
LEFT JOIN report_reply rr ON rr.reviewed_by_id = u.id
LEFT JOIN suggestion s ON s.reviewed_by_id = u.id
LEFT JOIN partner p ON p.reviewed_by_id = u.id
WHERE u.deactivated_at IS NULL
GROUP BY u.id, u.name
HAVING total_revisoes > 0
ORDER BY total_revisoes DESC;

-- ============================================================================
-- 6. ANÁLISE DE SUGESTÕES E PARCEIROS
-- ============================================================================

-- 6.1. Sugestões por estado
-- Mostra o estado atual das sugestões de novas casas de banho
SELECT
    s.status,
    COUNT(*) as total,
    COUNT(DISTINCT i.user_id) as utilizadores_diferentes,
    MIN(s.created_at) as primeira_sugestao,
    MAX(s.created_at) as ultima_sugestao,
    AVG(CASE
        WHEN s.reviewed_at IS NOT NULL
        THEN TIMESTAMPDIFF(HOUR, s.created_at, s.reviewed_at)
    END) as media_horas_para_revisao
FROM suggestion s
INNER JOIN interaction i ON i.id = s.id
GROUP BY s.status
ORDER BY total DESC;

-- 6.2. Parceiros ativos e as suas estatísticas
-- Lista parceiros com informações sobre as suas casas de banho
SELECT
    p.id,
    p.public_id,
    p.contact_email,
    u.name as utilizador_responsavel,
    t.name as casa_banho,
    t.address as morada,
    c.name as cidade,
    p.status,
    COUNT(DISTINCT i.id) as total_interacoes_casa_banho,
    (
        SELECT AVG((cr.clean + cr.structure + cr.accessibility) / 3)
        FROM interaction i2
        INNER JOIN comment cm ON cm.interaction_id = i2.id
        INNER JOIN comment_rate cr ON cr.id = cm.id
        WHERE i2.toilet_id = t.id AND i2.discriminator = 'comment'
    ) as media_avaliacao_casa_banho,
    p.created_at as parceiro_desde
FROM partner p
INNER JOIN toilet t ON t.id = p.toilet_id
INNER JOIN city c ON c.id = t.city_id
LEFT JOIN user u ON u.id = p.user_id
LEFT JOIN interaction i ON i.toilet_id = t.id AND i.deleted_at IS NULL
WHERE p.status = 'active'
GROUP BY p.id, p.public_id, p.contact_email, u.name, t.name, t.address, c.name, p.status, p.created_at
ORDER BY p.created_at DESC;

-- ============================================================================
-- 7. ANÁLISE TEMPORAL E TENDÊNCIAS
-- ============================================================================

-- 7.1. Atividade por período (últimos 30 dias)
-- Mostra a quantidade de cada tipo de atividade por dia
SELECT
    DATE(created_at) as data,
    COUNT(CASE WHEN discriminator = 'comment' THEN 1 END) as comentarios,
    COUNT(CASE WHEN discriminator = 'view' THEN 1 END) as visualizacoes,
    COUNT(CASE WHEN discriminator = 'suggestion' THEN 1 END) as sugestoes,
    COUNT(CASE WHEN discriminator = 'report' THEN 1 END) as denuncias,
    COUNT(*) as total_interacoes
FROM interaction
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    AND deleted_at IS NULL
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- 7.2. Crescimento de utilizadores por mês
-- Analisa o crescimento da base de utilizadores ao longo do tempo
SELECT
    YEAR(created_at) as ano,
    MONTH(created_at) as mes,
    COUNT(*) as novos_utilizadores,
    SUM(COUNT(*)) OVER (ORDER BY YEAR(created_at), MONTH(created_at)) as total_acumulado
FROM user
WHERE deactivated_at IS NULL
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY ano DESC, mes DESC
LIMIT 12;

-- ============================================================================
-- 8. ANÁLISES COMPLEXAS E INSIGHTS
-- ============================================================================

-- 8.1. Correlação entre número de extras e avaliação
-- Verifica se casas de banho com mais comodidades têm melhores avaliações
SELECT
    COUNT(DISTINCT e.id) as quantidade_extras,
    COUNT(DISTINCT t.id) as total_casas_banho,
    ROUND(AVG(
        (SELECT AVG((cr.clean + cr.structure + cr.accessibility) / 3)
         FROM interaction i
         INNER JOIN comment cm ON cm.interaction_id = i.id
         INNER JOIN comment_rate cr ON cr.id = cm.id
         WHERE i.toilet_id = t.id AND i.discriminator = 'comment' AND i.deleted_at IS NULL
        )
    ), 2) as media_avaliacao
FROM toilet t
LEFT JOIN extra e ON e.toilet_id = t.id
WHERE t.status = 'active' AND t.deleted_at IS NULL
GROUP BY t.id
ORDER BY quantidade_extras;

-- 8.2. Utilizadores influenciadores (com comentários que geram mais reações)
-- Identifica utilizadores cujos comentários recebem mais envolvimento
SELECT
    u.id,
    u.public_id,
    u.name,
    u.points,
    COUNT(DISTINCT c.id) as total_comentarios,
    COUNT(DISTINCT r.id) as total_reacoes_recebidas,
    COUNT(DISTINCT rep.id) as total_respostas_recebidas,
    ROUND(COUNT(DISTINCT r.id) / NULLIF(COUNT(DISTINCT c.id), 0), 2) as media_reacoes_por_comentario,
    ROUND(COUNT(DISTINCT rep.id) / NULLIF(COUNT(DISTINCT c.id), 0), 2) as media_respostas_por_comentario
FROM user u
INNER JOIN interaction i ON i.user_id = u.id AND i.discriminator = 'comment' AND i.deleted_at IS NULL
INNER JOIN comment c ON c.interaction_id = i.id AND c.deleted_at IS NULL
LEFT JOIN react r ON r.comment_id = c.id
LEFT JOIN reply rep ON rep.comment_id = c.id AND rep.deleted_at IS NULL
WHERE u.deactivated_at IS NULL
GROUP BY u.id, u.public_id, u.name, u.points
HAVING total_comentarios >= 5
ORDER BY media_reacoes_por_comentario DESC, media_respostas_por_comentario DESC
LIMIT 20;

-- 8.3. Análise de qualidade por tipo de acesso
-- Compara as médias de avaliação entre diferentes tipos de acesso
SELECT
    a.name as tipo_acesso,
    a.api_name,
    COUNT(DISTINCT t.id) as total_casas_banho,
    COUNT(DISTINCT cm.id) as total_avaliacoes,
    ROUND(AVG(cr.clean), 2) as media_limpeza,
    ROUND(AVG(cr.structure), 2) as media_estrutura,
    ROUND(AVG(cr.accessibility), 2) as media_acessibilidade,
    ROUND(AVG((cr.clean + cr.structure + cr.accessibility) / 3), 2) as media_geral,
    ROUND(AVG(CASE WHEN cr.paper = TRUE THEN 100 ELSE 0 END), 2) as percentual_com_papel
FROM access a
INNER JOIN toilet t ON t.access_id = a.id AND t.status = 'active' AND t.deleted_at IS NULL
LEFT JOIN interaction i ON i.toilet_id = t.id AND i.discriminator = 'comment' AND i.deleted_at IS NULL
LEFT JOIN comment cm ON cm.interaction_id = i.id AND cm.deleted_at IS NULL
LEFT JOIN comment_rate cr ON cr.id = cm.id
GROUP BY a.name, a.api_name
ORDER BY media_geral DESC;

-- ============================================================================
-- 9. DADOS PARA DASHBOARDS E RELATÓRIOS
-- ============================================================================

-- 9.1. KPIs principais do sistema
-- Retorna os principais indicadores de desempenho numa única query
SELECT
    (SELECT COUNT(*) FROM user WHERE deactivated_at IS NULL) as total_utilizadores_ativos,
    (SELECT COUNT(*) FROM toilet WHERE status = 'active' AND deleted_at IS NULL) as total_casas_banho_ativas,
    (SELECT COUNT(*) FROM comment WHERE deleted_at IS NULL) as total_comentarios,
    (SELECT COUNT(*) FROM interaction WHERE discriminator = 'view' AND deleted_at IS NULL) as total_visualizacoes,
    (SELECT COUNT(*) FROM partner WHERE status = 'active') as total_parceiros_ativos,
    (SELECT COUNT(*) FROM suggestion WHERE status = 'pending') as sugestoes_pendentes,
    (SELECT COUNT(*) FROM report_user WHERE status = 'pending') +
    (SELECT COUNT(*) FROM report_toilet WHERE status = 'pending') +
    (SELECT COUNT(*) FROM report_comment WHERE status = 'pending') +
    (SELECT COUNT(*) FROM report_reply WHERE status = 'pending') as total_denuncias_pendentes,
    (SELECT ROUND(AVG((clean + structure + accessibility) / 3), 2) FROM comment_rate) as media_geral_avaliacoes;

-- 9.2. Resumo geográfico completo
-- Hierarquia completa: país > cidade > casas de banho > avaliações
SELECT
    co.name as pais,
    co.api_name as pais_api,
    c.name as cidade,
    c.api_name as cidade_api,
    COUNT(DISTINCT t.id) as total_casas_banho,
    COUNT(DISTINCT cm.id) as total_avaliacoes,
    ROUND(AVG(cr.clean), 2) as media_limpeza,
    ROUND(AVG(cr.structure), 2) as media_estrutura,
    ROUND(AVG(cr.accessibility), 2) as media_acessibilidade,
    ROUND(AVG((cr.clean + cr.structure + cr.accessibility) / 3), 2) as media_geral
FROM country co
INNER JOIN city c ON c.country_id = co.id
LEFT JOIN toilet t ON t.city_id = c.id AND t.status = 'active' AND t.deleted_at IS NULL
LEFT JOIN interaction i ON i.toilet_id = t.id AND i.discriminator = 'comment' AND i.deleted_at IS NULL
LEFT JOIN comment cm ON cm.interaction_id = i.id AND cm.deleted_at IS NULL
LEFT JOIN comment_rate cr ON cr.id = cm.id
GROUP BY co.name, co.api_name, c.name, c.api_name
ORDER BY co.name, c.name;
