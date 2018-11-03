#Main View/Donor View queries

#1. query all donors
SELECT *
FROM Donor, Supporter
WHERE Donor.supporter_id = Supporter.supporter_id;

#2. query all staffs
SELECT *
FROM Supporter, Staff
WHERE Staff.supporter_id = Supporter.supporter_id;

#3. query all patients
SELECT *
from Patient;

#4. query all requests
SELECT *
FROM Requests, Contribution
WHERE Requests.contrib_id = Contribution.contrib_id;

#5. query all pledges
SELECT *
FROM Pledges, Supporter
WHERE Pledges.donor_id = Supporter.supporter_id;

#6. query all events
SELECT *
FROM Campaign
WHERE Campaign.is_event=1;

#7. query all contributions
SELECT *
FROM Contribution;

SET @keyword = 'Google';

#8. query all donors "with keyword"
SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Donor, Supporter, Email, Phone, Company
WHERE Supporter.last_name = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Donor, Supporter, Email, Phone, Company
WHERE Supporter.first_name = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Donor, Supporter, Email, Phone, Company
WHERE Email.email_address = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Donor, Supporter, Email, Phone, Company
WHERE Phone.phone_number = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id
UNION

SELECT Supporter.last_name, Supporter.first_name, Email.email_address, Phone.phone_number, Company.company_name
FROM Donor, Supporter, Email, Phone, Company
WHERE Company.company_name = @keyword AND Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id
AND Phone.supporter_id = Supporter.supporter_id AND Company.supporter_id = Supporter.supporter_id;

/*
#11. query all patients "with keyword"
SELECT *
FROM Needs
WHERE Needs.item = [keyword];

#12. query all pledges "with keyword"
SELECT *
FROM Pledges, Supporter, Patient
WHERE Pledges.[attrib] = [keyword] or Supporter.[attrib] = keyword or Patient.id = [keyword];

#13. query all requests "with keyword"
#You can query for a request that involves a particular item name
SELECT *
FROM Requests, Contribution
WHERE Requests.contrib_id = Contribution.contrib_id and Contribution.item_name = [keyword];

#14. query all events "with keyword"
SELECT *
FROM Donor
WHERE Campaign.[attrib] = [keyword];

#15. query all contributions "with keyword"
SELECT *
FROM Contribution
WHERE Contribution.[attrib] = [keyword];
*/
#Donor view:
#1. query all attributes tied to donor_id


#2. query all contribution with donor_id


#3. query all pledges tied with donor_id


#4. query all events tied with donor_id


#5. query all pledges tied with donor_id


#Staff view:
#1. query all attributes tied to staff_id
#10. query all staffs "with keyword"
/*SELECT *
FROM Staff, Supporter
WHERE Staff.[attrib] = [keyword] or Supporter.[attrib] = [keyword];

#2. query all events tied with staff_id


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