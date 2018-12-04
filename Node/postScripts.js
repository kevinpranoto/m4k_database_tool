'use strict';

var mysql = require('mysql');
var Promise = require('promise');

var con = mysql.createConnection({
	host:"m4k-database.c947krbzy1fm.us-west-1.rds.amazonaws.com",
	user: "databois",
	password: "databoisroxx",
	database: "m4k_database"
});

var postQueries =
[
/*queryNum = 0: POST(ADD) Supporter basic info*/ "INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (newSupporterId, newLastName, newFirstName, newSalutation, newAlias)",
/*queryNum = 1: POST(ADD) Supporter emails*/ "INSERT INTO Email (supporter_id, email_address, is_primary) VALUES (newSupporterId, newEmail, newIsPrimary)",
/*queryNum = 2: POST(ADD) Supporter phones*/ "INSERT INTO Phone (supporter_id, phone_type, phone_number, is_primary) VALUES (newSupporterId, newPhoneType, newPhoneNumber, newIsPrimary)",
/*queryNum = 3: POST(ADD) Supporter addresses*/ "INSERT INTO Address (supporter_id, address_type, address_line_1, address_line_2, city, state, zip_code, is_primary) VALUES (newSupporterId, newAddressType, newAddLine1, newAddLine2, newCity, newState, newZip, newIsPrimary)",
/*queryNum = 4: POST(ADD) Supporter companies*/ "INSERT INTO Company (supporter_id, company_name, is_primary) VALUES (newSupporterId, newCompanyName, newIsPrimary)",
/*queryNum = 5: POST(ADD) Donor*/ "INSERT INTO Donor (supporter_id, donor_type, donor_status) VALUES (newSupporterId, newDonorType, newStatus)",
/*queryNum = 6: POST(ADD) Staff*/ "INSERT INTO Staff (supporter_id, staff_type, staff_status) VALUES (newSupporterId, newStaffType, newStatus)",
/*queryNum = 7: POST(ADD) Patient*/ "INSERT INTO Patient (patient_id) VALUES (newPatientId)",
/*queryNum = 8: POST(ADD) Needs*/ "INSERT INTO Needs (patient_id, item) VALUES (newPatientId, newItem)",
/*queryNum = 9: POST(ADD) Pledge*/ "INSERT INTO Pledge (pledge_id, donor_id, patient_id, pledge_date, target_amount, is_behind) VALUES (newPledgeId, newDonorId, newPatientId, newPledgeDate, newTargetAmount, newIsBehind)",
/*queryNum = 10: POST(ADD) Installment*/ "INSERT INTO Installments (pledge_id, amount, installment_date) VALUES (newPledgeId, newAmount, newInstallmentDate)",
/*queryNum = 11: POST(ADD) Campaign*/ "INSERT INTO Campaign (campaign_id, campaign_name, campaign_type_id, is_event, campaign_date, theme) VALUES (newCampaignId, newCampaignName, newCampaignTypeId, newIsEvent, newCampaignDate, newTheme)",
/*queryNum = 12: POST(ADD) Donor to Event*/ "INSERT INTO Attends (donor_id, campaign_id) VALUES (newDonorId, newCampaignId)",
/*queryNum = 13: POST(ADD) Staff to Event*/ "INSERT INTO Works (staff_id, campaign_id) VALUES (newStaffId, newCampaignId)",
/*queryNum = 14: POST(ADD) Event Item to Event*/ "INSERT INTO PresentedAt (contrib_id, campaign_id) VALUES (newContribId, newCampaignId)",
/*queryNum = 15: POST(ADD) Contribution*/ "INSERT INTO Contribution (contrib_id, donor_id, contrib_date, item_name, is_event_item, contrib_type, amount, pay_method, destination, notes, appeal, thanked) VALUES (newContribId, newDonorId, newContribDate, newItemName, newIsEventItem, newContribType, newAmount, newPayMethod, newDestination, newNotes, newAppeal, newThanked)",
/*queryNum = 16: POST(ADD) CampaignType*/ "INSERT INTO CampaignType (campaign_type_id, campaign_type_name) VALUES (newCampaignTypeId, newCampaignTypeName)"
];


function getSupporterNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT Supporter.supporter_id FROM Supporter ORDER BY Supporter.supporter_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);
			
			var maxId = 1;
			if (rows.length > 0)
			{
				maxId += rows[0].supporter_id;
			}

			resolve(maxId);
		});
	}).then((newId) =>
	{
		return newId;
	});
}

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

			resolve();
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

				resolve();
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

					resolve();
				});
			});
		});
	});
}

//DONORS
var addDonor = function(body, callback)
{
	//Generate new id
	getSupporterNewId().then((newId) =>
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

					resolve();
				}).then((res) =>
				{
					callback(res);
				});
			});
		});
	});
}

//STAFF
var addStaff = function(body, callback)
{
	//Generate new id
	getSupporterNewId().then((newId) =>
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

//PATIENTS
function getPatientNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT Patient.patient_id FROM Patient ORDER BY Patient.patient_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);

			var maxId = 1;
			if (rows.length > 0)
			{
				maxId += rows[0].patient_id;
			}

			resolve(maxId);
		});
	}).then((newId) =>
	{
		return newId;
	});
}

var addPatient = function(body, callback)
{
	getPatientNewId().then((newId) =>
	{
		// Add basic Patient info
		return new Promise((resolve, reject) =>
		{
			var patchedQuery = postQueries[7].replace("newPatientId", newId);

			con.query(patchedQuery, (err, rows) =>
			{
				if (err) {
					throw (error);
				}
				resolve (rows);
			});
		}).then((res) =>
		{
			//Add Patient needs info
			return new Promise((resolve, reject) =>
			{
				body.needs.forEach((need) =>
				{
					var basicObj = {
						newPatientId : newId,
						newItem : '\'' + need.item + '\''
					}
			
					var patchedQuery = postQueries[8].replace(/newPatientId|newItem/gi, (matched) =>
					{
						return basicObj[matched];
					});
					
					con.query(patchedQuery, (err, rows) =>
					{
						if (err) {
							throw (err);
						}
						resolve (rows);
					});
				});

				resolve();
			}).then((res) =>
			{
				callback(res);
			});
		});
	});
}

//PLEDGES
function getPledgeNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT Pledge.pledge_id FROM Pledge ORDER BY Pledge.pledge_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);

			var maxId = 1;
			if (rows.length > 0)
			{
				maxId += rows[0].pledge_id;
			}

			resolve(maxId);
		});
	}).then((newId) =>
	{
		return newId;
	});
}

var addPledge = function(body, callback)
{
	getPledgeNewId().then((newId) =>
	{
		//Add basic Pledge info
		return new Promise((resolve, reject) =>
		{
			var basicObj = {
				newPledgeId: newId,
				newDonorId: '\'' + body.donor_id + '\'',
				newPatientId: '\'' + body.patient_id + '\'',
				newPledgeDate: '\'' + body.pledge_date + '\'',
				newTargetAmount: '\'' + body.target_amount + '\'',
				newIsBehind: '\'' + body.is_behind + '\''
			}

			var patchedQuery = postQueries[9].replace(/newPledgeId|newDonorId|newPatientId|newPledgeDate|newTargetAmount|newIsBehind/gi, (matched) =>
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
			//Add Pledge installment info
			return new Promise((resolve, reject) =>
			{
				body.installments.forEach((installment) =>
				{
					return new Promise((resolve, reject) =>
					{
						var basicObj = {
							newPledgeId : newId,
							newAmount : '\'' + installment.amount + '\'',
							newInstallmentDate : '\'' + installment.installment_date + '\''
						}
						
						var patchedQuery = postQueries[10].replace(/newPledgeId|newAmount|newInstallmentDate/gi, (matched) =>
						{
							return basicObj[matched];
						});

						con.query(patchedQuery, (err, rows) =>
						{
							if (err) {
								throw (err);
							}
							resolve (rows);
						});
					});
				});
				resolve(res);
			}).then((res) =>
			{
				callback(res);
			});
		});
	});
}


//CAMPAIGNS
function getCampaignNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT Campaign.campaign_id FROM Campaign ORDER BY Campaign.campaign_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);

			var maxId = 1;
			if (rows.length > 0)
			{
				maxId += rows[0].campaign_id;
			}

			resolve(maxId);
		});
	}).then((newId) =>
	{
		return newId;
	});
}

var addCampaign = function(body, callback)
{
	getCampaignNewId().then((newId) =>
	{
		//Add basic Campaign info
		return new Promise((resolve, reject) =>
		{
			var basicObj = {
				newCampaignId: newId,
				newCampaignName: '\'' + body.campaign_name + '\'',
				newCampaignTypeId: '\'' + body.campaign_type_id + '\'',
				newIsEvent: '\'' + body.is_event + '\'',
				newCampaignDate: '\'' + body.campaign_date + '\'',
				newTheme: '\'' + body.theme + '\''
			}

			var patchedQuery = postQueries[11].replace(/newCampaignId|newCampaignName|newCampaignTypeId|newIsEvent|newCampaignDate|newTheme/gi, (matched) =>
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
			//Add Campaign donor info
			return new Promise((resolve, reject) =>
			{
				body.donors.forEach((donor) =>
				{
					var donorObj = {
						newDonorId: donor,
						newCampaignId: newId
					}

					var patchedQuery = postQueries[12].replace(/newDonorId|newCampaignId/gi, (matched) =>
					{
						return donorObj[matched];
					});

					con.query(patchedQuery, (err, rows) =>
					{
						if (err) {
							throw (err);
						}
						resolve (rows);
					});
				});

				resolve();
			}).then((res) =>
			{
				//Add Campaign staff info
				return new Promise((resolve, reject) =>
				{
					body.staff.forEach((staff) =>
					{
						var staffObj = {
							newStaffId: staff,
							newCampaignId : newId
						}
							
						var patchedQuery = postQueries[13].replace(/newStaffId|newCampaignId/gi, (matched) =>
						{
							return staffObj[matched];
						});

						con.query(patchedQuery, (err, rows) =>
						{
							if (err) {
								throw (err);
							}
							resolve (rows);
						});
					});

					resolve();
				}).then((res) =>
				{
					return new Promise((resolve, reject) =>
					{
						body.contributions.forEach((contribution) =>
						{
							var contribObj = {
								newContribId: contribution,
								newCampaignId : newId
							}
								
							var patchedQuery = postQueries[14].replace(/newContribId|newCampaignId/gi, (matched) =>
							{
								return contribObj[matched];
							});

							con.query(patchedQuery, (err, rows) =>
							{
								if (err) {
									throw (err);
								}
								resolve (rows);
							});
						});

						resolve();
					}).then((res) =>
					{
						callback(res);
					});
				});
			});
		});
	});
}

//CONTRIBUTIONS
function getContributionNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT Contribution.contrib_id FROM Contribution ORDER BY Contribution.contrib_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);

			var maxId = 1;
			if (rows.length > 0)
			{
				maxId += rows[0].contrib_id;
			}

			resolve(maxId);
		});
	}).then((newId) =>
	{
		return newId;
	});
}


var addContribution = function(body, callback)
{
	console.log(body);
	getContributionNewId().then((newId) =>
	{
		return new Promise((resolve, reject) =>
		{
			var basicObj = {
				newContribId: newId,
				newDonorId: body.donor_id,
				newContribDate: '\'' + body.contrib_date + '\'',
				newItemName: '\'' + body.item_name + '\'',
				newIsEventItem: body.is_event_item,
				newContribType: '\'' + body.contrib_type + '\'',
				newAmount: body.amount,
				newPayMethod: '\'' + body.pay_method + '\'',
				newDestination: '\'' + body.destination + '\'',
				newNotes: '\'' + body.notes + '\'',
				newAppeal: '\'' + body.appeal + '\'',
				newThanked: body.thanked
			}

			var patchedQuery = postQueries[15].replace(/newContribId|newDonorId|newContribDate|newItemName|newIsEventItem|newContribType|newAmount|newPayMethod|newDestination|newNotes|newAppeal|newThanked/gi, (matched) =>
			{
				return basicObj[matched];
			});

			console.log(patchedQuery);
			con.query(patchedQuery, (err, rows) =>
			{
				if (err)
					throw(err);
				resolve(rows);
			});
		}).then((res) =>
		{
			callback(res);
		});
	});
}

//CAMPAIGN TYPE
function getCampaignTypeNewId()
{
	return new Promise((resolve, reject) =>
	{
		con.query("SELECT CampaignType.campaign_type_id FROM CampaignType ORDER BY CampaignType.campaign_type_id DESC LIMIT 0, 1", (err, rows) =>
		{
			if (err)
				reject(err);

			var maxId = 1;
			if (rows.length > 0)
			{
				maxId += rows[0].campaign_type_id;
			}

			resolve(maxId);
		});
	}).then((newId) =>
	{
		return newId;
	});
}

var addCampaignType = function(body, callback)
{
	getCampaignTypeNewId().then((newId) =>
	{
		return new Promise((resolve, reject) =>
		{
			var campaignTypeObj = {
				newCampaignTypeId: newId,
				newCampaignTypeName: '\'' + body.campaign_type_name + '\''
			}

			var patchedQuery = postQueries[16].replace(/newCampaignTypeId|newCampaignTypeName/gi, (matched) =>
			{
				return campaignTypeObj[matched];
			});

			con.query(patchedQuery, (err, rows) =>
			{
				if (err)
					throw(err);
				resolve(rows);
			});
		}).then((res) =>
		{
			callback(res);
		});
	});
}

exports.addDonor = addDonor;
exports.addStaff = addStaff;
exports.addPatient = addPatient;
exports.addPledge = addPledge;
exports.addCampaign = addCampaign;
exports.addContribution = addContribution;
exports.addCampaignType = addCampaignType;