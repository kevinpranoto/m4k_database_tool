'use strict';

var mysql = require('mysql');
var Promise = require('promise');

var con = mysql.createConnection({
	host:"m4k-database.c947krbzy1fm.us-west-1.rds.amazonaws.com",
	user: "databois",
	password: "databoisroxx",
	database: "m4k_database"
});

var getQueries = [
/*queryNum = 0: GET All Donors*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Donor.donor_type, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name FROM Supporter, Donor, Email, Phone, Company WHERE Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE ORDER BY Supporter.supporter_id ASC",
/*queryNum = 1: GET All Staff*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Staff.staff_type, Staff.staff_status, Email.email_address, Phone.phone_number FROM Supporter, Staff, Email, Phone WHERE Staff.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary ORDER BY Supporter.supporter_id ASC",
/*queryNum = 2: GET All Patients*/ "SELECT Patient.patient_id FROM Patient ORDER BY Patient.patient_id ASC",
/*queryNum = 3: GET All Pledges*/ "SELECT Pledge.pledge_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Patient, Pledge WHERE Pledge.donor_id = Supporter.supporter_id AND Pledge.patient_id = Patient.patient_id ORDER BY Pledge.pledge_id ASC",
/*queryNum = 4: GET All Events*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.is_event = 1 AND CampaignType.campaign_type_id = Campaign.campaign_type_id ORDER BY Campaign.campaign_id ASC",
/*queryNum = 5: GET All Contributions*/ "SELECT Contribution.contrib_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.is_event_item, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Donor, Contribution WHERE Supporter.supporter_id = Donor.supporter_id AND Contribution.donor_id = Supporter.supporter_id ORDER BY Contribution.contrib_id ASC",
/*queryNum = 6: GET All Event Items*/ "SELECT Contribution.contrib_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Contribution WHERE Contribution.donor_id = Supporter.supporter_id AND Contribution.is_event_item = 1 ORDER BY Contribution.contrib_id ASC",
/*queryNum = 7: GET Donor basic info w/ ID*/ "SELECT Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Donor.donor_type, Donor.donor_status FROM Supporter, Donor WHERE Donor.supporter_id = @keyword AND Donor.supporter_id = Supporter.supporter_id",
/*queryNum = 8: GET Donor emails w/ ID*/ "SELECT Email.email_address, Email.is_primary FROM Email WHERE Email.supporter_id = @keyword",
/*queryNum = 9: GET Donor phones w/ ID*/ "SELECT Phone.phone_type, Phone.phone_number, Phone.is_primary FROM Phone WHERE Phone.supporter_id = @keyword",
/*queryNum = 10: GET Donor addresses w/ ID*/ "SELECT Address.address_type, Address.address_line_1, Address.address_line_2, Address.city, Address.state, Address.zip_code, Address.is_primary FROM Address WHERE Address.supporter_id = @keyword",
/*queryNum = 11: GET Donor companies w/ ID*/ "SELECT Company.company_name, Company.is_primary FROM Company WHERE Company.supporter_id = @keyword",
/*queryNum = 12: GET Donor contributions w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Contribution.contrib_date FROM Contribution WHERE Contribution.donor_id = @keyword",
/*queryNum = 13: GET Donor pledges w/ ID*/ "SELECT Pledge.patient_id, Pledge.pledge_date, Pledge.target_amount, Pledge.is_behind FROM Pledge WHERE Pledge.donor_id = @keyword",
/*queryNum = 14: GET Donor events w/ ID*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType, Attends WHERE Attends.donor_id = @keyword AND Campaign.campaign_id = Attends.campaign_id AND CampaignType.campaign_type_id = Campaign.campaign_type_id",
/*queryNum = 15: GET Staff basic info w/ ID*/ "SELECT Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Staff.staff_type, Staff.staff_status FROM Supporter, Staff WHERE Staff.supporter_id = @keyword AND Staff.supporter_id = Supporter.supporter_id",
/*queryNum = 16: GET Staff emails w/ ID*/ "SELECT Email.email_address, Email.is_primary FROM Email WHERE Email.supporter_id = @keyword",
/*queryNum = 17: GET Staff phones w/ ID*/ "SELECT Phone.phone_type, Phone.phone_number, Phone.is_primary FROM Phone WHERE Phone.supporter_id = @keyword",
/*queryNum = 18: GET Staff addresses w/ ID*/ "SELECT Address.address_type, Address.address_line_1, Address.address_line_2, Address.city, Address.state, Address.zip_code, Address.is_primary FROM Address WHERE Address.supporter_id = @keyword",
/*queryNum = 19: GET Staff events w/ ID*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM CampaignType, Campaign, Works WHERE Works.staff_id = @keyword AND Works.campaign_id = Campaign.campaign_id AND CampaignType.campaign_type_id = Campaign.campaign_type_id AND Campaign.is_event = 1",
/*queryNum = 20: GET Patient needs w/ ID*/ "SELECT Needs.item FROM Needs WHERE Needs.patient_id = @keyword",
/*queryNum = 21: GET Patient requests w/ ID*/ "SELECT Contribution.item_name FROM Requests, Contribution WHERE Requests.patient_id = @keyword AND Contribution.contrib_id = Requests.contrib_id",
/*queryNum = 22: GET Patient pledges w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Pledge WHERE Pledge.patient_id = @keyword AND Supporter.supporter_id = Pledge.donor_id",
/*queryNum = 23: GET Event basic info w/ ID*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_id, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.campaign_id = @keyword AND Campaign.campaign_type_id = CampaignType.campaign_type_id",
/*queryNum = 24: GET Event contributions w/ ID*/ "SELECT Contribution.contrib_id, Contribution.item_name, Contribution.contrib_type, Contribution.amount FROM Contribution, PresentedAt WHERE PresentedAt.campaign_id = @keyword AND Contribution.contrib_id = PresentedAt.contrib_id",
/*queryNum = 25: GET Event staff w/ ID*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Staff.staff_type FROM Supporter, Staff, Works WHERE Works.campaign_id = @keyword AND Supporter.supporter_id = Works.staff_id AND Supporter.supporter_id = Staff.supporter_id",
/*queryNum = 26: GET Event donors w/ ID*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name FROM Supporter, Attends WHERE Attends.campaign_id = @keyword AND Supporter.supporter_id = Attends.donor_id",
/*queryNum = 27: GET Pledge basic info w/ ID*/ "SELECT Pledge.pledge_date, Pledge.target_amount, Pledge.is_behind FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 28: GET Pledge patient w/ ID*/ "SELECT Pledge.patient_id FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 29: GET Pledge donor w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Supporter.alias FROM Supporter, Pledge WHERE Pledge.pledge_id = @keyword AND Supporter.supporter_id = Pledge.donor_id",
/*queryNum = 30: GET Pledge installments w/ ID*/ "SELECT Installments.amount, Installments.installment_date FROM Installments WHERE Installments.pledge_id = @keyword",
/*queryNum = 31: GET Contribution basic info w/ ID*/ "SELECT Contribution.item_name, Contribution.is_event_item, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.contrib_date FROM Supporter, Contribution WHERE Contribution.contrib_id = @keyword AND Supporter.supporter_id = Contribution.donor_id",
/*queryNum = 32: GET Event Item w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.contrib_date, Campaign.campaign_name, CampaignType.campaign_type_name FROM Supporter, Campaign, CampaignType, Contribution, PresentedAt WHERE Contribution.contrib_id = @keyword AND Contribution.is_event_item = 1 AND Supporter.supporter_id = Contribution.donor_id AND PresentedAt.contrib_id = Contribution.contrib_id AND Campaign.campaign_id = PresentedAt.campaign_id AND Campaign.campaign_type_id = CampaignType.campaign_type_id",
/*queryNum = 33: GET All Campaigns*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.is_event, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE CampaignType.campaign_type_id = Campaign.campaign_type_id ORDER BY Campaign.campaign_id ASC",
/*queryNum = 34: GET All Campaign Type*/ "SELECT CampaignType.campaign_type_id, CampaignType.campaign_type_name FROM CampaignType ORDER BY CampaignType.campaign_type_id ASC"
];

//Get data from relevant table based on queryNum
var getData = function(queryNum, callback)
{
	con.query(getQueries[queryNum], (err, rows) =>
	{
		callback(err, rows)
	});
}

function getIndividualInfo(id, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var patchedQuery = getQueries[queryNum].replace('@keyword', id);
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				throw err;
			resolve(rows);
		});
	});
}

var getIndividualDonor = function(id, callback)
{	
	var donor = {};
	//Get all basic info from a donor
	getIndividualInfo(id, 7).then((donorBasicInfo) =>
	{
		donor.basic = donorBasicInfo;
		//Get all emails tied to donor
		getIndividualInfo(id, 8).then((donorEmails) =>
		{
			donor.emails = donorEmails;
			//Get all phone numberss tied to donor
			getIndividualInfo(id, 9).then((donorPhones) =>
			{
				donor.phones = donorPhones;
				//Get all addresses tied to donor
				getIndividualInfo(id, 10).then((donorAddresses) =>
				{
					donor.addresses = donorAddresses;
					//Get all companies tied to donor
					getIndividualInfo(id, 11).then((donorCompanies) =>
					{
						donor.companies = donorCompanies;
						//Get all contributions tied to donor
						getIndividualInfo(id, 12).then((donorContributions) =>
						{
							donor.contributions = donorContributions;
							//Get all pledges tied to donor
							getIndividualInfo(id, 13).then((donorPledges) =>
							{
								donor.pledges = donorPledges;
								//Get all events teid to donor
								getIndividualInfo(id, 14).then((donorEvents) =>
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

var getIndividualStaff = function(id, callback)
{
	var staff = {};
	//Get all basic info from a staff member
	getIndividualInfo(id, 15).then((staffBasicInfo) =>
	{
		staff.basic = staffBasicInfo;
		//Get all emails tied to staff member
		getIndividualInfo(id, 16).then((staffEmails) =>
		{
			staff.emails = staffEmails;
			//Get all phone numbers tied to staff member
			getIndividualInfo(id, 17).then((staffPhones) =>
			{
				staff.phones = staffPhones;
				//Get all addresses tied to staff member
				getIndividualInfo(id, 18).then((staffAddresses) =>
				{
					staff.addresses = staffAddresses;
					//Get all events tied to staff member
					getIndividualInfo(id, 19).then((staffEvents) =>
					{
						staff.events = staffEvents;
						//Return aggregate staff info object 			
						callback(staff);
					});
				});
			});
		});
	});
}

var getIndividualPatient = function(id, callback)
{
	var patient = {};
	//Get all basic info from a patient
	patient.patient_id = id;
	//Get all needs tied to patient
	getIndividualInfo(id, 20).then((patientNeeds) =>
	{
		patient.needs = patientNeeds;
		//Get all requests tied to patient
		getIndividualInfo(id, 21).then((patientRequests) =>
		{
			patient.requests = patientRequests;
			//Get all pledges tied to patient
			getIndividualInfo(id, 22).then((patientPledges) =>
			{
				patient.pledges = patientPledges;
				//Return aggregate patient info object
				callback(patient);
			});
		});
	});
}

var getIndividualCampaign = function(id, callback)
{
	var campaign = {};
	getIndividualInfo(id, 23).then((campaignBasicInfo) =>
	{
		campaign.basic = campaignBasicInfo;
		callback(campaign);
	});
}

var getIndividualEvent = function(id, callback)
{
	var event = {};
	//Get all basic info from an event
	getIndividualInfo(id, 23).then((eventBasicInfo) =>
	{
		event.basic = eventBasicInfo;
		//Get all contributions tied to event
		getIndividualInfo(id, 24).then((eventContributions) =>
		{
			event.contributions = eventContributions;
			//Get all staff tied to event
			getIndividualInfo(id, 25).then((eventStaff) =>
			{
				event.staff = eventStaff;
				//Get all donors tied to event
				getIndividualInfo(id, 26).then((eventDonors) =>
				{
					event.donors = eventDonors;
					//Return aggregate event info object
					callback(event);
				})
			});
		});
	});
}

var getIndividualPledge = function(id, callback)
{
	var pledge = {};
	//Get all basic info from a pledge
	getIndividualInfo(id, 27).then((pledgeBasicInfo) =>
	{
		pledge.basic_info = pledgeBasicInfo;
		//Get all patients tied to pledge
		getIndividualInfo(id, 28).then((pledgePatient) =>
		{
			pledge.patient_id = pledgePatient[0].patient_id;
			//Get all donors tied to pledge
			getIndividualInfo(id, 29).then((pledgeDonor) =>
			{
				pledge.donor = pledgeDonor;
				//Get all installments tied to pledge
				getIndividualInfo(id, 30).then((pledgeInstallments) =>
				{
					pledge.installments = pledgeInstallments;
					callback(pledge);
				});
			});
		});
	});
}

var getIndividualContribution = function(id, callback)
{
	getIndividualInfo(id, 31).then((res) =>
	{
		callback(res);
	});
} 

var getIndividualEventItem = function(id, callback)
{
	getIndividualInfo(id, 32).then((res) =>
	{
		callback(res);
	});
}

exports.getData = getData;
exports.getIndividualDonor = getIndividualDonor;
exports.getIndividualStaff = getIndividualStaff;
exports.getIndividualPatient = getIndividualPatient;
exports.getIndividualCampaign = getIndividualCampaign;
exports.getIndividualEvent = getIndividualEvent;
exports.getIndividualPledge = getIndividualPledge;
exports.getIndividualContribution = getIndividualContribution;
exports.getIndividualEventItem = getIndividualEventItem;