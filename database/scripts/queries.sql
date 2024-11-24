-- Listagem casas de banho
SELECT toil_id, toil_name, toil_address, city_name, country_name, toil_lat, toil_long, toil_placeid
FROM toilet
INNER JOIN city ON toil_city_id = city_id
INNER JOIN country ON city_country_id = country_id
ORDER BY toil_id


-- Listagem horários de funcionamento por casa de banho
SELECT ft_id, toil_name, day_name , state_name, ft_timestart, ft_timeend
FROM functime
INNER JOIN toilet ON toil_id = ft_toil_id
INNER JOIN state ON state_id = ft_state_id
INNER JOIN day ON day_id = ft_day_id
ORDER BY ft_id


-- Listagem de extras por casa de banho
SELECT extra_id, toil_name, tex_name
FROM toilet
left join extra ON extra_toil_id = toil_id
INNER JOIN typeextra ON extra_tex_id = tex_id


-- Listagem de denúncias de casas de banho
SELECT user_name, toil_name, rep_cdate, trp_name
FROM report
INNER JOIN interaction ON rep_int_id = int_id
INNER JOIN user ON int_user_id = user_id
INNER JOIN toilet ON int_toil_id = toil_id
INNER JOIN typereport ON rep_trp_id = trp_id
ORDER BY user_name


-- Listagem de reações a comentários
SELECT cmm_id, user_name, cmm_text, react_cdate, trc_name
FROM reaction
INNER JOIN typereaction ON react_trc_id = trc_id
INNER JOIN comment ON react_cmm_id = cmm_id
INNER JOIN user ON react_user_id = user_id
ORDER BY cmm_id 


-- Listagem de usuários
SELECT u.user_id, vw.comments, u.user_name, u.user_email, u.user_pwd, u.user_points, u.user_bdate, u.user_cdate 
FROM user u
INNER JOIN vw_count_comment_user vw ON u.user_id = vw.user_id;


-- Listagem de comentários
SELECT c.cmm_id, user_name, toil_name, c.cmm_text, c.cmm_rclean, c.cmm_rpaper, c.cmm_rstructure, c.cmm_raccessibility, c.cmm_cdatetime
FROM comment c
INNER JOIN interaction ON int_id = cmm_int_id
INNER JOIN user ON int_user_id = user_id
INNER JOIN toilet ON int_toil_id = toil_id
INNER JOIN vw_comment_reaction vw ON c.cmm_id = vw.cmm_id
ORDER BY c.cmm_id;


-- Listagem de casas de banho por proximidade
SELECT toil_id, toil_name, toil_address, city_name, country_name, toil_lat, toil_long, toil_placeid
FROM toilet
INNER JOIN city ON toil_city_id = city_id
INNER JOIN country ON city_country_id = country_id
ORDER BY (6371 * acos(cos(radians(:lat)) * cos(radians(t.latitude)) * cos(radians(t.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(t.latitude))))


-- Listagem de comentarios por casa de banho
SELECT c.cmm_id, user_name, toil_name, c.cmm_text, c.cmm_rclean, c.cmm_rpaper, c.cmm_rstructure, c.cmm_raccessibility, c.cmm_cdatetime
FROM comment c
INNER JOIN interaction ON int_id = cmm_int_id
INNER JOIN user ON int_user_id = user_id
INNER JOIN toilet ON int_toil_id = toil_id
INNER JOIN vw_comment_reaction vw ON c.cmm_id = vw.cmm_id
WHERE toil_id = :toil_id
ORDER BY c.cmm_id;


-- Listagem de comentários por utilizador
SELECT c.cmm_id, user_name, toil_name, c.cmm_text, c.cmm_rclean, c.cmm_rpaper, c.cmm_rstructure, c.cmm_raccessibility, c.cmm_cdatetime
FROM comment c
INNER JOIN interaction ON int_id = cmm_int_id
INNER JOIN user ON int_user_id = user_id
INNER JOIN toilet ON int_toil_id = toil_id
INNER JOIN vw_comment_reaction vw ON c.cmm_id = vw.cmm_id
WHERE user_id = :user_id
ORDER BY c.cmm_id;