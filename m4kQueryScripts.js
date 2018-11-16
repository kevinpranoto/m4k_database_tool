'use strict';

var mysql = require('mysql');
var Promise = require('promise');

var con = mysql.createConnection({
	host:"m4k-database.c947krbzy1fm.us-west-1.rds.amazonaws.com",
	user: "databois",
	password: "databoisroxx",
	database: "m4k_database"
});


var queries = [
/*queryNum = 0: All Donors*/ "SELECT Supporter.last_name, Supporter.first_name, Donor.donor_type, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name FROM Supporter, Donor, Email, Phone, Company WHERE Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE",
/*queryNum = 1: All Staff*/ "SELECT Supporter.last_name, Supporter.first_name, Staff.staff_type, Staff.staff_status, Email.email_address, Phone.phone_number FROM Supporter, Staff, Email, Phone WHERE Staff.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary",
/*queryNum = 2: All Patients*/ "SELECT Patient.patient_id, Needs.item FROM Patient, Needs WHERE Patient.patient_id = Needs.patient_id",
/*queryNum = 3: All Requests*/ "SELECT Patient.patient_id, Contribution.item_name FROM Requests, Patient, Contribution WHERE Requests.contrib_id = Contribution.contrib_id AND Requests.patient_id = Patient.patient_id",
/*queryNum = 4: All Pledges*/ "SELECT Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Patient, Pledge WHERE Pledge.donor_id = Supporter.supporter_id AND Pledge.patient_id = Patient.patient_id",
/*queryNum = 5: All Events*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.is_event = 1 AND CampaignType.campaign_type_id = Campaign.campaign_type_id",
/*queryNum = 6: All Event Items*/ "SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Contribution, Contributes WHERE Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id AND Contribution.is_event_item = 1",
/*queryNum = 7: All Contributions*/ "SELECT Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Donor, Contribution, Contributes WHERE Supporter.supporter_id = Donor.supporter_id AND Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id"
];

//Get data from relevant table based on queryNum
var getData = function(queryNum, callback)
{
	con.query(queries[queryNum], (err, rows) =>
	{
		callback(err, rows)
	});
}

exports.getData = getData;
//exports.deleteData = deleteData;