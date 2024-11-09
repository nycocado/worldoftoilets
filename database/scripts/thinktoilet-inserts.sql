insert into country (country_name) values ('Portugal'); 	
insert into country (country_name) values ('Spain'); 	
insert into country (country_name) values ('France'); 	
insert into country (country_name) values ('Germany'); 	
insert into country (country_name) values ('Italy'); 	
insert into country (country_name) values ('Brazil');
insert into country (country_name) values ('United States');
insert into country (country_name) values ('Australia');


insert into city (city_country_id, city_name) values (1, 'Lisbon');
insert into city (city_country_id, city_name) values (1, 'Porto');
insert into city (city_country_id, city_name) values (1, 'Braga');
insert into city (city_country_id, city_name) values (1, 'Coimbra');
insert into city (city_country_id, city_name) values (2, 'Madrid');
insert into city (city_country_id, city_name) values (2, 'Barcelona');
insert into city (city_country_id, city_name) values (2, 'Valencia');
insert into city (city_country_id, city_name) values (5, 'Rome');
insert into city (city_country_id, city_name) values (5, 'Milan');


insert into access (acs_name) values ('Public');  
insert into access (acs_name) values ('Private');   
insert into access (acs_name) values ('Consumers Only');


insert into typereport (trp_name) values ('False Information');
insert into typereport (trp_name) values ('Unsanitary Conditions');
insert into typereport (trp_name) values ('Privacy Violation');
insert into typereport (trp_name) values ('Maintenance Needed');
insert into typereport (trp_name) values ('Broken Facilities');
insert into typereport (trp_name) values ('Other Concerns');


insert into typereaction (trc_name) values ('Liked');
insert into typereaction (trc_name) values ('Disliked');
insert into typereaction (trc_name) values ('Not Helpful');
insert into typereaction (trc_name) values ('Misleading');
insert into typereaction (trc_name) values ('Inappropriate');
insert into typereaction (trc_name) values ('Offensive');
insert into typereaction (trc_name) values ('Spam');
insert into typereaction (trc_name) values ('Other Concerns');


insert into typeextra (tex_name) values ('Wheelchair Accessible');
insert into typeextra (tex_name) values ('Baby Changing Station');
insert into typeextra (tex_name) values ('Handicap Parking');
insert into typeextra (tex_name) values ('Visual Aids Available');
insert into typeextra (tex_name) values ('Braille Signage');


insert into day (day_name) values ('Monday'); 	
insert into day (day_name) values ('Tuesday');	
insert into day (day_name) values ('Wednesday');	
insert into day (day_name) values ('Thursday');	
insert into day (day_name) values ('Friday'); 	
insert into day (day_name) values ('Saturday'); 
insert into day (day_name) values ('Sunday');


insert into state (state_name) values ('Available');
insert into state (state_name) values ('Closed');
insert into state (state_name) values ('Temporarily Closed');
insert into state (state_name) values ('In Maintenance');
insert into state (state_name) values ('Out of Order');


insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Alice Silva', 'alice@gmail.com', 'password123', 120, 'icon1', STR_TO_DATE('1990-05-14', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Bruno Costa', 'bruno@hotmail.com', 'securepass456', 300, 'icon2', STR_TO_DATE('1985-09-25', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Carla Nunes', 'carla@gmail.com', 'mypassword789', 200, 'icon3', STR_TO_DATE('1992-03-18', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Diego Martins', 'diego@yahoo.com', 'diego_pass', 150, 'icon4', STR_TO_DATE('1988-12-22', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Eva Rocha', 'eva.rocha@gmail.com', 'password_12345', 220, 'icon5', STR_TO_DATE('1995-08-12', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Fábio Souza', 'fabio.souza@gmail.com', 'fabio_pass', 180, 'icon6', STR_TO_DATE('1991-11-30', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Gisele Almeida', 'gisele.almeida@gmail.com', 'gisele123', 250, 'icon7', STR_TO_DATE('1989-07-05', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Henrique Lima', 'henrique.lima@hotmail.com', 'henrique456', 100, 'icon8', STR_TO_DATE('1993-01-15', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Isabel Ferreira', 'isabel.ferreira@gmail.com', 'isabel789', 350, 'icon9', STR_TO_DATE('1984-04-28', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('João Pedro', 'joao.pedro@gmail.com', 'joao_pass', 275, 'icon10', STR_TO_DATE('1990-10-02', '%Y-%m-%d'), CURDATE());
insert into user (user_name, user_email, user_pwd, user_points, user_iconid, user_bdate, user_cdate) values('Larissa Gomes', 'larissa.gomes@hotmail.com', 'larissa123', 320, 'icon11', STR_TO_DATE('1994-06-17', '%Y-%m-%d'), CURDATE());


insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (1, 1, 'Main Mall Restroom', 40.7128, -74.0060, '123 Main St', 'maplink1', CURDATE(), 'image1.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (1, 2, 'Library Restroom', 40.7129, -74.0059, '456 Library Ave', 'maplink2', CURDATE(), 'image2.jpg'); 
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (2, 1, 'Park Restroom', 40.7130, -74.0058, '789 Park St', 'maplink3', CURDATE(), 'image3.jpg');
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (2, 2, 'Office Restroom', 40.7131, -74.0057, '101 Office Ave', 'maplink4', CURDATE(), 'image4.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (3, 1, 'Stadium Restroom', 40.7132, -74.0056, '102 Stadium Blvd', 'maplink5', CURDATE(), 'image5.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (3, 2, 'Shopping Restroom', 40.7133, -74.0055, '103 Shopping Plaza', 'maplink6', CURDATE(), 'image6.jpg');
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (1, 1, 'Central Square Restroom', 40.7140, -74.0040, '150 Central Sq', 'maplink7', CURDATE(), 'image7.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (2, 2, 'City Park Restroom', 40.7150, -74.0030, '200 City Park', 'maplink8', CURDATE(), 'image8.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (3, 1, 'Riverfront Restroom', 40.7160, -74.0020, '300 Riverfront Blvd', 'maplink9', CURDATE(), 'image9.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (1, 2, 'Museum Restroom', 40.7170, -74.0010, '400 Museum Ave', 'maplink10', CURDATE(), 'image10.jpg');  
insert into toilet (toil_city_id, toil_acs_id, toil_name, toil_lat, toil_long, toil_address, toil_placeid, toil_cdate, toil_image) values (2, 1, 'Zoo Restroom', 40.7180, -74.0000, '500 Zoo Ln', 'maplink11', CURDATE(), 'image11.jpg');  


insert into interaction (int_user_id, int_toil_id) values (1, 1);
insert into interaction (int_user_id, int_toil_id) values (1, 2);
insert into interaction (int_user_id, int_toil_id) values (2, 1);
insert into interaction (int_user_id, int_toil_id) values (2, 3);
insert into interaction (int_user_id, int_toil_id) values (3, 2);
insert into interaction (int_user_id, int_toil_id) values (3, 3);
insert into interaction (int_user_id, int_toil_id) values (4, 4);
insert into interaction (int_user_id, int_toil_id) values (5, 5);
insert into interaction (int_user_id, int_toil_id) values (6, 6);
insert into interaction (int_user_id, int_toil_id) values (1, 4);
insert into interaction (int_user_id, int_toil_id) values (2, 5);
insert into interaction (int_user_id, int_toil_id) values (3, 6);


insert into report (rep_trp_id, rep_int_id, rep_cdate) values (1, 1, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (2, 1, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (1, 2, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (3, 3, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (2, 4, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (1, 5, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (2, 6, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (3, 1, CURDATE());
insert into report (rep_trp_id, rep_int_id, rep_cdate) values (1, 4, CURDATE());


insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (1, 1, 1, '09:00:00', '15:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (1, 1, 1, '18:00:00', '22:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (2, 2, 2, '09:00:00', '17:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (3, 3, 1, '07:00:00', '19:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (4, 4, 2, '06:00:00', '20:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (5, 5, 1, '10:00:00', '16:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (6, 1, 1, '08:00:00', '14:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (6, 3, 2, '10:00:00', '16:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (7, 2, 1, '09:30:00', '15:30:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (7, 4, 2, '11:00:00', '20:00:00', CURDATE());
insert into functime (ft_toil_id, ft_day_id, ft_state_id, ft_timestart, ft_timeend, ft_cdate) values (8, 5, 1, '12:00:00', '18:00:00', CURDATE());


insert into extra (extra_toil_id, extra_tex_id) values (1, 1);
insert into extra (extra_toil_id, extra_tex_id) values (2, 2);
insert into extra (extra_toil_id, extra_tex_id) values (3, 3);
insert into extra (extra_toil_id, extra_tex_id) values (4, 4);
insert into extra (extra_toil_id, extra_tex_id) values (5, 5);


insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (1, 'This restroom was impressively clean and accessible. Its spacious and well-maintained, perfect for wheelchair users!', 5, 5, 4, 4, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (1, 'There was no toilet paper available during my visit. Otherwise, it seemed fine, but supply tracking needs improvement.', 3, 1, 3, 2, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (2, 'The restroom was clean, but the hand dryer was broken, and I didnt find any paper towels. Regular checks are necessary.', 4, 5, 2, 3, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (3, 'The restroom needs more attention; it was not very clean, with stains on the floor and an overflowing trash bin.', 2, 4, 2, 4, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (4, 'Accessible but lacking supplies; no hand sanitizer and an empty soap dispenser. These details matter!', 4, 3, 4, 5, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (5, 'Decent experience, but it could be cleaner, especially around the sinks where water accumulates.', 3, 2, 1, 1, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (6, 'Great overall! Clean, well-stocked, and excellent accessibility features made my visit comfortable.', 5, 4, 5, 5, NOW(), 0);
insert into comment (cmm_int_id, cmm_text, cmm_rclean, cmm_rpaper, cmm_rstructure, cmm_raccessibility, cmm_cdatetime, cmm_score) values (5, 'Good accessibility but lacking in supplies. The paper towels were out, and the soap dispenser was low.', 3, 2, 2, 3, NOW(), 0);


insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (1, 1, 1, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (2, 2, 2, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (3, 3, 3, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (4, 4, 4, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (5, 5, 5, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (6, 6, 6, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (1, 7, 1, CURDATE());
insert into reaction (react_user_id, react_cmm_id, react_trc_id, react_cdate) values (2, 8, 2, CURDATE());