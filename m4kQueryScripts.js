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
/*queryNum = 0: All Donors*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Donor.donor_type, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name FROM Supporter, Donor, Email, Phone, Company WHERE Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE",
/*queryNum = 1: All Staff*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Staff.staff_type, Staff.staff_status, Email.email_address, Phone.phone_number FROM Supporter, Staff, Email, Phone WHERE Staff.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary",
/*queryNum = 2: All Patients*/ "SELECT Patient.patient_id, Needs.item FROM Patient, Needs WHERE Patient.patient_id = Needs.patient_id",
/*queryNum = 3: All Requests*/ "SELECT Patient.patient_id, Contribution.item_name FROM Requests, Patient, Contribution WHERE Requests.contrib_id = Contribution.contrib_id AND Requests.patient_id = Patient.patient_id",
/*queryNum = 4: All Pledges*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Patient, Pledge WHERE Pledge.donor_id = Supporter.supporter_id AND Pledge.patient_id = Patient.patient_id",
/*queryNum = 5: All Events*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.is_event = 1 AND CampaignType.campaign_type_id = Campaign.campaign_type_id",
/*queryNum = 6: All Event Items*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Contribution, Contributes WHERE Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id AND Contribution.is_event_item = 1",
/*queryNum = 7: All Contributions*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Donor, Contribution, Contributes WHERE Supporter.supporter_id = Donor.supporter_id AND Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id",
/*queryNum = 8: Donor basic info w/ ID*/ "SELECT Supporter.supporter_id, Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Donor.donor_type, Donor.last_donation, Donor.donor_status FROM Supporter, Donor WHERE Donor.supporter_id = @keyword AND Donor.supporter_id = Supporter.supporter_id",
/*queryNum = 9: Donor emails w/ ID*/ "SELECT Email.email_address FROM Email WHERE Email.supporter_id = @keyword",
/*queryNum = 11: Donor phones w/ ID*/ "SELECT Phone.phone_number FROM Phone WHERE Phone.supporter_id = @keyword",
/*queryNum = 11: Donor addresses w/ ID*/ "SELECT Address.address_type, Address.address_line_1, Address.address_line_2, Address.city, Address.state, Address.zip_code FROM Address WHERE Address.supporter_id = @keyword",
/*queryNum = 12: Donor companies w/ ID*/ "SELECT Company.company_name FROM Company WHERE Company.supporter_id = @keyword",
/*queryNum = 13: Donor contributions w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Contributes.contrib_date FROM Contribution, Contributes WHERE Contributes.donor_id = @keyword AND Contribution.contrib_id = Contributes.contrib_id",
/*queryNum = 14: Donor pledges w/ ID*/ "SELECT Pledge.patient_id, Pledge.pledge_date, Pledge.target_amount, Pledge.is_behind FROM Pledge WHERE Pledge.donor_id = @keyword",
/*queryNum = 15: Donor events w/ ID*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType, Attends WHERE Attends.donor_id = @keyword AND Campaign.campaign_id = Attends.campaign_id AND CampaignType.campaign_type_id = Campaign.campaign_type_id"
];


//Get data from relevant table based on queryNum
var getData = function(queryNum, callback)
{
	con.query(queries[queryNum], (err, rows) =>
	{
		callback(err, rows)
	});
}

function getIndividualDonorInfo(id, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var patchedQuery = queries[queryNum].replace('@keyword', id);
		//console.log('Patched query: ' + patchedQuery);
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				return reject(err);
			resolve(rows);
		});
	});
}

var getIndividualDonor = function(id, callback)
{
	var donor = {};
	//Get all basic elements from a donor
	getIndividualDonorInfo(id, 8).then((donorBasicInfo) =>
	{
		donor.basic = donorBasicInfo;
		//Get all emails tied to donor
		getIndividualDonorInfo(id, 9).then((donorEmails) =>
		{
			donor.emails = donorEmails;
			//Get all phones tied to donor
			getIndividualDonorInfo(id, 10).then((donorPhones) =>
			{
				donor.phones = donorPhones;
				//Get all addresses tied to donor
				getIndividualDonorInfo(id, 11).then((donorAddresses) =>
				{
					donor.addresses = donorAddresses;
					//Get all companies tied to donor
					getIndividualDonorInfo(id, 12).then((donorCompanies) =>
					{
						donor.companies = donorCompanies;
						//Get all contributions tied to donor
						getIndividualDonorInfo(id, 13).then((donorContributions) =>
						{
							donor.contributions = donorContributions;
							//Get all pledges tied to donor
							getIndividualDonorInfo(id, 14).then((donorPledges) =>
							{
								donor.pledges = donorPledges;
								//Get all events teid to donor
								getIndividualDonorInfo(id, 15).then((donorEvents) =>
								{
									donor.events = donorEvents;
									//Return aggregate donor info object 
									callback(donor);
								});
							});
						});
					});
				});
			});
		});
	});
}

exports.getData = getData;
exports.getIndividualDonor = getIndividualDonor;
//exports.deleteData = deleteData;