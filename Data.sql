
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias)
VALUES (1, 'Gates', 'William', 'Mr.', 'Bill');

INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias)
VALUES (2, 'Gamarra', 'Eric', 'Mr.', 'Jim');

INSERT INTO Address(supporter_id, type, address_line_1, city, state,  zip_code)
VALUES (2, 'work', '140 N Berendo St', 'Los Angeles', 'CA', '90004');

INSERT INTO Email(supporter_id, email_address)
VALUES(1, 'bgates@gmail.com');

INSERT INTO Email(supporter_id, email_address)
VALUES(1, 'bgates@yahoo.com');

INSERT INTO Email(supporter_id, email_address)
VALUES(2, 'egamarra@uci.edu');

INSERT INTO Phone(supporter_id, phone_type, phone_number)
VALUES(1, 'home', '213 572 7250');

INSERT INTO Phone(supporter_id, phone_type, phone_number)
VALUES(1, 'mobile', '213 386 7562');

INSERT INTO Phone(supporter_id, phone_type, phone_number)
VALUES(2, 'mobile', '925 428 4577');


