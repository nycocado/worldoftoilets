-- Tables
CREATE TABLE
	user (
		user_id INT NOT NULL AUTO_INCREMENT,
		user_name VARCHAR(50) NOT NULL,
		user_email VARCHAR(100) UNIQUE NOT NULL,
		user_pwd VARCHAR(255) NOT NULL,
		user_points INT NOT NULL,
		user_iconid VARCHAR(255),
		user_bdate DATE,
		user_cdate DATE NOT NULL,
		PRIMARY KEY (user_id)
	);

CREATE TABLE
	toilet (
		toil_id INT NOT NULL AUTO_INCREMENT,
		toil_city_id INT NOT NULL,
		toil_acs_id INT NOT NULL,
		toil_state_id INT NOT NULL,
		toil_name VARCHAR(50) NOT NULL,
		toil_lat DOUBLE NOT NULL,
		toil_long DOUBLE NOT NULL,
		toil_address VARCHAR(255) NOT NULL,
		toil_placeid VARCHAR(255) UNIQUE,
		toil_cdate DATE NOT NULL,
		PRIMARY KEY (toil_id),
		FULLTEXT (toil_name, toil_address)
	);

CREATE TABLE
	report (
		rep_id INT NOT NULL AUTO_INCREMENT,
		rep_trp_id INT NOT NULL,
		rep_int_id INT NOT NULL,
		rep_cdate DATE NOT NULL,
		PRIMARY KEY (rep_id),
		UNIQUE (rep_int_id)
	);

CREATE TABLE
	interaction (
		int_id INT NOT NULL AUTO_INCREMENT,
		int_user_id INT NOT NULL,
		int_toil_id INT NOT NULL,
		PRIMARY KEY (int_id),
		UNIQUE (int_user_id, int_toil_id)
	);

CREATE TABLE
	extra (
		extra_id INT NOT NULL AUTO_INCREMENT,
		extra_toil_id INT NOT NULL,
		extra_tex_id INT NOT NULL,
		PRIMARY KEY (extra_id)
	);

CREATE TABLE
	city (
		city_id INT NOT NULL AUTO_INCREMENT,
		city_country_id INT NOT NULL,
		city_name VARCHAR(50) NOT NULL,
		city_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (city_id)
	);

CREATE TABLE
	country (
		country_id INT NOT NULL AUTO_INCREMENT,
		country_name VARCHAR(50) NOT NULL,
		country_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (country_id)
	);

CREATE TABLE
	access (
		acs_id INT NOT NULL AUTO_INCREMENT,
		acs_name VARCHAR(50) NOT NULL,
		acs_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (acs_id)
	);

CREATE TABLE
	typereport (
		trp_id INT NOT NULL AUTO_INCREMENT,
		trp_name VARCHAR(50) NOT NULL,
		trp_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (trp_id)
	);

CREATE TABLE
	typereaction (
		trc_id INT NOT NULL AUTO_INCREMENT,
		trc_name VARCHAR(50) NOT NULL,
		trc_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (trc_id)
	);

CREATE TABLE
	typeextra (
		tex_id INT NOT NULL AUTO_INCREMENT,
		tex_name VARCHAR(50) NOT NULL,
		tex_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (tex_id)
	);

CREATE TABLE
	state (
		state_id INT NOT NULL AUTO_INCREMENT,
		state_name VARCHAR(50) NOT NULL,
		state_technical_name VARCHAR(50) NOT NULL,
		PRIMARY KEY (state_id)
	);

CREATE TABLE
	comment (
		cmm_id INT NOT NULL AUTO_INCREMENT,
		cmm_int_id INT NOT NULL,
		cmm_text VARCHAR(280) NOT NULL,
		cmm_rclean INT NOT NULL,
		cmm_rpaper BOOLEAN NOT NULL,
		cmm_rstructure INT NOT NULL,
		cmm_raccessibility INT NOT NULL,
		cmm_cdatetime DATETIME NOT NULL,
		cmm_score INT NOT NULL,
		PRIMARY KEY (cmm_id)
	);

CREATE TABLE
	reaction (
		react_id INT NOT NULL AUTO_INCREMENT,
		react_user_id INT NOT NULL,
		react_cmm_id INT NOT NULL,
		react_trc_id INT NOT NULL,
		react_cdate DATE NOT NULL,
		PRIMARY KEY (react_id),
		UNIQUE (react_user_id, react_cmm_id)
	);

-- Foreign Keys
ALTER TABLE toilet ADD CONSTRAINT toil_fk_city FOREIGN KEY (toil_city_id) REFERENCES city (city_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE toilet ADD CONSTRAINT toil_fk_access FOREIGN KEY (toil_acs_id) REFERENCES access (acs_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE toilet ADD CONSTRAINT toil_fk_state FOREIGN KEY (toil_state_id) REFERENCES state (state_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE report ADD CONSTRAINT report_fk_typereport FOREIGN KEY (rep_trp_id) REFERENCES typereport (trp_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE report ADD CONSTRAINT report_fk_interaction FOREIGN KEY (rep_int_id) REFERENCES interaction (int_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE interaction ADD CONSTRAINT interaction_fk_user FOREIGN KEY (int_user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE interaction ADD CONSTRAINT interaction_fk_toil FOREIGN KEY (int_toil_id) REFERENCES toilet (toil_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE extra ADD CONSTRAINT extra_fk_toilet FOREIGN KEY (extra_toil_id) REFERENCES toilet (toil_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE extra ADD CONSTRAINT extra_fk_typeextra FOREIGN KEY (extra_tex_id) REFERENCES typeextra (tex_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE city ADD CONSTRAINT city_fk_country FOREIGN KEY (city_country_id) REFERENCES country (country_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE comment ADD CONSTRAINT comment_fk_interaction FOREIGN KEY (cmm_int_id) REFERENCES interaction (int_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE reaction ADD CONSTRAINT reaction_fk_user FOREIGN KEY (react_user_id) REFERENCES user (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE reaction ADD CONSTRAINT reaction_fk_comment FOREIGN KEY (react_cmm_id) REFERENCES comment (cmm_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE reaction ADD CONSTRAINT reaction_fk_typereaction FOREIGN KEY (react_trc_id) REFERENCES typereaction (trc_id) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Views
CREATE VIEW
	vw_comment_reaction AS
SELECT
	c.cmm_id,
	COALESCE(l.likes, 0) AS likes,
	COALESCE(d.dislikes, 0) AS dislikes
FROM
	comment c
	LEFT JOIN (
		SELECT
			react_cmm_id,
			COUNT(*) AS likes
		FROM
			reaction
		WHERE
			react_trc_id = 1
		GROUP BY
			react_cmm_id
	) l ON c.cmm_id = l.react_cmm_id
	LEFT JOIN (
		SELECT
			react_cmm_id,
			COUNT(*) AS dislikes
		FROM
			reaction
		WHERE
			react_trc_id = 2
		GROUP BY
			react_cmm_id
	) d ON c.cmm_id = d.react_cmm_id;

CREATE VIEW
	vw_rating AS
SELECT
	t.toil_id,
	COALESCE(AVG(c.cmm_rclean), 0) AS avg_clean,
	COALESCE(
		(tt.tt_paper_true * 100.0) / COUNT(c.cmm_rpaper),
		0
	) AS ratio_paper,
	COALESCE(AVG(c.cmm_rstructure), 0) AS avg_structure,
	COALESCE(AVG(c.cmm_raccessibility), 0) AS avg_accessibility
FROM
	toilet t
	LEFT JOIN interaction i ON t.toil_id = i.int_toil_id
	LEFT JOIN comment c ON i.int_id = c.cmm_int_id
	LEFT JOIN (
		SELECT
			i.int_toil_id AS tt_id,
			COUNT(c.cmm_rpaper) AS tt_paper_true
		FROM
			comment c
			INNER JOIN interaction i ON i.int_id = c.cmm_int_id
		WHERE
			c.cmm_rpaper = TRUE
		GROUP BY
			i.int_toil_id
	) tt ON t.toil_id = tt.tt_id
GROUP BY
	t.toil_id;

CREATE VIEW
	vw_count_comment_toilet AS
SELECT
	t.toil_id AS toil_id,
	COALESCE(COUNT(c.cmm_id), 0) AS comments
FROM
	toilet t
	LEFT JOIN interaction i ON t.toil_id = i.int_toil_id
	LEFT JOIN comment c ON c.cmm_int_id = i.int_id
GROUP BY
	t.toil_id;

CREATE VIEW
	vw_count_comment_user AS
SELECT
	u.user_id AS user_id,
	COALESCE(COUNT(c.cmm_id), 0) AS comments
FROM
	user u
	LEFT JOIN interaction i ON u.user_id = i.int_user_id
	LEFT JOIN comment c ON c.cmm_int_id = i.int_id
GROUP BY
	u.user_id;

CREATE VIEW
	vw_user_report_comment AS
SELECT
	c.cmm_id,
	r.react_user_id 'user_id'
FROM
	comment c
	LEFT JOIN reaction r ON c.cmm_id = r.react_cmm_id
WHERE
	r.react_trc_id NOT IN (1, 2);

CREATE VIEW
	vw_user_report_toilet AS
SELECT
	i.int_toil_id 'toil_id',
	i.int_user_id 'user_id'
FROM
	interaction i
	INNER JOIN report r ON r.rep_int_id = i.int_id;

CREATE VIEW
	vw_search_toilet AS
SELECT
	t.toil_id,
	t.toil_name
FROM
	toilet t;