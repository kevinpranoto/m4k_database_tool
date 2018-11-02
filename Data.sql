
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

INSERT INTO CampaignType(campaign_type_id, campaign_type_name)
VALUES(1, 'Golf Invitational');

INSERT INTO Campaign(campaign_id, campaign_name, campaign_type_id, is_event, campaign_date, theme)
VALUES(1, 'Make America Great Again Fundraiser', 1, true, '2016-11-8', '2016 Presidential Election');

INSERT INTO Contribution(contrib_id, item_name, is_event_item, contrib_type, amount, pay_method, destination, notes, appeal, thanked)
VALUES(1, '', true, 'Money', 1000000, 'Stock', 'General', 'Jeff Bezos is richer than me now.', 'Sponsorship' , true);

/*
`contrib_id` CHAR(10),
`item_name` VARCHAR(20),
`is_event_item` BOOL,
`type` ENUM('Goods', 'Services', 'Money'),
`amount` INTEGER,
`pay_method` ENUM('Cash', 'Credit Card', 'Check', 'Stock'),
`destination` ENUM('General', 'Mirale Manor', 'Bsaket of Miracles', 'Grant Program', 'Health & Wellness'),
`notes` VARCHAR(1000),
`appeal` ENUM('Direct Mail', 'Email Campaign', 'Radio Ad', 'Sponsorship', 'Fund-a-Need', 'Opportunity Ticket', 'Silent Auction', 'Live Auction'), 
`thanked`

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


