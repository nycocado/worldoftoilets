-- Tables

create table user (
					user_id INT NOT NULL auto_increment,
					user_name VARCHAR(50) UNIQUE NOT NULL, 
					user_email VARCHAR(100) UNIQUE NOT NULL,											
					user_pwd VARCHAR(255) NOT NULL, 							
					user_points INT NOT NULL,
					user_iconid VARCHAR(255),
					user_bdate DATE, 
					user_cdate DATE NOT NULL,
					primary key (user_id)	
);
		     		     
create table toilet (
					toil_id INT NOT NULL auto_increment,
					toil_city_id INT NOT NULL,
					toil_acs_id INT NOT NULL,
					toil_name VARCHAR(50) NOT NULL,
					toil_lat DOUBLE NOT NULL,
					toil_long DOUBLE NOT NULL,
					toil_address VARCHAR(255) NOT NULL,
					toil_placeid VARCHAR(255) UNIQUE,
					toil_cdate DATE NOT NULL,
					toil_image VARCHAR(255),
					primary key (toil_id)
);
		           
create table report (
					rep_id INT NOT NULL auto_increment,
					rep_trp_id INT NOT NULL, 			
					rep_int_id INT NOT NULL,
					rep_cdate DATE NOT NULL,
					primary key (rep_id)
);	     
		           
create table interaction (
					int_id INT NOT NULL auto_increment,
					int_user_id INT NOT NULL, 			
					int_toil_id INT NOT NULL, 				
					primary key (int_id)
);
		    
create table functime (
					ft_id INT NOT NULL auto_increment,
          		    ft_toil_id INT NOT NULL,				
					ft_day_id INT NOT NULL,				
					ft_state_id INT NOT NULL,
					ft_timestart TIME NOT NULL,
					ft_timeend TIME NOT NULL,
					ft_cdate DATE NOT NULL,
					primary key (ft_id)
);		
		            		                 		     
create table extra (
					extra_id INT NOT NULL auto_increment,
					extra_toil_id INT NOT NULL,
					extra_tex_id INT NOT NULL,				
					primary key (extra_id)
);

create table city (
					city_id INT NOT NULL auto_increment,
					city_country_id INT NOT NULL,
					city_name VARCHAR(50) NOT NULL,				
					primary key (city_id)
);

create table country (
					country_id INT NOT NULL auto_increment,
					country_name VARCHAR(50) NOT NULL,			
					primary key (country_id)
);

create table access (
					acs_id int not null auto_increment,
					acs_name VARCHAR(50) not null,		
					primary key (acs_id)
);

create table typereport (
					trp_id INT NOT NULL auto_increment,
					trp_name VARCHAR(50) NOT NULL,			
					primary key (trp_id)
);

create table typereaction (
					trc_id INT NOT NULL auto_increment,
					trc_name VARCHAR(50) NOT NULL,			
					primary key (trc_id)
);

create table typeextra (
					tex_id INT NOT NULL auto_increment,
					tex_name VARCHAR(50) NOT NULL,			
					primary key (tex_id)
);

create table day (
					day_id INT NOT NULL auto_increment,
					day_name VARCHAR(50) NOT NULL,		
					primary key (day_id)
);

create table state (
					state_id INT NOT NULL auto_increment,
					state_name VARCHAR(50) NOT NULL,			
					primary key (state_id)
);

create table comment (
					cmm_id INT NOT NULL auto_increment,
					cmm_int_id INT NOT NULL,
					cmm_text VARCHAR(280) NOT NULL,		
					cmm_rclean INT NOT NULL,
					cmm_rpaper BOOLEAN NOT NULL,
					cmm_rstructure INT NOT NULL,
					cmm_raccessibility INT NOT NULL,
					cmm_cdatetime DATETIME NOT NULL,
					cmm_score INT NOT NULL,
					primary key (cmm_id)
);

create table reaction (
					react_id INT NOT NULL auto_increment,
					react_user_id INT NOT NULL,
					react_cmm_id INT NOT NULL,	
					react_trc_id INT NOT NULL,
					react_cdate	DATE NOT NULL,		
					primary key (react_id)
);


-- Foreign Keys

alter table toilet 
add constraint toil_fk_city
foreign key (toil_city_id) references city(city_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
            
alter table toilet 
add constraint toil_fk_access
foreign key (toil_acs_id) references access(acs_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table report
add constraint report_fk_typereport
foreign key (rep_trp_id) references typereport(trp_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
            
alter table report
add constraint report_fk_interaction
foreign key (rep_int_id) references interaction(int_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table interaction
add constraint interaction_fk_user
foreign key (int_user_id) references user(user_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table interaction
add constraint interaction_fk_toil
foreign key (int_toil_id) references toilet(toil_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
            
alter table functime
add constraint functime_fk_toilet
foreign key (ft_toil_id) references toilet(toil_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;  

alter table functime
add constraint functime_fk_day
foreign key (ft_day_id) references day(day_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table functime
add constraint functime_fk_state
foreign key (ft_state_id) references state(state_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table extra 
add constraint extra_fk_toilet
foreign key (extra_toil_id) references toilet(toil_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; 
                        
alter table extra 
add constraint extra_fk_typeextra
foreign key (extra_tex_id) references typeextra(tex_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; 

alter table city 
add constraint city_fk_country
foreign key (city_country_id) references country(country_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; 

alter table comment 
add constraint comment_fk_interaction
foreign key (cmm_int_id) references interaction(int_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; 

alter table reaction
add constraint reaction_fk_user
foreign key (react_user_id) references user(user_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION; 

alter table reaction
add constraint reaction_fk_comment
foreign key (react_cmm_id) references comment(cmm_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table reaction
add constraint reaction_fk_typereaction
foreign key (react_trc_id) references typereaction(trc_id) 
ON DELETE NO ACTION ON UPDATE NO ACTION;


-- Views

CREATE VIEW vw_comment_reaction AS
SELECT
    c.cmm_id,
    COALESCE(l.likes, 0) AS likes,
    COALESCE(d.dislikes, 0) AS dislikes
FROM comment c
LEFT JOIN (
    SELECT react_cmm_id, COUNT(*) AS likes
    FROM reaction
    WHERE react_trc_id = 1
    GROUP BY react_cmm_id
) l ON c.cmm_id = l.react_cmm_id
LEFT JOIN (
    SELECT react_cmm_id, COUNT(*) AS dislikes
    FROM reaction
    WHERE react_trc_id = 2
    GROUP BY react_cmm_id
) d ON c.cmm_id = d.react_cmm_id;

CREATE VIEW vw_rating AS
SELECT
    i.int_toil_id 'toil_id',
    AVG(c.cmm_rclean) 'avg_clean',
    COALESCE((tt.tt_paper_true * 100.0) / COUNT(c.cmm_rpaper), 0) 'ratio_paper',
    AVG(c.cmm_rstructure) 'avg_structure',
    AVG(c.cmm_raccessibility) 'avg_accessibility'
FROM comment c
INNER JOIN interaction i ON i.int_id = c.cmm_int_id
LEFT JOIN (
    SELECT
        i.int_toil_id AS tt_id,
        COUNT(c.cmm_rpaper) AS tt_paper_true
    FROM comment c
    INNER JOIN interaction i ON i.int_id = c.cmm_int_id
    WHERE c.cmm_rpaper = TRUE
    GROUP BY i.int_toil_id
) tt ON i.int_toil_id = tt.tt_id
GROUP BY i.int_toil_id;

CREATE VIEW vw_count_comment_toilet AS
SELECT i.int_toil_id 'toil_id', COUNT(c.cmm_id) 'comments'
FROM interaction i
INNER JOIN comment c ON c.cmm_int_id = i.int_id
GROUP BY i.int_toil_id;

CREATE VIEW vw_count_comment_user AS
SELECT i.int_user_id 'user_id', COUNT(c.cmm_id) 'comments'
FROM interaction i
INNER JOIN comment c ON c.cmm_int_id = i.int_id
GROUP BY i.int_user_id;