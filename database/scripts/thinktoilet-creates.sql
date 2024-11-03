create table user (
					user_id INT NOT NULL auto_increment,
					user_name VARCHAR(50) NOT NULL, 
					user_email VARCHAR(100) NOT NULL,											
					user_pwd VARCHAR(255) NOT NULL, 							
					user_points INT,
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
					toil_mapsid VARCHAR(255),
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
					cmm_rpaper INT NOT NULL,
					cmm_rstructure INT NOT NULL,
					cmm_raccessibility INT NOT NULL,
					cmm_cdatetime DATETIME NOT NULL,
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