# Supporters
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (1, 'Gates', 'William', 'Mr.', 'Bill');
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (2, 'Gamarra', 'Eric', 'Mr.', 'Jim');
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (3, 'Nguyen', 'Marshall', 'HRH the Prince of Memebridge', NULL);
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (4, 'Madison', 'James', 'President', NULL);
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (5, 'Monroe', 'James', 'President', NULL);
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (6, 'Adams', 'John Quincy', 'President', NULL);
INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (7, 'Jackson', 'Andrew', 'President', NULL);

# Supporters' Addresses
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (1, 'business', '1234 Microsoft Street', 'Seattle', 'WA', '90004');
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (2, 'business', '140 N Berendo St', 'Los Angeles', 'CA', '90004');
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (3, 'home', '1105 Billionaire Circle', 'Huntington Beach', 'CA', '92647');
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (4, 'home', '9365 Bison Street', 'Irvine', 'CA', '92697');
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (5, 'home', '1105 Billionaire Circle', 'Huntington Beach', 'CA', '92647');
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (6, 'information', '1105 Billionaire Circle', 'Huntington Beach', 'CA', '92647');
INSERT INTO Address (supporter_id, address_type, address_line_1, city, state,  zip_code) VALUES (7, 'information', '1105 Billionaire Circle', 'Huntington Beach', 'CA', '92647');

# Supporters' Emails
INSERT INTO Email (supporter_id, email_address) VALUES (1, 'bgates@gmail.com');
INSERT INTO Email (supporter_id, email_address) VALUES (1, 'bgates@yahoo.com');

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

INSERT INTO Patient(patient_id)
	VALUES(1);

INSERT INTO Pledges(donor_id, patient_id, pledge_date, target_amount, is_behind) #how does is_behind work?!!!?
	VALUES(1, 1, '2018-11-06', 9000, false);

INSERT INTO Installments(installment_id, donor_id, patient_id, amount, installment_date)
	VALUES(1, 1, 1, 1000, '2018-01-01');

INSERT INTO Contributes(donor_id, contrib_id, contrib_date)
	VALUES(1, 1, '2018-05-05');

INSERT INTO Requests(patient_id, contrib_id)
	VALUES(1, 1);

INSERT INTO Works(staff_id, campaign_id)
	VALUES(2, 1);

INSERT INTO Attends(donor_id, campaign_id)
	VALUES (1, 1);

INSERT INTO PresentedAt(contrib_id, campaign_id)
	VALUES(1, 1);

