-- Listagem casas de banho
SELECT t.toil_id 'ID', t.toil_name 'Nome', t.toil_address 'Endereço', a.acs_name 'Acesso', s.state_name 'Estado', ci.city_name 'Cidade', co.country_name 'País', vw_c.comments 'Quantidade de Comentários', vw_r.avg_clean 'Média de Limpeza', vw_r.ratio_paper 'Porcentagem de Papel', vw_r.avg_structure 'Média de Estrutura', vw_r.avg_accessibility 'Média de Acessibilidade', t.toil_lat 'Latitude', t.toil_long 'Longitude', t.toil_placeid 'Place ID'
FROM toilet t
INNER JOIN city ci ON t.toil_city_id = ci.city_id
INNER JOIN country co ON ci.city_country_id = co.country_id
INNER JOIN access a ON t.toil_acs_id = a.acs_id
INNER JOIN state s ON t.toil_state_id = s.state_id
INNER JOIN vw_rating vw_r ON t.toil_id = vw_r.toil_id
INNER JOIN vw_count_comment_toilet vw_c ON t.toil_id = vw_c.toil_id
ORDER BY t.toil_id;


-- Listagem de extras por casa de banho
SELECT e.extra_id 'ID', t.toil_name 'Nome', te.tex_name 'Tipo'
FROM toilet t
left join extra e ON e.extra_toil_id = t.toil_id
INNER JOIN typeextra te ON e.extra_tex_id = te.tex_id
ORDER BY e.extra_id;


-- Listagem de denúncias de casas de banho
SELECT r.rep_id 'ID', u.user_name 'Usuário', t.toil_name 'Casa de Banho', tr.trp_name 'Tipo', r.rep_cdate 'Data'
FROM report r
INNER JOIN interaction i ON r.rep_int_id = i.int_id
INNER JOIN user u ON i.int_user_id = u.user_id
INNER JOIN toilet t ON i.int_toil_id = t.toil_id
INNER JOIN typereport tr ON r.rep_trp_id = tr.trp_id
ORDER BY r.rep_id;


-- Listagem de reações a comentários
SELECT c.cmm_id 'ID', u.user_name 'Usuário', c.cmm_text 'Comentário', tr.trc_name 'Tipo', r.react_cdate 'Data'
FROM reaction r
INNER JOIN typereaction tr ON r.react_trc_id = tr.trc_id
INNER JOIN comment c ON r.react_cmm_id = c.cmm_id
INNER JOIN user u ON r.react_user_id = u.user_id
ORDER BY c.cmm_id 


-- Listagem de usuários
SELECT u.user_id 'ID', u.user_name 'Nome', u.user_email 'Email', u.user_pwd 'Senha em Hash', u.user_points 'Pontos', vw.comments 'Número de Comentários', u.user_bdate 'Data de Nascimento', u.user_cdate 'Data de Criação'
FROM user u
INNER JOIN vw_count_comment_user vw ON u.user_id = vw.user_id;


-- Listagem de comentários
SELECT c.cmm_id 'ID', u.user_name 'Usuário', t.toil_name 'Casa de Banho', c.cmm_text 'Comentário', c.cmm_rclean 'Média de Limpeza', c.cmm_rpaper 'Porcentagem de Papel', c.cmm_rstructure 'Média de Estrutura', c.cmm_raccessibility 'Média de Acessibilidade', c.cmm_cdatetime 'Data e Hora'
FROM comment c
INNER JOIN interaction i ON i.int_id = c.cmm_int_id
INNER JOIN user u ON i.int_user_id = u.user_id
INNER JOIN toilet t ON i.int_toil_id = t.toil_id
INNER JOIN vw_comment_reaction vw ON c.cmm_id = vw.cmm_id
ORDER BY c.cmm_id;


-- Listagem de casas de banho por proximidade
SELECT t.toil_id 'ID', t.toil_name 'Nome', t.toil_address 'Endereço', a.acs_name 'Acesso', s.state_name 'Estado', ci.city_name 'Cidade', co.country_name 'País', vw_c.comments 'Quantidade de Comentários', vw_r.avg_clean 'Média de Limpeza', vw_r.ratio_paper 'Porcentagem de Papel', vw_r.avg_structure 'Média de Estrutura', vw_r.avg_accessibility 'Média de Acessibilidade', t.toil_lat 'Latitude', t.toil_long 'Longitude', t.toil_placeid 'Place ID'
FROM toilet t
INNER JOIN city ci ON t.toil_city_id = ci.city_id
INNER JOIN country co ON ci.city_country_id = co.country_id
INNER JOIN access a ON t.toil_acs_id = a.acs_id
INNER JOIN state s ON t.toil_state_id = s.state_id
INNER JOIN vw_rating vw_r ON t.toil_id = vw_r.toil_id
INNER JOIN vw_count_comment_toilet vw_c ON t.toil_id = vw_c.toil_id
ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.toil_lat)) * cos(radians(toil_long) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.toil_lat))))


-- Listagem de comentarios por casa de banho
SELECT c.cmm_id 'ID', u.user_name 'Usuário', t.toil_name 'Casa de Banho', c.cmm_text 'Comentário', c.cmm_rclean 'Média de Limpeza', c.cmm_rpaper 'Porcentagem de Papel', c.cmm_rstructure 'Média de Estrutura', c.cmm_raccessibility 'Média de Acessibilidade', c.cmm_cdatetime 'Data e Hora'
FROM comment c
INNER JOIN interaction i ON i.int_id = c.cmm_int_id
INNER JOIN user u ON i.int_user_id = u.user_id
INNER JOIN toilet t ON i.int_toil_id = t.toil_id
INNER JOIN vw_comment_reaction vw ON c.cmm_id = vw.cmm_id
WHERE toil_id = :toil_id
ORDER BY c.cmm_id;


-- Listagem de comentários por utilizador
SELECT c.cmm_id 'ID', u.user_name 'Usuário', t.toil_name 'Casa de Banho', c.cmm_text 'Comentário', c.cmm_rclean 'Média de Limpeza', c.cmm_rpaper 'Porcentagem de Papel', c.cmm_rstructure 'Média de Estrutura', c.cmm_raccessibility 'Média de Acessibilidade', c.cmm_cdatetime 'Data e Hora'
FROM comment c
INNER JOIN interaction i ON i.int_id = c.cmm_int_id
INNER JOIN user u ON i.int_user_id = u.user_id
INNER JOIN toilet t ON i.int_toil_id = t.toil_id
INNER JOIN vw_comment_reaction vw ON c.cmm_id = vw.cmm_id
WHERE user_id = :user_id
ORDER BY c.cmm_id;