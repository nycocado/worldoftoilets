CREATE TABLE
    user
(
    id             INT                                                                               NOT NULL AUTO_INCREMENT,
    name           VARCHAR(50)                                                                       NOT NULL,
    points         INT                                                                               NOT NULL,
    icon           ENUM ('icon-1', 'icon-2', 'icon-3', 'icon-4', 'icon-5', 'icon-6', 'icon-default') NOT NULL DEFAULT 'icon-default',
    birth_date     DATE                                                                              NOT NULL,
    deactivated_by INT                                                                               NULL,
    deactivated_at TIMESTAMP                                                                         NULL,
    created_at     TIMESTAMP                                                                         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP                                                                         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE
    user_credential
(
    id         INT          NOT NULL,
    email      VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (email),
    PRIMARY KEY (id)
);

CREATE TABLE
    user_role
(
    id         INT       NOT NULL AUTO_INCREMENT,
    user_id    INT       NOT NULL,
    role_id    INT       NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (user_id, role_id)
);

CREATE TABLE
    report_user
(
    id                  INT                                      NOT NULL AUTO_INCREMENT,
    type_report_user_id INT                                      NOT NULL,
    user_reported_id    INT                                      NOT NULL,
    user_reporter_id    INT                                      NOT NULL,
    status              ENUM ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_by         INT                                      NULL,
    reviewed_at         TIMESTAMP                                NULL,
    created_at          TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE
    toilet
(
    id          INT                                                  NOT NULL AUTO_INCREMENT,
    city_id     INT                                                  NOT NULL,
    access_id   INT                                                  NOT NULL,
    name        VARCHAR(50)                                          NOT NULL,
    coordinates POINT                                                NOT NULL,
    address     VARCHAR(255)                                         NOT NULL,
    photo_url   VARCHAR(255)                                         NULL,
    place_id    VARCHAR(255)                                         NULL,
    status      ENUM ('active', 'inactive', 'suggested', 'rejected') NOT NULL,
    reviewed_by INT                                                  NULL,
    reviewed_at TIMESTAMP                                            NULL,
    deleted_by  INT                                                  NULL,
    deleted_at  TIMESTAMP                                            NULL,
    created_at  TIMESTAMP                                            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP                                            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FULLTEXT (name, address),
    SPATIAL INDEX (coordinates)
);

CREATE TABLE
    partner
(
    id            INT                                                NOT NULL AUTO_INCREMENT,
    toilet_id     INT                                                NOT NULL,
    user_id       INT                                                NULL,
    certificate   VARCHAR(255)                                       NOT NULL,
    contact_email VARCHAR(100)                                       NOT NULL,
    invite_token  VARCHAR(64)                                        NULL,
    status        ENUM ('invited', 'active', 'inactive', 'rejected') NOT NULL,
    reviewed_by   INT                                                NULL,
    reviewed_at   TIMESTAMP                                          NULL,
    created_at    TIMESTAMP                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP                                          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (toilet_id),
    UNIQUE (invite_token)
);

CREATE TABLE
    report_toilet
(
    id                    INT                                      NOT NULL AUTO_INCREMENT,
    type_report_toilet_id INT                                      NOT NULL,
    interaction_id        INT                                      NOT NULL,
    status                ENUM ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_by           INT                                      NULL,
    reviewed_at           TIMESTAMP                                NULL,
    created_at            TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE
    interaction
(
    id            INT                                              NOT NULL AUTO_INCREMENT,
    user_id       INT                                              NOT NULL,
    toilet_id     INT                                              NOT NULL,
    discriminator ENUM ('comment', 'report', 'suggestion', 'view') NOT NULL,
    deleted_by    INT                                              NULL,
    deleted_at    TIMESTAMP                                        NULL,
    created_at    TIMESTAMP                                        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP                                        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE
    suggestion
(
    id          INT                                      NOT NULL,
    coordinates POINT                                    NOT NULL,
    photo_url   VARCHAR(255)                             NULL,
    status      ENUM ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_by INT                                      NULL,
    reviewed_at TIMESTAMP                                NULL,
    created_at  TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    SPATIAL INDEX (coordinates)
);

CREATE TABLE
    extra
(
    id            INT NOT NULL AUTO_INCREMENT,
    toilet_id     INT NOT NULL,
    type_extra_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    city
(
    id         INT         NOT NULL AUTO_INCREMENT,
    country_id INT         NOT NULL,
    name       VARCHAR(50) NOT NULL,
    api_name   VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    country
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    access
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    type_report_toilet
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    type_report_comment
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    type_report_user
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    type_extra
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    permission
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    role
(
    id       INT         NOT NULL AUTO_INCREMENT,
    name     VARCHAR(50) NOT NULL,
    api_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE
    role_permission
(
    id            INT NOT NULL AUTO_INCREMENT,
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (role_id, permission_id)
);

CREATE TABLE
    comment
(
    id             INT                        NOT NULL AUTO_INCREMENT,
    interaction_id INT                        NOT NULL,
    text           VARCHAR(280)               NOT NULL,
    score          INT                        NOT NULL,
    state          ENUM ('visible', 'hidden') NOT NULL DEFAULT 'visible',
    deleted_by     INT                        NULL,
    deleted_at     TIMESTAMP                  NULL,
    created_at     TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE
    comment_rate
(
    id            INT     NOT NULL,
    clean         INT     NOT NULL CHECK (clean BETWEEN 1 AND 5),
    paper         BOOLEAN NOT NULL,
    structure     INT     NOT NULL CHECK (structure BETWEEN 1 AND 5),
    accessibility INT     NOT NULL CHECK (accessibility BETWEEN 1 AND 5),
    PRIMARY KEY (id)
);

CREATE TABLE
    reply
(
    id         INT                        NOT NULL,
    comment_id INT                        NOT NULL,
    user_id    INT                        NOT NULL,
    text       VARCHAR(280)               NOT NULL,
    state      ENUM ('visible', 'hidden') NOT NULL DEFAULT 'visible',
    deleted_by INT                        NULL,
    deleted_at TIMESTAMP                  NULL,
    created_at TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE
    react
(
    id            INT                                NOT NULL AUTO_INCREMENT,
    user_id       INT                                NOT NULL,
    comment_id    INT                                NOT NULL,
    discriminator ENUM ('like', 'dislike', 'report') NOT NULL,
    created_at    TIMESTAMP                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP                          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE (user_id, comment_id)
);

CREATE TABLE
    report_comment
(
    id                     INT                                      NOT NULL AUTO_INCREMENT,
    type_report_comment_id INT                                      NOT NULL,
    react_id               INT                                      NOT NULL,
    status                 ENUM ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_by            INT                                      NULL,
    reviewed_at            TIMESTAMP                                NULL,
    created_at             TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP                                NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

ALTER TABLE user
    ADD FOREIGN KEY (deactivated_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_user_name (name),
    ADD INDEX idx_user_icon (icon),
    ADD INDEX idx_user_birth_date (birth_date),
    ADD INDEX idx_user_deactivated_at (deactivated_at),
    ADD INDEX idx_user_created_at (created_at);

ALTER TABLE user_credential
    ADD FOREIGN KEY (id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD INDEX idx_user_credential_email (email);

ALTER TABLE user_role
    ADD FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD INDEX idx_user_role_user_id (user_id),
    ADD INDEX idx_user_role_role_id (role_id);

ALTER TABLE report_user
    ADD FOREIGN KEY (type_report_user_id) REFERENCES type_report_user (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD FOREIGN KEY (user_reported_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (user_reporter_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (reviewed_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_report_user_type (type_report_user_id),
    ADD INDEX idx_report_user_reported (user_reported_id),
    ADD INDEX idx_report_user_reporter (user_reporter_id),
    ADD INDEX idx_report_user_status (status),
    ADD INDEX idx_report_user_reviewed_at (reviewed_at),
    ADD INDEX idx_report_user_created_at (created_at);

ALTER TABLE toilet
    ADD FOREIGN KEY (city_id) REFERENCES city (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD FOREIGN KEY (access_id) REFERENCES access (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD FOREIGN KEY (reviewed_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_toilet_city_id (city_id),
    ADD INDEX idx_toilet_access_id (access_id),
    ADD INDEX idx_toilet_place_id (place_id),
    ADD INDEX idx_toilet_status (status),
    ADD INDEX idx_toilet_reviewed_at (reviewed_at),
    ADD INDEX idx_toilet_created_at (created_at);

ALTER TABLE partner
    ADD FOREIGN KEY (toilet_id) REFERENCES toilet (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD FOREIGN KEY (reviewed_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_partner_user_id (user_id),
    ADD INDEX idx_partner_toilet_id (toilet_id),
    ADD INDEX idx_partner_contact_email (contact_email),
    ADD INDEX idx_partner_status (status),
    ADD INDEX idx_partner_reviewed_at (reviewed_at),
    ADD INDEX idx_partner_created_at (created_at);

ALTER TABLE report_toilet
    ADD FOREIGN KEY (type_report_toilet_id) REFERENCES type_report_toilet (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD FOREIGN KEY (interaction_id) REFERENCES interaction (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (reviewed_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_report_toilet_type (type_report_toilet_id),
    ADD INDEX idx_report_toilet_interaction (interaction_id),
    ADD INDEX idx_report_toilet_status (status),
    ADD INDEX idx_report_toilet_reviewed_at (reviewed_at),
    ADD INDEX idx_report_toilet_created_at (created_at);

ALTER TABLE interaction
    ADD FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (toilet_id) REFERENCES toilet (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (deleted_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_interaction_user_id (user_id),
    ADD INDEX idx_interaction_toilet_id (toilet_id),
    ADD INDEX idx_interaction_discriminator (discriminator),
    ADD INDEX idx_interaction_toilet_disc_created (toilet_id, discriminator, created_at),
    ADD INDEX idx_interaction_user_disc_created (user_id, discriminator, created_at),
    ADD INDEX idx_interaction_created_at (created_at);

ALTER TABLE suggestion
    ADD FOREIGN KEY (id) REFERENCES interaction (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (reviewed_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_suggestion_status (status),
    ADD INDEX idx_suggestion_reviewed_at (reviewed_at),
    ADD INDEX idx_suggestion_created_at (created_at);

ALTER TABLE extra
    ADD FOREIGN KEY (toilet_id) REFERENCES toilet (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (type_extra_id) REFERENCES type_extra (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD INDEX idx_extra_toilet_id (toilet_id),
    ADD INDEX idx_extra_type_extra_id (type_extra_id);

ALTER TABLE city
    ADD FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD INDEX idx_city_country_id (country_id),
    ADD INDEX idx_city_api_name (api_name);

ALTER TABLE country
    ADD INDEX idx_country_api_name (api_name);

ALTER TABLE access
    ADD INDEX idx_access_api_name (api_name);

ALTER TABLE type_report_toilet
    ADD INDEX idx_type_report_toilet_api_name (api_name);

ALTER TABLE type_report_comment
    ADD INDEX idx_type_report_comment_api_name (api_name);

ALTER TABLE type_report_user
    ADD INDEX idx_type_report_user_api_name (api_name);

ALTER TABLE type_extra
    ADD INDEX idx_type_extra_api_name (api_name);

ALTER TABLE permission
    ADD INDEX idx_permission_api_name (api_name);

ALTER TABLE role
    ADD INDEX idx_role_api_name (api_name);

ALTER TABLE role_permission
    ADD FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (permission_id) REFERENCES permission (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD INDEX idx_role_permission_role_id (role_id),
    ADD INDEX idx_role_permission_permission_id (permission_id);

ALTER TABLE comment
    ADD FOREIGN KEY (interaction_id) REFERENCES interaction (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (deleted_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_comment_interaction_id (interaction_id),
    ADD INDEX idx_comment_state (state),
    ADD INDEX idx_comment_interaction_created_at (interaction_id, created_at),
    ADD INDEX idx_comment_created_at (created_at);

ALTER TABLE comment_rate
    ADD FOREIGN KEY (id) REFERENCES comment (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE reply
    ADD FOREIGN KEY (comment_id) REFERENCES comment (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (deleted_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_reply_comment_id (comment_id),
    ADD INDEX idx_reply_user_id (user_id),
    ADD INDEX idx_reply_state (state),
    ADD INDEX idx_reply_comment_created_at (comment_id, created_at),
    ADD INDEX idx_reply_created_at (created_at);

ALTER TABLE react
    ADD FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (comment_id) REFERENCES comment (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD INDEX idx_react_comment_id (comment_id),
    ADD INDEX idx_react_user_id (user_id);

ALTER TABLE report_comment
    ADD FOREIGN KEY (type_report_comment_id) REFERENCES type_report_comment (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD FOREIGN KEY (react_id) REFERENCES react (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    ADD FOREIGN KEY (reviewed_by) REFERENCES user (id) ON DELETE SET NULL ON UPDATE NO ACTION,
    ADD INDEX idx_report_comment_type_id (type_report_comment_id),
    ADD INDEX idx_report_comment_react_id (react_id),
    ADD INDEX idx_report_comment_status (status),
    ADD INDEX idx_report_comment_reviewed_at (reviewed_at),
    ADD INDEX idx_report_comment_created_at (created_at);
