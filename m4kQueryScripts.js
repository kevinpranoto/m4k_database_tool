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
/*queryNum = 0: GET All Donors*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Donor.donor_type, Donor.donor_status, Email.email_address, Phone.phone_number, Company.company_name FROM Supporter, Donor, Email, Phone, Company WHERE Donor.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary = TRUE AND Company.supporter_id = Supporter.supporter_id AND Company.is_primary = TRUE",
/*queryNum = 1: GET All Staff*/ "SELECT Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Staff.staff_type, Staff.staff_status, Email.email_address, Phone.phone_number FROM Supporter, Staff, Email, Phone WHERE Staff.supporter_id = Supporter.supporter_id AND Email.supporter_id = Supporter.supporter_id AND Email.is_primary = TRUE AND Phone.supporter_id = Supporter.supporter_id AND Phone.is_primary",
/*queryNum = 2: GET All Patients*/ "SELECT Patient.patient_id, Needs.item FROM Patient, Needs WHERE Patient.patient_id = Needs.patient_id",
/*queryNum = 3: GET All Pledges*/ "SELECT Pledge.pledge_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Patient.patient_id, Pledge.target_amount, Pledge.pledge_date FROM Supporter, Patient, Pledge WHERE Pledge.donor_id = Supporter.supporter_id AND Pledge.patient_id = Patient.patient_id",
/*queryNum = 4: GET All Events*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.is_event = 1 AND CampaignType.campaign_type_id = Campaign.campaign_type_id",
/*queryNum = 5: GET All Contributions*/ "SELECT Contribution.contrib_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.is_event_item, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Donor, Contribution, Contributes WHERE Supporter.supporter_id = Donor.supporter_id AND Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id",
/*queryNum = 6: GET All Event Items*/ "SELECT Contribution.contrib_id, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contribution.item_name, Contribution.contrib_type, Contribution.appeal, Contribution.notes FROM Supporter, Contribution, Contributes WHERE Contributes.donor_id = Supporter.supporter_id AND Contributes.contrib_id = Contribution.contrib_id AND Contribution.is_event_item = 1",
/*queryNum = 7: GET Donor basic info w/ ID*/ "SELECT Supporter.salutation, Supporter.last_name, Supporter.first_name, Supporter.alias, Donor.donor_type, Donor.donor_status FROM Supporter, Donor WHERE Donor.supporter_id = @keyword AND Donor.supporter_id = Supporter.supporter_id",
/*queryNum = 8: GET Donor emails w/ ID*/ "SELECT Email.email_address, Email.is_primary FROM Email WHERE Email.supporter_id = @keyword",
/*queryNum = 9: GET Donor phones w/ ID*/ "SELECT Phone.phone_type, Phone.phone_number, Phone.is_primary FROM Phone WHERE Phone.supporter_id = @keyword",
/*queryNum = 10: GET Donor addresses w/ ID*/ "SELECT Address.address_type, Address.address_line_1, Address.address_line_2, Address.city, Address.state, Address.zip_code, Address.is_primary FROM Address WHERE Address.supporter_id = @keyword",
/*queryNum = 11: GET Donor companies w/ ID*/ "SELECT Company.company_name, Company.is_primary FROM Company WHERE Company.supporter_id = @keyword",
/*queryNum = 12: GET Donor contributions w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Contributes.contrib_date FROM Contribution, Contributes WHERE Contributes.donor_id = @keyword AND Contribution.contrib_id = Contributes.contrib_id",
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
/*queryNum = 23: GET Event basic info w/ ID*/ "SELECT Campaign.campaign_id, Campaign.campaign_name, CampaignType.campaign_type_name, Campaign.theme, Campaign.campaign_date FROM Campaign, CampaignType WHERE Campaign.campaign_id = @keyword AND Campaign.campaign_type_id = CampaignType.campaign_type_id",
/*queryNum = 24: GET Event contributions w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount FROM Contribution, PresentedAt WHERE PresentedAt.campaign_id = @keyword AND Contribution.contrib_id = PresentedAt.contrib_id",
/*queryNum = 25: GET Event staff w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Staff.staff_type FROM Supporter, Staff, Works WHERE Works.campaign_id = @keyword AND Supporter.supporter_id = Works.staff_id AND Supporter.supporter_id = Staff.supporter_id",
/*queryNum = 26: GET Event donors w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name FROM Supporter, Attends WHERE Attends.campaign_id = @keyword AND Supporter.supporter_id = Attends.donor_id",
/*queryNum = 27: GET Pledge basic info w/ ID*/ "SELECT Pledge.pledge_date, Pledge.target_amount, Pledge.is_behind FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 28: GET Pledge patient w/ ID*/ "SELECT Pledge.patient_id FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 29: GET Pledge donor w/ ID*/ "SELECT Supporter.last_name, Supporter.first_name, Supporter.alias FROM Supporter, Pledge WHERE Pledge.pledge_id = @keyword AND Supporter.supporter_id = Pledge.donor_id",
/*queryNum = 30: GET Pledge installments w/ ID*/ "SELECT Installments.amount, Installments.installment_date FROM Installments WHERE Installments.pledge_id = @keyword",
/*queryNum = 31: GET Contribution basic info w/ ID*/ "SELECT Contribution.item_name, Contribution.is_event_item, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contributes.contrib_date FROM Supporter, Contributes, Contribution WHERE Contribution.contrib_id = @keyword AND Supporter.supporter_id = Contributes.donor_id AND Contribution.contrib_id = Contributes.contrib_id",
/*queryNum = 32: GET Event Item w/ ID*/ "SELECT Contribution.item_name, Contribution.contrib_type, Contribution.amount, Contribution.pay_method, Contribution.destination, Contribution.notes, Contribution.appeal, Contribution.thanked, Supporter.supporter_id, Supporter.last_name, Supporter.first_name, Contributes.contrib_date, PresentedAt.campaign_id FROM Supporter, Contributes, Contribution, PresentedAt WHERE Contribution.contrib_id = @keyword AND Contribution.is_event_item = 1 AND Supporter.supporter_id = Contributes.donor_id AND Contribution.contrib_id = Contributes.contrib_id AND PresentedAt.contrib_id = Contribution.contrib_id"
];

var deleteQueries = [
/*queryNum = 0: DELETE Supporter w/ ID*/ "DELETE FROM Supporter WHERE Supporter.supporter_id = @keyword",
/*queryNum = 1: DELETE Patient w/ ID*/ "DELETE FROM Patient WHERE Patient.patient_id = @keyword",
/*queryNum = 2: DELETE Event w/ ID*/ "DELETE FROM Campaign WHERE Campaign.campaign_id = @keyword",
/*queryNum = 3: DELETE Pledge w/ ID*/ "DELETE FROM Pledge WHERE Pledge.pledge_id = @keyword",
/*queryNum = 4: DELETE Contribution w/ ID*/ "DELETE FROM Contribution WHERE Contribution.contrib_id = @keyword",
/*queryNum = 5: DELETE Supporter Emails w/ ID*/ "DELETE FROM Email WHERE Email.supporter_id = @id",
/*queryNum = 6: DELETE Supporter Phones w/ ID*/ "DELETE FROM Phone WHERE Phone.supporter_id = @id",
/*queryNum = 7: DELETE Supporter Addresses w/ ID*/ "DELETE FROM Address WHERE Address.supporter_id = @id",
/*queryNum = 8: DELETE Donor Companies w/ ID*/ "DELETE FROM Company WHERE Company.supporter_id = @id",
/*queryNum = 9: DELETE Donor Events w/ ID*/ "DELETE FROM Attends WHERE Attends.donor_id = @id",
/*queryNum = 10: DELETE Staff Events w/ ID*/ "DELETE FROM Works WHERE Works.staff_id = @id",
/*queryNum = 11: DELETE Patient Needs w/ ID*/ "DELETE FROM Needs Where Needs.patient_id = @id",
/*queryNum = 12: DELETE Patient Pledges w/ ID*/ "DELETE FROM Pledge Where Pledge.patient_id = @id"

];

var postQueries =
[
/*queryNum = 0: POST(ADD) Supporter basic info*/ "INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (newSupporterId, newLastName, newFirstName, newSalutation, newAlias)",
/*queryNum = 1: POST(ADD) Supporter emails*/ "INSERT INTO Email (supporter_id, email_address, is_primary) VALUES (newSupporterId, newEmail, newIsPrimary)",
/*queryNum = 2: POST(ADD) Supporter phones*/ "INSERT INTO Phone (supporter_id, phone_type, phone_number, is_primary) VALUES (newSupporterId, newPhoneType, newPhoneNumber, newIsPrimary)",
/*queryNum = 3: POST(ADD) Supporter addresses*/ "INSERT INTO Address (supporter_id, address_type, address_line_1, address_line_2, city, state, zip_code, is_primary) VALUES (newSupporterId, newAddressType, newAddLine1, newAddLine2, newCity, newState, newZip, newIsPrimary)",
/*queryNum = 4: POST(ADD) Supporter companies*/ "INSERT INTO Company (supporter_id, company_name, is_primary) VALUES (newSupporterId, newCompanyName, newIsPrimary)",
/*queryNum = 5: POST(ADD) Donor*/ "INSERT INTO Donor (supporter_id, donor_type, donor_status) VALUES (newSupporterId, newDonorType, newStatus)",
/*queryNum = 6: POST(ADD) Staff*/ "INSERT INTO Staff (supporter_id, staff_type, staff_status) VALUES (newSupporterId, newStaffType, newStatus)",

];

var putQueries = [
/*queryNum = 0: PUT(UPDATE) Supporter w/ ID*/ "UPDATE Supporter SET last_name = newLastName, first_name = newFirstName, salutation = newSalutation, alias = newAlias WHERE supporter_id = keyword",
/*queryNum = 1: PUT(UPDATE) Donor w/ ID*/ "UPDATE Donor SET donor_type = newDonorType, donor_status = newStatus WHERE Donor.supporter_id = keyword",
/*queryNum = 2: PUT(UPDATE) Staff w/ ID*/ "UPDATE Staff SET staff_type = newStaffType, staff_status = newStatus WHERE Staff.supporter_id = keyword"

//Entities you still need to do PUTs/updates
//Patient
//Pledge
//Contribution
//

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

function getNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT Supporter.supporter_id FROM Supporter ORDER BY Supporter.supporter_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);
			resolve(rows[0].supporter_id + 1);
		});
	}).then((newId) =>
	{
		return newId;
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
			})
		})
	})
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

//DELETEs
function deleteIndividualData(id, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var patchedQuery = deleteQueries[queryNum].replace('@keyword', id);
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				return reject(err);
			resolve(rows);
		});
	});
}

var deleteIndividualSupporter = function(id, callback)
{
	deleteIndividualData(id, 0).then((res) =>
	{
		callback(res);
	});
}

var deleteIndividualPatient = function(id, callback)
{
	deleteIndividualData(id, 1).then((res) =>
	{
		callback(res);
	});
}

var deleteIndividualEvent = function(id, callback)
{
	deleteIndividualData(id, 2).then((res) =>
	{
		callback(res);
	});
}

var deleteIndividualPledge = function(id, callback)
{
	deleteIndividualData(id, 3).then((res) =>
	{
		callback(res);
	});
}

var deleteIndividualContribution = function(id, callback)
{
	deleteIndividualData(id, 4).then((res) =>
	{
		callback(res);
	});
}

//POSTs
function addSupporter(newId, body)
{
	//Add basic Supporter info
	return new Promise((resolve, reject) =>
	{
		var basicObj = {
			newSupporterId: newId,
			newLastName: '\'' + body.last_name + '\'',
			newFirstName: '\'' + body.first_name + '\'',
			newSalutation: '\'' + body.salutation + '\'',
			newAlias: '\'' + body.alias + '\''
		}

		var patchedQuery = postQueries[0].replace(/newSupporterId|newLastName|newFirstName|newSalutation|newAlias|keyword/gi, (matched) =>
		{
			return basicObj[matched];
		});

		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				throw(err);
			resolve(rows);
		});
	}).then((res) =>
	{
		//Add emails
		return new Promise((resolve, reject) =>
		{
			body.emails.forEach((email) =>
			{
				var emailObj = {
					newSupporterId: newId,
					newEmail: '\'' + email.email_address + '\'',
					newIsPrimary: email.is_primary
				}

				var patchedQuery = postQueries[1].replace(/newSupporterId|newEmail|newIsPrimary/gi, (matched) =>
				{
					return emailObj[matched];
				});
			
				con.query(patchedQuery, (err, rows) =>
				{
					if (err)
						throw(err);
					resolve(rows);
				});	
			});
		}).then((res) =>
		{
			//Add phones
			return new Promise((resolve, reject) =>
			{
				body.phones.forEach((phone) =>
				{
					var phoneObj = {
						newSupporterId: newId,
						newPhoneType: '\'' + phone.phone_type + '\'',
						newPhoneNumber: '\'' + phone.phone_number + '\'',
						newIsPrimary: phone.is_primary
					}

					var patchedQuery = postQueries[2].replace(/newSupporterId|newPhoneType|newPhoneNumber|newIsPrimary/gi, (matched) =>
					{
						return phoneObj[matched];
					});
			
					con.query(patchedQuery, (err, rows) =>
					{
						if (err)
							throw(err);
						resolve(rows);
					});	
				});
			}).then((res) =>
			{
				//Add addresses
				return new Promise((resolve, reject) =>
				{
					body.addresses.forEach((address) =>
					{
						var addressObj = {
							newSupporterId: newId,
							newAddressType: '\'' + address.address_type + '\'',
							newAddLine1: '\'' + address.address_line_1 + '\'',
							newAddLine2: '\'' + address.address_line_2 + '\'',
							newCity: '\'' + address.city + '\'',
							newState: '\'' + address.state + '\'',
							newZip: '\'' + address.zip_code + '\'',
							newIsPrimary: address.is_primary
						}

						var patchedQuery = postQueries[3].replace(/newSupporterId|newAddressType|newAddLine1|newAddLine2|newCity|newState|newZip|newIsPrimary/gi, (matched) =>
						{
							return addressObj[matched];
						});

						con.query(patchedQuery, (err, rows) =>
						{
							if (err)
								throw(err);
							resolve(rows);
						});	
					});
				});
			});
		});
	});
}

var addDonor = function(body, callback)
{
	//Generate new id
	getNewId().then((newId) =>
	{
		//Add supporter info
		addSupporter(newId, body).then((res) =>
		{
			//Add donor info
			return new Promise((resolve, reject) =>
			{
				var basicObj = {
					newSupporterId: newId,
					newDonorType: '\'' + body.donor_type + '\'',
					newStatus: '\'' + body.donor_status + '\''
				}
				var patchedQuery = postQueries[5].replace(/newSupporterId|newDonorType|newStatus/gi, (matched) =>
				{
					return basicObj[matched];
				});

				con.query(patchedQuery, (err, rows) =>
				{
					if (err)
						throw err;
					resolve(rows);
				});
			}).then((res) =>
			{
				//Add companies
				return new Promise((resolve, reject) =>
				{
					body.companies.forEach((company) =>
					{
						var companyObj = {
							newSupporterId: newId,
							newCompanyName: '\'' + company.company_name + '\'',
							newIsPrimary: company.is_primary
						}

						var patchedQuery = postQueries[4].replace(/newSupporterId|newCompanyName|newIsPrimary/gi, (matched) =>
						{
							return companyObj[matched];
						});

						con.query(patchedQuery, (err, rows) =>
						{
							if (err)
								throw(err);
							resolve(rows);
						});	
					});
				}).then((res) =>
				{
					callback(res);
				});
			});
		});
	});
}

var addStaff = function(body, callback)
{
	//Generate new id
	getNewId().then((newId) =>
	{
		//Add supporter info
		addSupporter(newId, body).then((res) =>
		{
			//Add staff info
			return new Promise((resolve, reject) =>
			{
				var basicObj = {
					newSupporterId: newId,
					newStaffType: '\'' + body.staff_type + '\'',
					newStatus: '\'' + body.staff_status + '\''
				}

				var patchedQuery = postQueries[6].replace(/newSupporterId|newStaffType|newStatus/gi, (matched) =>
				{
					return basicObj[matched];
				});

				con.query(patchedQuery, (err, rows) =>
				{
					if (err)
						throw err;
					resolve(rows);
				});
			}).then((res) =>
			{
				callback(res);
			});
		});
	});
}

//PUTs *********************** LOOK HERE JAMES
function updateSupporterData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var basicObj = {
			newLastName: '\'' + body.last_name + '\'',
			newFirstName: '\'' + body.first_name + '\'',
			newSalutation: '\'' + body.salutation + '\'',
			newAlias: '\'' + body.alias + '\'',
			keyword: id
		};

		var patchedQuery = putQueries[0].replace(/newLastName|newFirstName|newSalutation|newAlias|keyword/gi, (matched) =>
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

		//Drop existing emails
		con.query(deleteQueries[5].replace('@id', id));
	}).then((res) =>
	{	
		//Add emails
		return new Promise((resolve, reject) =>
		{
			body.emails.forEach((email) =>
			{
				var emailObj = {
					newSupporterId: id,
					newEmail: '\'' + email.email_address + '\'',
					newIsPrimary: email.is_primary
				}

				var patchedQuery = postQueries[1].replace(/newSupporterId|newEmail|newIsPrimary/gi, (matched) =>
				{
					return emailObj[matched];
				});
			
				con.query(patchedQuery, (err, rows) =>
				{
					if (err)
						throw(err);
					resolve(rows);
				});	
			});

			//Drop existing phones
			con.query(deleteQueries[6].replace('@id', id));
		}).then((res) =>
		{
			//Add phones
			return new Promise((resolve, reject) =>
			{
				body.phones.forEach((phone) =>
				{
					var phoneObj = {
						newSupporterId: id,
						newPhoneType: '\'' + phone.phone_type + '\'',
						newPhoneNumber: '\'' + phone.phone_number + '\'',
						newIsPrimary: phone.is_primary
					}

					var patchedQuery = postQueries[2].replace(/newSupporterId|newPhoneType|newPhoneNumber|newIsPrimary/gi, (matched) =>
					{
						return phoneObj[matched];
					});
			
					con.query(patchedQuery, (err, rows) =>
					{
						if (err)
							throw(err);
						resolve(rows);
					});	
				});
			
				//Drop existing addresses
				con.query(deleteQueries[7].replace('@id', id));
			}).then((res) =>
			{
				//Add addresses
				return new Promise((resolve, reject) =>
				{
					body.addresses.forEach((address) =>
					{
						var addressObj = {
							newSupporterId: id,
							newAddressType: '\'' + address.address_type + '\'',
							newAddLine1: '\'' + address.address_line_1 + '\'',
							newAddLine2: '\'' + address.address_line_2 + '\'',
							newCity: '\'' + address.city + '\'',
							newState: '\'' + address.state + '\'',
							newZip: '\'' + address.zip_code + '\'',
							newIsPrimary: address.is_primary
						}

						var patchedQuery = postQueries[3].replace(/newSupporterId|newAddressType|newAddLine1|newAddLine2|newCity|newState|newZip|newIsPrimary/gi, (matched) =>
						{
							return addressObj[matched];
						});

						con.query(patchedQuery, (err, rows) =>
						{
							if (err)
								throw(err);
							resolve(rows);
						});	
					});
				}).then((res) =>
				{
					
				});
			})
		});
	});
}

// Test ****************************
function updatePatientData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		//Drop existing needs
		con.query(deleteQueries[5].replace('@id', id));
	}).then((res) =>
	{
		//Add emails
		return new Promise((resolve, reject) =>
		{
			body.emails.forEach((email) =>
			{
				var emailObj = {
					newSupporterId: id,
					newEmail: '\'' + email.email_address + '\'',
					newIsPrimary: email.is_primary
				}

				var patchedQuery = postQueries[1].replace(/newSupporterId|newEmail|newIsPrimary/gi, (matched) =>
				{
					return emailObj[matched];
				});
			
				con.query(patchedQuery, (err, rows) =>
				{
					if (err)
						throw(err);
					resolve(rows);
				});	
			});

			//Drop existing phones
			con.query(deleteQueries[6].replace('@id', id));
		}).then((res) =>
		{
			//Add phones
			return new Promise((resolve, reject) =>
			{
				body.phones.forEach((phone) =>
				{
					var phoneObj = {
						newSupporterId: id,
						newPhoneType: '\'' + phone.phone_type + '\'',
						newPhoneNumber: '\'' + phone.phone_number + '\'',
						newIsPrimary: phone.is_primary
					}

					var patchedQuery = postQueries[2].replace(/newSupporterId|newPhoneType|newPhoneNumber|newIsPrimary/gi, (matched) =>
					{
						return phoneObj[matched];
					});
			
					con.query(patchedQuery, (err, rows) =>
					{
						if (err)
							throw(err);
						resolve(rows);
					});	
				});
			})
		})
	})
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

		var patchedQuery = putQueries[1].replace(/newDonorType|newStatus|keyword/gi, (matched) =>
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
	updateSupporterData(id, body, 0).then((res) =>
	{
		updateDonorData(id, body, 1).then((data) =>
		{
			callback(data);
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

		var patchedQuery = putQueries[2].replace(/newStaffType|newStatus|keyword/gi, (matched) =>
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
{
	updateSupporterData(id, body, 0).then((res) =>
	{
		updateStaffData(id, body, 2).then((data) =>
		{
			callback(data);
		});
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

//POSTs
exports.addDonor = addDonor;
exports.addStaff = addStaff;

//PUTs
exports.updateIndividualDonor = updateIndividualDonor;
exports.updateIndividualStaff = updateIndividualStaff;