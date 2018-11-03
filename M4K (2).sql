DROP DATABASE IF EXISTS `m4k_database`;
CREATE DATABASE `m4k_database`;
USE `m4k_database`;

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
`address_type` ENUM('business', 'home', 'information'),
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
PRIMARY KEY (supporter_id, email_address),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Phone`;
CREATE TABLE `Phone` (
`supporter_id` CHAR(10),
`phone_type` ENUM('business', 'home', 'mobile'),
`phone_number` VARCHAR(15),
PRIMARY KEY (supporter_id, phone_number),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Staff`;
CREATE TABLE `Staff` (
`supporter_id` CHAR(10),
`staff_type` ENUM('Volunteer', 'Employee'),
`staff_status` ENUM('Active', 'Inactive'),
PRIMARY KEY(supporter_id),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS `Donor`;
CREATE TABLE `Donor` (
`supporter_id` CHAR(10),
`donor_type` ENUM('Individual', 'Company', 'Household'),
`last_donation` DATE,
`donor_status` ENUM('Active', 'Lax', 'Lost'),
PRIMARY KEY(supporter_id),
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Company`;
CREATE TABLE `Company` (
`supporter_id` CHAR(10),
`company_name` VARCHAR(30) ,
FOREIGN KEY(supporter_id) REFERENCES Supporter(supporter_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Patient`;
CREATE TABLE `Patient` (
`patient_id` CHAR(10),
PRIMARY KEY(patient_id)
);

DROP TABLE IF EXISTS `Needs`;
CREATE TABLE `Needs` (
`patient_id` CHAR(10),
`item` VARCHAR(20),
FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `CampaignType`;
CREATE TABLE `CampaignType` (
`campaign_type_id` CHAR(10),
`campaign_type_name` VARCHAR(50),
PRIMARY KEY (campaign_type_id)
);

DROP TABLE IF EXISTS `Campaign`;
CREATE TABLE `Campaign` (
`campaign_id` CHAR(10),
`campaign_name` VARCHAR(50),
`campaign_type_id` CHAR(10),
`is_event` BOOL,
`campaign_date` DATE,
`theme` VARCHAR(50),
PRIMARY KEY(campaign_id),
FOREIGN KEY(campaign_type_id) REFERENCES CampaignType(campaign_type_id) ON DELETE CASCADE
);

#ask about appeal and campaign
DROP TABLE IF EXISTS `Contribution`;
CREATE TABLE `Contribution` (
`contrib_id` CHAR(10),
`item_name` VARCHAR(20),
`is_event_item` BOOL,
`contrib_type` ENUM('Goods', 'Services', 'Money'),
`amount` INTEGER,
`pay_method` ENUM('Cash', 'Credit Card', 'Check', 'Stock'),
`destination` ENUM('General', 'Miracle Manor', 'Basket of Miracles', 'Grant Program', 'Health & Wellness'),
`notes` VARCHAR(1000),
`appeal` ENUM('Direct Mail', 'Email Campaign', 'Radio Ad', 'Sponsorship', 'Fund-a-Need', 'Opportunity Ticket', 'Silent Auction', 'Live Auction'), 
`thanked` BOOL,
PRIMARY KEY(contrib_id)
);

DROP TABLE IF EXISTS `Pledges`;
CREATE TABLE `Pledges` (
`donor_id` CHAR(10),
`patient_id` CHAR(10),
`pledge_date` DATE,
`target_amount` DECIMAL,
`is_behind` BOOL,
PRIMARY KEY(donor_id, patient_id),
FOREIGN KEY(donor_id) REFERENCES Donor(supporter_id) ON DELETE CASCADE,
FOREIGN KEY(patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Installments`;
CREATE TABLE `Installments` (
`installment_id` CHAR(10),
`donor_id` CHAR(10),
`patient_id` CHAR(10),
`amount` DECIMAL,
`installment_date` DATE,
PRIMARY KEY (installment_id),
FOREIGN KEY(donor_id) REFERENCES Donor(supporter_id) ON DELETE CASCADE,
FOREIGN KEY(patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Contributes`;
CREATE TABLE `Contributes` (
`donor_id` CHAR(10),
`contrib_id` CHAR(10),
`contrib_date` DATE,
PRIMARY KEY(donor_id, contrib_id),
FOREIGN KEY(donor_id) REFERENCES Donor(supporter_id) ON DELETE CASCADE,
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
`campaign_id` CHAR(10),
PRIMARY KEY(staff_id, campaign_id),
FOREIGN KEY(staff_id) REFERENCES Staff(supporter_id) ON DELETE CASCADE,
FOREIGN KEY(campaign_id) REFERENCES Campaign(campaign_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `Attends`;
CREATE TABLE `Attends` (
`donor_id` CHAR(10),
`campaign_id` CHAR(10),
PRIMARY KEY(donor_id, campaign_id),
FOREIGN KEY(donor_id) REFERENCES Donor(supporter_id) ON DELETE CASCADE,
FOREIGN KEY(campaign_id) REFERENCES Campaign(campaign_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `PresentedAt`;
CREATE TABLE `PresentedAt` (
`contrib_id` CHAR(10),
`campaign_id` CHAR(10),
PRIMARY KEY(contrib_id, campaign_id),
FOREIGN KEY(contrib_id) REFERENCES Contribution(contrib_id) ON DELETE CASCADE,
FOREIGN KEY(campaign_id) REFERENCES Campaign(campaign_id) ON DELETE CASCADE
);