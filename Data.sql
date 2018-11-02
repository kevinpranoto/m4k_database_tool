
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias)
VALUES (1, 'Gates', 'William', 'Mr.', 'Bill');

INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias)
VALUES (2, 'Gamarra', 'Eric', 'Mr.', 'Jim');

INSERT INTO Address(supporter_id, address_type, address_line_1, city, state,  zip_code)
VALUES (2, 'business', '140 N Berendo St', 'Los Angeles', 'CA', '90004');

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

INSERT INTO Staff(supporter_id, staff_type, staff_status)
VALUES(2, 'Employee', 'Active');

INSERT INTO Donor(supporter_id, donor_type, last_donation, donor_status)
VALUES(1, 'Individual', '2018-11-01', 'Active');

INSERT INTO Campaign(campaign_id, campaign_name, is_event, campaign_date, theme)
VALUES(1, '');

Contribution

/*
`campaign_id` CHAR(10),
`campaign_name` VARCHAR(20),
`is_event` BOOL,
`date` DATE,
`theme` VARCHAR(20),

`supporter_id` CHAR(10),
`donor_type` ENUM('Individual', 'Company', 'Household'),
`last_donation` DATE,
`donor_status` ENUM('Active', 'Lax', 'Lost'),
*/


