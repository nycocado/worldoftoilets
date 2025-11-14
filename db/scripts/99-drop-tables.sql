SELECT COUNT(*)
FROM interaction i
WHERE i.user_id = 1
  AND i.discriminator = 'comment'