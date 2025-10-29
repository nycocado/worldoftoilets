SELECT
    r.id   AS role_id,
    r.name AS role_name,
    p.id   AS permission_id,
    p.name AS permission_name
FROM
    role r
        INNER JOIN
        role_permission rp ON r.id = rp.role_id
        INNER JOIN
        permission p ON rp.permission_id = p.id
ORDER BY
    r.id, p.id;