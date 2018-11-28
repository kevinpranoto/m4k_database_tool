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
/*queryNum = 0: GET All Donors*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Donor.donor_type, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name FROM Supporter, Donor, Email, Phone, Company WHERE Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE",
/*queryNum = 1: GET All Staff*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Staff.staff_type, Staff.staff_status, Email.email_address, Phone.phone_number FROM Supporter, Staff, Email, Phone WHERE Staff.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary",
/*queryNum = 2: GET All Patients*/ "SELECT Patient.patient_id, Needs.item FROM Patient, Needs WHERE Patient.patient_id = Needs.patient_id",
/*queryNum = 3: GET All Pledges*/ "SELECT Pledge.pledge_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Patient, Pledge WHERE Pledge.donor_id = Supporter.supporter_id AND Pledge.patient_id = Patient.patient_id",
/*queryNum = 4: GET All Events*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.is_event = 1 AND CampaignType.campaign_type_id = Campaign.campaign_type_id",
/*queryNum = 5: GET All Contributions*/ "SELECT Contribution.contrib_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.is_event_item, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Donor, Contribution, Contributes WHERE Supporter.supporter_id = Donor.supporter_id AND Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id",
/*queryNum = 6: GET All Event Items*/ "SELECT Contribution.contrib_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Contribution, Contributes WHERE Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id AND Contribution.is_event_item = 1",
/*queryNum = 7: GET Donor basic info w/ ID*/ "SELECT Supporter.supporter_id, Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Donor.donor_type, Donor.donor_status FROM Supporter, Donor WHERE Donor.supporter_id = @keyword AND Donor.supporter_id = Supporter.supporter_id",
/*queryNum = 8: GET Donor emails w/ ID*/ "SELECT Email.email_address FROM Email WHERE Email.supporter_id = @keyword",
/*queryNum = 9: GET Donor phones w/ ID*/ "SELECT Phone.phone_number FROM Phone WHERE Phone.supporter_id = @keyword",
/*queryNum = 10: GET Donor addresses w/ ID*/ "SELECT Address.address_type, Address.address_line_1, Address.address_line_2, Address.city, Address.state, Address.zip_code FROM Address WHERE Address.supporter_id = @keyword",
/*queryNum = 11: GET Donor companies w/ ID*/ "SELECT Company.company_name FROM Company WHERE Company.supporter_id = @keyword",
/*queryNum = 12: GET Donor contributions w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Contributes.contrib_date FROM Contribution, Contributes WHERE Contributes.donor_id = @keyword AND Contribution.contrib_id = Contributes.contrib_id",
/*queryNum = 13: GET Donor pledges w/ ID*/ "SELECT Pledge.patient_id, Pledge.pledge_date, Pledge.target_amount, Pledge.is_behind FROM Pledge WHERE Pledge.donor_id = @keyword",
/*queryNum = 14: GET Donor events w/ ID*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType, Attends WHERE Attends.donor_id = @keyword AND Campaign.campaign_id = Attends.campaign_id AND CampaignType.campaign_type_id = Campaign.campaign_type_id",
/*queryNum = 15: GET Staff basic info w/ ID*/ "SELECT Supporter.supporter_id, Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Staff.staff_type, Staff.staff_status FROM Supporter, Staff WHERE Staff.supporter_id = @keyword AND Staff.supporter_id = Supporter.supporter_id",
/*queryNum = 16: GET Staff emails w/ ID*/ "SELECT Email.email_address FROM Email WHERE Email.supporter_id = @keyword",
/*queryNum = 17: GET Staff phones w/ ID*/ "SELECT Phone.phone_number FROM Phone WHERE Phone.supporter_id = @keyword",
/*queryNum = 18: GET Staff addresses w/ ID*/ "SELECT Address.address_type, Address.address_line_1, Address.address_line_2, Address.city, Address.state, Address.zip_code FROM Address WHERE Address.supporter_id = @keyword",
/*queryNum = 19: GET Staff events w/ ID*/ "SELECT Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM CampaignType, Campaign, Works WHERE Works.staff_id = @keyword AND Works.campaign_id = Campaign.campaign_id AND CampaignType.campaign_type_id = Campaign.campaign_type_id AND Campaign.is_event = 1",
/*queryNum = 20: GET Patient needs w/ ID*/ "SELECT Needs.item FROM Needs WHERE Needs.patient_id = @keyword",
/*queryNum = 21: GET Patient requests w/ ID*/ "SELECT Contribution.item_name FROM Requests, Contribution WHERE Requests.patient_id = @keyword AND Contribution.contrib_id = Requests.contrib_id",
/*queryNum = 22: GET Patient pledges w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Pledge WHERE Pledge.patient_id = @keyword AND Supporter.supporter_id = Pledge.donor_id",
/*queryNum = 23: GET Event basic info w/ ID*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.campaign_id = @keyword AND Campaign.campaign_type_id = CampaignType.campaign_type_id",
/*queryNum = 24: GET Event contributions w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount FROM Contribution, PresentedAt WHERE PresentedAt.campaign_id = @keyword AND Contribution.contrib_id = PresentedAt.contrib_id",
/*queryNum = 25: GET Event staff w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Staff.staff_type FROM Supporter, Staff, Works WHERE Works.campaign_id = @keyword AND Supporter.supporter_id = Works.staff_id AND Supporter.supporter_id = Staff.supporter_id",
/*queryNum = 26: GET Event donors w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name FROM Supporter, Attends WHERE Attends.campaign_id = @keyword AND Supporter.supporter_id = Attends.donor_id",
/*queryNum = 27: GET Pledge patients w/ ID*/ "SELECT Pledge.patient_id FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 28: GET Pledge donors w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Supporter.alias FROM Supporter, Pledge WHERE Pledge.pledge_id = @keyword AND Supporter.supporter_id = Pledge.donor_id",
/*queryNum = 29: GET Pledge installments w/ ID*/ "SELECT Installments.amount, Installments.installment_date FROM Installments WHERE Installments.pledge_id = @keyword",
/*queryNum = 30: GET Contribution basic info w/ ID*/ "SELECT Contribution.item_name, Contribution.is_event_item, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contributes.contrib_date FROM Supporter, Contributes, Contribution WHERE Contribution.contrib_id = @keyword AND Supporter.supporter_id = Contributes.donor_id AND Contribution.contrib_id = Contributes.contrib_id",
/*queryNum = 31: GET Event Item w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contributes.contrib_date FROM Supporter, Contributes, Contribution WHERE Contribution.contrib_id = @keyword AND Contribution.is_event_item = 1 AND Supporter.supporter_id = Contributes.donor_id AND Contribution.contrib_id = Contributes.contrib_id",

/*queryNum = 32: DELETE Supporter w/ ID*/ "DELETE FROM Supporter WHERE Supporter.supporter_id = @keyword",
/*queryNum = 33: DELETE Patient w/ ID*/ "DELETE FROM Patient WHERE Patient.patient_id = @keyword",
/*queryNum = 34: DELETE Event w/ ID*/ "DELETE FROM Campaign WHERE Campaign.campaign_id = @keyword",
/*queryNum = 35: DELETE Pledge w/ ID*/ "DELETE FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 36: DELETE Contribution w/ ID*/ "DELETE FROM Contribution WHERE Contribution.contrib_id = @keyword",

/*queryNum = 27: UPDATE Supporter w/ ID*/ "UPDATE Supporter SET last_name = newLastName, first_name = newFirstName, salutation = newSalutation, alias = newAlias WHERE supporter_id = keyword",
/*queryNum = 28: UPDATE Donor w/ ID*/ "UPDATE Donor SET donor_type = newDonorType, donor_status = newStatus WHERE Donor.supporter_id = keyword",
/*queryNum = 29: UPDATE Staff w/ ID*/ "UPDATE Staff SET staff_type = newStaffType, staff_status = newStatus WHERE Staff.supporter_id = keyword",

];




//Get data from relevant table based on queryNum
var getData = function(queryNum, callback)
{
	con.query(queries[queryNum], (err, rows) =>
	{
		callback(err, rows)
	});
}

function getIndividualInfo(id, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var patchedQuery = queries[queryNum].replace('@keyword', id);
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				return reject(err);
			resolve(rows);
		});
	});
}

function updateSupporterData(id, body, queryNum)
{
	//Update emails/phones/addresses??
	return new Promise((resolve, reject) =>
	{
		console.log(body);
		var basicObj = {
			newLastName: '\'' + body.last_name + '\'',
			newFirstName: '\'' + body.first_name + '\'',
			newSalutation: '\'' + body.salutation + '\'',
			newAlias: '\'' + body.alias + '\'',
			keyword: id
		};

		var patchedQuery = queries[queryNum].replace(/newLastName|newFirstName|newSalutation|newAlias|keyword/gi, (matched) =>
		{
			return basicObj[matched];
		});
		
		//Update basic information
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				return reject(err);
			resolve(rows);
		});

		/*
		//Replace emails
		var delEmailQuery = "DELETE FROM Email WHERE Supporter.supporter_id = @id";
		con.query(delEmailQuery.replace('@id', id));

		var newEmails = body.emails;
		for (var email in newEmails)
		{
			var addEmailQuery = "INSERT INTO Email (supporter_id, email_address, is_primary) VALUES (newSupporterID, newEmail, newIsPrimary)";
			
			var emailObj = {
				newSupporterID: id,
				newEmail: 
			}
			addEmailQuery.replace(/newSupporterID|newEmail|newIsPrimary/gi);
			con.query(addEmailQuery);
		}
		*/
	});
}

var deleteIndividualSupporter = function(id, callback)
{
	deleteIndividualData(id, 32).then((res) =>
	{
		callback(res);
	});
}

function deleteIndividualData(id, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var patchedQuery = queries[queryNum].replace('@keyword', id);
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

function updateDonorData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var fieldObj = {
			newDonorType: '\'' + body.donor_type + '\'',
			newStatus: '\'' + body.donor_status + '\'',
			keyword: id
		};

		var patchedQuery = queries[queryNum].replace(/newDonorType|newStatus|keyword/gi, (matched) =>
		{
			return fieldObj[matched];
		});
		
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				return reject(err);
			resolve(rows);
		});
	});
}

var updateIndividualDonor = function(id, body, callback)
{
	/*
	updateSupporterData(id, body, ##).then((res) =>
	{
		updateDonorData(id, body, ##).then((data) =>
		{
			callback(data);
		});
	});*/
}

var createDonor = function(data, callback)
{

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

function updateStaffData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var fieldObj = {
			newStaffType: '\'' + body.staff_type + '\'',
			newStatus: '\'' + body.staff_status + '\'',
			keyword: id
		};

		var patchedQuery = queries[queryNum].replace(/newStaffType|newStatus|keyword/gi, (matched) =>
		{
			return fieldObj[matched];
		});
		
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				return reject(err);
			resolve(rows);
		});
	});
}

var updateIndividualStaff = function(id, body, callback)
{/*
	updateSupporterData(id, body, ##).then((res) =>
	{
		updateStaffData(id, body, ##).then((data) =>
		{
			callback(data);
		});
	});*/
}

var getIndividualPatient = function(id, callback)
{
	var patient = {};
	//Get all basic info from a patient
	patient.pid = id;
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
			})
		})
	})
}

var deleteIndividualPatient = function(id, callback)
{
	deleteIndividualData(id, 33).then((res) =>
	{
		callback(res);
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

var deleteIndividualEvent = function(id, callback)
{
	deleteIndividualData(id, 34).then((res) =>
	{
		callback(res);
	});
}

var getIndividualPledge = function(id, callback)
{
	var pledge = {};
	//Get all patients tied to pledge
	getIndividualInfo(id, 27).then((pledgePatients) =>
	{
		pledge.patients = pledgePatients;
		//Get all donors tied to pledge
		getIndividualInfo(id, 28).then((pledgeDonors) =>
		{
			pledge.donors = pledgeDonors;
			//Get all installments tied to pledge
			getIndividualInfo(id, 29).then((pledgeInstallments) =>
			{
				pledge.installments = pledgeInstallments;
				callback(pledge);
			})
		})
	})
}

var deleteIndividualPledge = function(id, callback)
{
	deleteIndividualData(id, 35).then((res) =>
	{
		callback(res);
	});
}

var getIndividualContribution = function(id, callback)
{
	getIndividualInfo(id, 30).then((res) =>
	{
		callback(res);
	});
} 

var deleteIndividualContribution = function(id, callback)
{
	deleteIndividualData(id, 36).then((res) =>
	{
		callback(res);
	});
}

var getIndividualEventItem = function(id, callback)
{
	getIndividualInfo(id, 31).then((res) =>
	{
		callback(res);
	});
}

//GETs
exports.getData = getData;
exports.getIndividualDonor = getIndividualDonor;
exports.getIndividualStaff = getIndividualStaff;
exports.getIndividualPatient = getIndividualPatient;
exports.getIndividualEvent = getIndividualEvent;
exports.getIndividualPledge = getIndividualPledge;
exports.getIndividualContribution = getIndividualContribution;
exports.getIndividualEventItem = getIndividualEventItem;
//DELETEs
exports.deleteIndividualSupporter = deleteIndividualSupporter;
exports.deleteIndividualPatient = deleteIndividualPatient;
exports.deleteIndividualEvent = deleteIndividualEvent;
exports.deleteIndividualPledge = deleteIndividualPledge;
exports.deleteIndividualContribution = deleteIndividualContribution;
//PUTs
exports.updateIndividualDonor = updateIndividualDonor;
exports.updateIndividualStaff = updateIndividualStaff;
//POSTs
exports.createDonor = createDonor;