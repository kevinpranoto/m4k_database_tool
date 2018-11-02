DROP TABLE IF EXISTS `Supporter`;
CREATE TABLE `Supporter` (
`supporter_id` CHAR(10),
`last_name` VARCHAR(20),
`first_name` VARCHAR(20),
`salutation` VARCHAR(20),
`alias` VARCHAR(20),
PRIMARY KEY (supporter_id)
);

DROP TABLE IF EXISTS `Address`;
CREATE TABLE `Address` (
`supporter_id` CHAR(10),
`type` ENUM('business', 'home', 'information'),
`address_line_1` VARCHAR(30),
`address_line_2` VARCHAR(30),
`city` VARCHAR(30),
`state` VARCHAR(30),
`zip_code` INTEGER,
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Email`;
CREATE TABLE `Email` (
`supporter_id` CHAR(10),
`email_address` VARCHAR(30),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Phone`;
CREATE TABLE `Phone` (
`supporter_id` CHAR(10),
`type` ENUM('business', 'home', 'mobile'),
`phone_number` INTEGER,
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Staff`;
CREATE TABLE `Staff` (
`supporter_id` CHAR(10),
`type` ENUM('Volunteer', 'Employee'),
`status` ENUM('Active', 'Inactive'),
PRIMARY KEY(supporter_id),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Donor`;
CREATE TABLE `Donor` (
`supporter_id` CHAR(10),
`type` ENUM('Individual', 'Company', 'Household'),
`last_donation` DATE,
`status` ENUM('Active', 'Lax', 'Lost'),
PRIMARY KEY(supporter_id),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Company`;
CREATE TABLE `Company` (
`supporter_id` CHAR(10),
`company_name` VARCHAR(30),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Patient`;
CREATE TABLE `Patient` (
`patient_id` CHAR(10),
`first_name` VARCHAR(20),
`last_name` VARCHAR(20),
PRIMARY KEY(patient_id)
);

DROP TABLE IF EXISTS `Needs`;
CREATE TABLE `Needs` (
`patient_id` CHAR(10),
`item` VARCHAR(20),
FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Events`;
CREATE TABLE `Events` (
`event_id` CHAR(10),
`event_name` VARCHAR(20),
`date` DATE,
`theme` VARCHAR(20),
PRIMARY KEY(event_id)
);

#ask about appeal and campaign
DROP TABLE IF EXISTS `Contribution`;
CREATE TABLE `Contribution` (
`contrib_id` CHAR(10),
`item_name` VARCHAR(20),
`is_event_item` BOOL,
`type` ENUM('Goods', 'Services', 'Money'),
`amount` INTEGER,
`pay_method` ENUM('Cash', 'Credit Card', 'Check', 'Stock'),
`destination` ENUM('General', 'Mirale Manor', 'Bsaket of Miracles', 'Grant Program', 'Health & Wellness'),
`notes` VARCHAR(1000),
#`appeal` ENUM('Direct Mail', 'Email Campaign', 'Radio Ad', 'Sponsorship', 'Fund-a-Need', 'Opportunity Ticket', 'Silent Auction', 'Live Auction'), 
PRIMARY KEY(contrib_id)
);

#ask about implementing installments
DROP TABLE IF EXISTS `Pledges`;
CREATE TABLE `Pledges` (
`donor_id` CHAR(10),
`patient_id` CHAR(10),
`pledge_date` DATE,
`target_amount` DECIMAL,
PRIMARY KEY(donor_id, patient_id),
FOREIGN KEY(donor_id) REFERENCES Donor(sid) ON DELETE CASCADE,
FOREIGN KEY(patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Contributes`;
CREATE TABLE `Contributes` (
`donor_id` CHAR(10),
`contrib_id` CHAR(10),
`contrib_date` DATE,
PRIMARY KEY(donor_id, contrib_id),
FOREIGN KEY(donor_id) REFERENCES Donor(sid) ON DELETE CASCADE,
FOREIGN KEY(contrib_id) REFERENCES Contribution(contrib_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Requests`;
CREATE TABLE `Requests` (
`patient_id` CHAR(10),
`contrib_id` CHAR(10),
PRIMARY KEY(patient_id, contrib_id),
FOREIGN KEY(patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
FOREIGN KEY(contrib_id) REFERENCES Contribution(contrib_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Works`;
CREATE TABLE `Works` (
`staff_id` CHAR(10),
`event_id` CHAR(10),
PRIMARY KEY(staff_id, event_id),
FOREIGN KEY(staff_id) REFERENCES Staff(sid) ON DELETE CASCADE,
FOREIGN KEY(event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Attends`;
CREATE TABLE `Attends` (
`donor_id` CHAR(10),
`event_id` CHAR(10),
PRIMARY KEY(donor_id, event_id),
FOREIGN KEY(donor_id) REFERENCES Donor(sid) ON DELETE CASCADE,
FOREIGN KEY(event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Presented_At`;
CREATE TABLE `Presented_At` (
`contrib_id` CHAR(10),
`event_id` CHAR(10),
PRIMARY KEY(contrib_id, event_id),
FOREIGN KEY(contrib_id) REFERENCES Contribution(contrib_id) ON DELETE CASCADE,
FOREIGN KEY(event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);