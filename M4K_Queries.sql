#MAIN VIEW
#1. query all donors
SELECT Supporter.last_name, Supporter.first_name, Donor.donor_type, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE
AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE;

#2. query all staffs
SELECT Supporter.last_name, Supporter.first_name, Staff.staff_type, Staff.staff_status, Email.email_address, Phone.phone_number
FROM Supporter, Staff, Email, Phone
WHERE Staff.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE
AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary;

#3. query all patients
SELECT Patient.patient_id, Needs.item
FROM Patient, Needs
WHERE Patient.patient_id = Needs.patient_id;

#4. query all requests
SELECT Patient.patient_id, Contribution.item_name
FROM Requests, Patient, Contribution
WHERE Requests.contrib_id = Contribution.contrib_id AND Requests.patient_id = Patient.patient_id;

#5. query all pledges
SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledges.target_amount, Pledges.pledge_date
FROM Supporter, Patient, Pledges
WHERE Pledges.donor_id = Supporter.supporter_id AND Pledges.patient_id = Patient.patient_id;

#6. query all events
SELECT Campaign.campaign_name, Campaign.campaign_date, Campaign.theme
FROM Campaign
WHERE Campaign.is_event = 1;

#7. query all contributions
SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Supporter.supporter_id = Donor.supporter_id AND Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id;

#DONORS VIEW SEARCH BAR
#Query all donors with keyword
SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Supporter.last_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE
AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Supporter.first_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE
AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Email.email_address LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Phone.phone_number LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Company.company_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE
AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id;

#PATIENTS VIEW
#Query all patients with keyword
SELECT Patient.patient_id, Needs.item
FROM Patient, Needs
WHERE Patient.patient_id LIKE @keyword AND Needs.patient_id = Patient.patient_id
UNION
SELECT Patient.patient_id, Needs.item
FROM Patient, Needs
WHERE Needs.item LIKE @keyword AND Needs.patient_id = Patient.patient_id;

#PLEDGES VIEW
#Query all pledges with keyword
SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledges.target_amount, Pledges.pledge_date
FROM Supporter, Donor, Patient, Pledges
WHERE Supporter.last_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Pledges.donor_id = Supporter.supporter_id
AND Pledges.donor_id = Donor.supporter_id AND Pledges.patient_id = Patient.patient_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledges.target_amount, Pledges.pledge_date
FROM Supporter, Donor, Patient, Pledges
WHERE Supporter.first_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Pledges.donor_id = Supporter.supporter_id
AND Pledges.donor_id = Donor.supporter_id AND Pledges.patient_id = Patient.patient_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledges.target_amount, Pledges.pledge_date
FROM Supporter, Donor, Patient, Pledges
WHERE Patient.patient_id LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Pledges.donor_id = Supporter.supporter_id
AND Pledges.donor_id = Donor.supporter_id AND Pledges.patient_id = Patient.patient_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledges.target_amount, Pledges.pledge_date
FROM Supporter, Donor, Patient, Pledges
WHERE Pledges.target_amount LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Pledges.donor_id = Supporter.supporter_id
AND Pledges.donor_id = Donor.supporter_id AND Pledges.patient_id = Patient.patient_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledges.target_amount, Pledges.pledge_date
FROM Supporter, Donor, Patient, Pledges
WHERE Pledges.pledge_date LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id AND Pledges.donor_id = Supporter.supporter_id
AND Pledges.donor_id = Donor.supporter_id AND Pledges.patient_id = Patient.patient_id;

#REQUESTS VIEW
#Query all requests "with keyword"
SELECT Patient.patient_id, Contribution.item_name
FROM Patient, Contribution, Requests
WHERE Patient.patient_id LIKE @keyword AND Requests.patient_id = Patient.patient_id AND Requests.contrib_id = Contribution.contrib_id
UNION

SELECT Patient.patient_id, Contribution.item_name
FROM Patient, Contribution, Requests
WHERE Contribution.item_name LIKE @keyword AND Requests.patient_id = Patient.patient_id AND Requests.contrib_id = Contribution.contrib_id;

#EVENTS VIEW
#Query all events with keyword
SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.campaign_date
FROM Campaign, CampaignType
WHERE Campaign.campaign_name LIKE @keyword AND CampaignType.campaign_type_id = Campaign.campaign_type_id
UNION

SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.campaign_date
FROM Campaign, CampaignType
WHERE Campaign.campaign_date LIKE @keyword AND CampaignType.campaign_type_id = Campaign.campaign_type_id;

#CONTRIBUTIONS VIEW
#Query all contributions with keyword
SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Supporter.last_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id
AND Contributes.donor_id = Supporter.supporter_id AND Contribution.contrib_id = Contributes.contrib_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Supporter.first_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id
AND Contributes.donor_id = Supporter.supporter_id AND Contribution.contrib_id = Contributes.contrib_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Contribution.item_name LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id
AND Contributes.donor_id = Supporter.supporter_id AND Contribution.contrib_id = Contributes.contrib_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Contribution.contrib_type LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id
AND Contributes.donor_id = Supporter.supporter_id AND Contribution.contrib_id = Contributes.contrib_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Contribution.appeal LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id
AND Contributes.donor_id = Supporter.supporter_id AND Contribution.contrib_id = Contributes.contrib_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes
FROM Supporter, Donor, Contribution, Contributes
WHERE Contribution.notes LIKE @keyword AND Donor.supporter_id = Supporter.supporter_id
AND Contributes.donor_id = Supporter.supporter_id AND Contribution.contrib_id = Contributes.contrib_id;

#EVERYTHING BEFORE THIS WORKS
SET @keyword = '%RIP%';
/*
#INDIVIDUAL DONOR VIEW
#Query all attributes tied to donor_id
SELECT Supporter.supporter_id, Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Donor.donor_type, Donor.last_donation, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name
FROM Supporter, Donor, Email, Phone, Company
WHERE Donor.supporter_id = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id;
/*
#2. query all contribution with donor_id
SELECT Contribution.item_name, Contribution.is_event_item
FROM Supporter, Donor, Email, Phone, Company
WHERE Donor.supporter_id = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id;

#3. query all pledges tied with donor_id


#4. query all events tied with donor_id


#5. query all pledges tied with donor_id

/*
#Staff view:
#1. query all attributes tied to staff_id
#2. query all staffs "with keyword"

#Patients view:
#2. query all requests tied to patient_id
#3. query all pledges tied to patient_id
#Events view:
0. query all attributes tied to event_id
1. query all contributions tied to event_id
2. query all staff tied to event_id
3. query all donors tied to event_id [who attends]
#Contribution view:
0. query patient, donor, event tied to contribution_id
#Pledge view:
#1. query patient, donor tied to pledge_id
#Request view:
0. query patient, contribution tied to request_id