# Supporters
INSERT INTO Supporter 
	(supporter_id,	last_name,	first_name,	salutation,	alias	) VALUES
	(1,		'Gates',	'William', 	'Mr.', 		'Bill'	),
	(2,		'Gamarra',	'Eric', 	'Mr.', '	Jim'	),
	(3,		'Nguyen',	'Marshall', 	'Pope', 	'Marsh'	),
	(4,		'Madison',	'James', 	'President', 	NULL	),
	(5,		'Monroe',	'James', 	'President', 	NULL	),
	(6,		'Adams',	'John Quincy', 	'President', 	NULL	),
	(7,		'Jackson',	'Andrew', 	'President', 	NULL	),
        (8,		'Carrington',	'Erin', 	'Ms,', 		NULL	),
        (9,		'Rivas',	'Joseph', 	'Mr.', 		'Joe'	),
        (10,		'Moreno',	'James', 	'Mr.', 		'Jim'	),
        (11,		'Pancoast',	'Angela', 	'Mrs.',		'Angie'	),
        (12,		'Southall',	'Corinne', 	'Ms.', 		'Cory'	),
        (13,		'Stilson',	'Michael', 	'Mr.', 		'Mike'	),
        (14,		'Constable',	'Mildred', 	'Mrs.', 	NULL	),
        (15,		'Whitmore',	'William', 	'Mr.', 		'Bill'	),
        (16,		'Fair',		'Shirley', 	'Ms.', 		NULL	),
        (17,		'Bischof',	'Carol', 	'Mrs.', 	NULL	),
        (18,		'Parsons',	'Rebecca', 	'Ms.', 		'Becky'	),
        (19,		'Houser',	'Idella', 	'Mrs.', 	NULL	),
        (20,		'Nullington',	'Nulliam', 	'Mr.', 		NULL	);

# Supporters' Addresses
INSERT INTO Address 
	(supporter_id, 	address_type,	address_line_1, 		address_line_2, 	city, 			state,  zip_code,	is_primary) VALUES
	(1, 		'business', 	'1234 Microsoft Street',	NULL, 			'Seattle', 		'WA',	'90004',	TRUE),
        (1, 		'home', 	'5678 Gates Street',		NULL, 			'Seattle', 		'WA',	'90004',	FALSE),
        (2, 		'business', 	'140 N Berendo St', 		NULL, 			'Los Angeles', 		'CA', 	'90004',	TRUE),
        (3, 		'home', 	'1105 Billionaire Circle', 	NULL, 			'Huntington Beach',	'CA', 	'92647',	TRUE),
        (3, 		'business', 	'1997 Entrepreneur St.', 	NULL, 			'Huntington Beach',	'CA', 	'92647',	FALSE),
        (3, 		'information', 	'117 Informatics St.', 		NULL, 			'Irvine',		'CA', 	'92697',	FALSE),
        (4, 		'home', 	'1600 Pennsylvania Av.',	NULL,			'Washington', 		'DC',	'20500',	TRUE),
        (5, 		'home', 	'1600 Pennsylvania Av.',	NULL,			'Washington', 		'DC',	'20500',	TRUE),
        (6, 		'home', 	'1600 Pennsylvania Av.',	NULL,			'Washington', 		'DC',	'20500',	TRUE),
        (7, 		'home', 	'1600 Pennsylvania Av.',	NULL,			'Washington', 		'DC',	'20500',	TRUE),
	(8, 		'business', 	'555 Collins Avenue', 		NULL, 			'Worthington',		'OH',	'43085',	TRUE),
        (9, 		'home', 	'974 Ferguson Street', 		NULL,			'Holliston',		'MA',	'01746',	TRUE),
        (10, 		'information', 	'262 Abner Road', 		NULL, 			'Stevens Point',	'WI',	'54481',	TRUE),
        (11, 		'business', 	'4873 Sugar Camp Rd.', 		NULL, 			'Owatonna',		'MN',	'55060',	TRUE),
        (12, 		'home', 	'1973 Farland Street', 		NULL, 			'Schiller Park',	'IL',	'60176',	TRUE),
        (13, 		'information', 	'4139 Lyon Avenue', 		NULL, 			'Westboro',		'MA',	'01581',	TRUE),
        (14, 		'home', 	'4002 Oakway Lane', 		NULL, 			'Commerce',		'CA',	'90040',	TRUE),
        (15, 		'business', 	'4424 Glen Street', 		NULL, 			'Madisonville',		'KY',	'40404',	TRUE),
        (16, 		'home', 	'4340 Pursglove Court', 	NULL, 			'Dayton',		'OH',	'45402',	TRUE),
        (17, 		'information', 	'3996 New York Ave.', 		NULL, 			'Los Angeles',		'CA',	'90017',	TRUE),
        (18, 		'business', 	'4186 Milford Street', 		NULL, 			'Manchester',		'NH',	'03101',	TRUE),
        (19, 		'home', 	'2454 Washington St.',		NULL, 			'Beeville',		'TX',	'78102',	TRUE),
        (20, 		NULL	, 	NULL, 				NULL, 			NULL,			NULL,	NULL,		TRUE);

# Supporters' Email Addresses
INSERT INTO Email 
	(supporter_id,	email_address,		is_primary) VALUES
	(1, 		'bgates@gmail.com',	TRUE	),
        (1, 		'bgates@yahoo.com',	FALSE	),
        (2, 		'egamarra@uci.edu',	TRUE	),
        (3, 		'marshaan@uci.edu',	TRUE	),
        (3,		'marshall@gmail.com',	FALSE	),
        (3,		'marshall@yahoo.com',	FALSE	),
        (4, 		'jmadison@wh.gov',	TRUE	),
        (5, 		'jmonroe@wh.gov',	TRUE	),
        (6, 		'jqadams@wh.gov',	TRUE	),
        (7, 		'ajackson@wh.gov',	TRUE	),
        (8,		'ecarrington@gmail.com',TRUE	),
        (9,		'jrivas@yahoo.com',	TRUE	),
        (10,		'jmoreno@aol.com',	TRUE	),
        (11,		'apancoast@gmail.com',	TRUE	),
        (12,		'csouthall@gmail.com',	TRUE	),
        (13,		'mstilson@gmail.com',	TRUE	),
        (14,		'mconst@yahoo.com',	TRUE	),
        (15,		'wwhitmore@aol.com',	TRUE	),
        (16,		'sfair@gmail.com',	TRUE	),
        (17,		'cbischof@yahoo.com',	TRUE	),
        (18,		'rparsons@gmail.com',	TRUE	),
        (19,		'ihouser@gmail.com',	TRUE	),
        (20,		NULL,			TRUE	);

# Supporters' Phone Numbers
INSERT INTO Phone
	(supporter_id,	phone_type,	phone_number,	is_primary) VALUES
	(1, 		'home', 	'213-572-7250',	TRUE),
        (1, 		'mobile', 	'213-386-7562',	FALSE),
        (2, 		'mobile', 	'925-428-4577',	TRUE),
        (3, 		'mobile', 	'714-555-1234',	TRUE),
        (3, 		'home', 	'714-555-5678',	FALSE),
        (3, 		'business',	'714-555-9999',	FALSE),
        (4, 		'mobile', 	'925-428-4577',	TRUE),
        (5,		'mobile',	'559-484-0366',	TRUE),
        (6,		'mobile',	'513-219-0898',	TRUE),
        (7,		'home',		'316-833-8912',	TRUE),
        (7,		'mobile',	'316-461-3806',	FALSE),
        (8,		'home',		'843-298-6257',	TRUE),
        (8,		'mobile',	'843-684-8406',	FALSE),
        (9,		'home',		'757-741-1888',	TRUE),
        (9,		'mobile',	'757-912-4928',	FALSE),
        (10, 		'home', 	'608-372-4786',	TRUE),
        (10,		'mobile', 	'715-612-9834',	FALSE),
        (11, 		'home', 	'412-252-7575',	TRUE),
        (11, 		'mobile', 	'412-523-8667',	FALSE),
        (12, 		'home', 	'630-937-2066',	TRUE),
        (12, 		'mobile', 	'847-212-9904',	FALSE),
        (13,		'mobile',	'915-579-7243',	TRUE),
        (14,		'mobile',	'931-318-0069',	TRUE),
        (15,		'home',		'415-259-6506',	TRUE),
        (16,		'mobile',	'619-437-8681',	TRUE),
        (17,		'mobile',	'619-437-8733',	TRUE),
        (18,		'business',	'973-428-2042',	TRUE),
        (19,		'business',	'305-290-8410',	TRUE),
        (20,		NULL,		NULL,		TRUE);

# Staff Members
INSERT INTO Staff
	(supporter_id,	staff_type,	staff_status	) VALUES
	(2, 		'Employee', 	'Active'	),
        (3, 		'Employee', 	'Active'	),
        (4,		'Volunteer',	'Inactive'	),
        (5,		'Volunteer',	'Inactive'	);

# Donors
INSERT INTO Donor
	(supporter_id,	donor_type,	donor_status	) VALUES # Should last_donation be an attribute in the Donor table derived from the Contribution table? status derived?
	(1,		'Individual',	'Active'	),
        (6,		'Company',	'Lax'		),
        (7,		'Company',	'Lax'		),
        (8,		'Individual',	'Lost'		),
        (9,		'Individual',	'Active'	),
        (10,		'Individual',	'Active'	),
        (11,		'Company',	'Lax'		),
        (12,		'Household',	'Active'	),
        (13,		'Individual',	'Lax'		),
        (14,		'Individual',	'Lax'		),
        (15,		'Household',	'Active'	),
        (16,		'Individual',	'Lax'		),
        (17,		'Company',	'Active'	),
        (18,		'Household',	'Lost'		),
        (19,		'Individual',	'Lost'		),
        (20,		'Individual',	'Active'	);

# Donors' Companies
INSERT INTO Company
	(supporter_id,	company_name,		is_primary) VALUES
	(1, 		'Microsoft',		TRUE),
        (1, 		'Gates Foundation',	FALSE),
        (2,		NULL,			TRUE),
        (3, 		'Marshall Merch',	TRUE),
        (3,		'Boy Scouts',		FALSE),
        (4,		NULL,			TRUE),
        (5,		NULL,			TRUE),
        (6, 		'The White House',	TRUE),
        (7, 		'The White House',	TRUE),
        (8,		NULL,			TRUE),
        (9,		NULL,			TRUE),
        (10,		NULL,			TRUE),
        (11, 		'Facebook',		TRUE),
        (12,		NULL,			TRUE),
        (13,		NULL,			TRUE),
        (14,		NULL,			TRUE),
        (15,		NULL,			TRUE),
        (16,		NULL,			TRUE),
        (17, 		'Google',		TRUE),
        (18,		NULL,			TRUE),
        (19,		NULL,			TRUE),
        (20,		NULL,			TRUE);

# Campaign Types
INSERT INTO CampaignType
	(campaign_type_id,	campaign_type_name			) VALUES
	(1,			'Golf Invitational'			),
        (2,			'Stars & Stripes'			),
        (3,			'Night of Miracles'			),
        (4,			'Spring Basket of Miracles'		),
        (5,			'Thanksgiving Basket of Miracles'	),
        (6,			'Holiday Basket of Miracles'		);

# Campaigns
INSERT INTO Campaign
	(campaign_id,	campaign_name,			campaign_type_id,	is_event,	campaign_date,		theme			) VALUES
	(1,		'Make Children Great Again',	1,			TRUE,		'2016-11-08',		'Presidential Election'	),
        (2,		'Americans for Children',	2,			TRUE,		'2017-07-04',		'Independence Day'	),
        (3,		'Silent Night with Kids',	3,	 		FALSE, 		'2017-12-25', 		'Christmas'		),
        (4,		'Easter Bunny Bash', 		4,	 		TRUE, 		'2018-04-01', 		'Easter'		),
        (5, 		'Turkey Turnout', 		5, 			TRUE, 		'2017-11-23', 		'Thanksgiving'		),
        (6, 		'Christmas Caring',		6, 			FALSE, 		'2018-12-25', 		'Christmas'		),
	(7,		'Play Like Tiger Woods',	1,			TRUE,		'2018-03-17',		'Tiger Woods'		);

# Contributions
INSERT INTO Contribution
	(contrib_id,	item_name,		is_event_item,	contrib_type,	amount, 	pay_method,	destination,		appeal,			thanked,	notes					) VALUES #event_item connected to campaign?
	(1,		'Bill''s Dollar Bills', FALSE, 		'Money', 	1000000, 	'Cash', 	'General', 		'Direct Mail',		TRUE, 		'Jeff Bezos is richer than me now!'	),
        (2,		'Nintendo Switch',	TRUE,		'Goods',	NULL,		NULL,		'Miracle Manor',	'Email Campaign',	FALSE,		'RIP my bank account.'			),
        (3,		'Puppet Show',		FALSE,		'Services',	NULL,		NULL,		'Basket of Miracles',	'Radio Ad',		TRUE,		NULL					),
        (4,		'Futurama Meme',	TRUE,		'Money',	420.69,		'Credit Card',	'Grant Program',	'Sponsorship',		TRUE,		'Shut up and take my money!'		),
        (5,		'Not One Thousand',	TRUE,		'Money',	999.99,		'Check',	'Health & Wellness',	'Fund-a-Need',		TRUE,		'1 cent away from a thousand.'		),
        (6,		'1 AMZN Stock Share',	FALSE,		'Money',	1665.53,	'Stock',	'General',		'Opportunity Ticket',	FALSE,		NULL					),
        (7,		'Barbie Dollhouse',	TRUE,		'Goods',	NULL,		NULL,		'Miracle Manor',	'Silent Auction',	TRUE,		'Made in China.'			),
        (8,		'Justin Bieber Meet',	FALSE,		'Services',	NULL,		NULL,		'Basket of Miracles',	'Live Auction',		FALSE,		'Parent Supervision Required'		);

INSERT INTO Patient
	(patient_id	) VALUES
	(1		),	# Little Bobby
        (2		),	# Little Johnny
        (3		),	# Little Sally
        (4		),	# Little Molly
        (5		);	# Little Timmy
        
INSERT INTO Needs
	(patient_id, 	item) VALUES
		(1,		'Refrigerator'),
        (1, 	'Gas Money'),
        (1, 	'Car'),
        (2, 	'Tutor'),
        (3, 	'Food'),
        (3,		'Medicine'),
        (4,		'Refrigerator');

INSERT INTO Pledge
	(pledge_id,		donor_id,	patient_id,	pledge_date,	target_amount,	is_behind	) VALUES #how does is_behind work?!!!?
	(1,		1,		1,		'2018-01-01',	9000,		false		),
	(2,		6,		2,		'2017-10-25',	100000,		true		),
        (3,		7,		3,		'2016-11-05',	500,		true		),
        (4,		8,		4,		'2018-02-03',	31000,		true		),
        (5,		9,		5,		'2017-03-15',	100000,		false		),
        (6,		10,		1,		'2018-11-23',	55000,		true		),
        (7,		11,		2,		'2018-05-25',	40000,		true		),
        (8,		12,		3,		'2017-03-13',	240000,		false		),
        (9,		13,		4,		'2018-07-17',	1800,		true		),
        (10,	14,		5,		'2016-08-02',	10,		false		),
        (11,	15,		1,		'2018-12-04',	5000,		false		),
        (15,	16,		2,		'2015-09-05',	2500,		true		);

INSERT INTO Installments
	(installment_id,	pledge_id,	amount,	installment_date	) VALUES
	(1,			1,		1000,	'2018-01-01'		),
    (2,			1,		15000,	'2018-09-10'		),
    (3,			3,		400,	'2016-04-23'		);

INSERT INTO Contributes
	(donor_id,	contrib_id,	contrib_date) VALUES
	(1,		1,		'2018-05-05'),
        (1,		2,		'2018-06-15'),
        (8,		3,		'2017-12-21'),
        (9,		4,		'2018-02-14'),
        (10,		5,		'2018-03-17'),
	(11,		6,		'2018-04-20'),
	(12,		7,		'2018-07-11'),
        (13,		8,		'2018-09-21');

INSERT INTO Requests
	(patient_id,	contrib_id	) VALUES
        (1,		1		),
        (1,		2		),
        (2,		3		),
        (3,		4		),
        (4,		5		),
        (5,		6		),
        (5,		7		),
        (5,		8		);

INSERT INTO Works
	(staff_id,	campaign_id) VALUES
        (2,		1),
        (2,		2),
        (2,		3),
        (2,		4),
        (2,		5),
        (2,		6),
        (2,		7),
        (3,		1),
        (3,		2),
        (3,		3),
        (3,		4),
        (3,		5),
        (3,		6),
        (3,		7),
        (4,		1),
        (5,		2);

INSERT INTO Attends
	(donor_id,	campaign_id	) VALUES
        (1,		1		),
        (1,		2		),
        (1,		3		),
        (1,		4		),
        (1,		5		),
        (1,		6		),
        (1,		7		),
        (6,		1		),
        (6,		2		),
        (7,		3		),
        (7,		4		),
        (7,		5		),
        (8,		6		),
        (9,		7		);

INSERT INTO PresentedAt
	(contrib_id,	campaign_id	) VALUES
        (2,		1		),
        (4,		2		),
        (5,		3		),
        (7,		4		);