'use strict';

var mysql = require('mysql');
var Promise = require('promise');

var con = mysql.createConnection({
	host:"m4k-database.c947krbzy1fm.us-west-1.rds.amazonaws.com",
	user: "databois",
	password: "databoisroxx",
	database: "m4k_database"
});

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
/*queryNum = 11: DELETE Patient Needs w/ ID*/ "DELETE FROM Needs WHERE Needs.patient_id = @id",
/*queryNum = 12: DELETE Pledge Installments w/ ID*/ "DELETE FROM Installments WHERE Installments.pledge_id = @id",
/*queryNum = 13: DELETE Event Donors w/ ID*/ "DELETE FROM Attends WHERE Attends.campaign_id = @id",
/*queryNum = 14: DELETE Event Staff w/ ID*/ "DELETE FROM Works WHERE Works.campaign_id = @id",
/*queryNum = 15: DELETE Event Contributions w/ ID*/ "DELETE FROM PresentedAt WHERE PresentedAt.campaign_id = @id",
];

var postQueries = [
/*queryNum = 0: POST(ADD) Supporter basic info*/ "INSERT INTO Supporter (supporter_id, last_name, first_name, salutation, alias) VALUES (newSupporterId, newLastName, newFirstName, newSalutation, newAlias)",
/*queryNum = 1: POST(ADD) Supporter emails*/ "INSERT INTO Email (supporter_id, email_address, is_primary) VALUES (newSupporterId, newEmail, newIsPrimary)",
/*queryNum = 2: POST(ADD) Supporter phones*/ "INSERT INTO Phone (supporter_id, phone_type, phone_number, is_primary) VALUES (newSupporterId, newPhoneType, newPhoneNumber, newIsPrimary)",
/*queryNum = 3: POST(ADD) Supporter addresses*/ "INSERT INTO Address (supporter_id, address_type, address_line_1, address_line_2, city, state, zip_code, is_primary) VALUES (newSupporterId, newAddressType, newAddLine1, newAddLine2, newCity, newState, newZip, newIsPrimary)",
/*queryNum = 4: POST(ADD) Supporter companies*/ "INSERT INTO Company (supporter_id, company_name, is_primary) VALUES (newSupporterId, newCompanyName, newIsPrimary)",
/*queryNum = 5: POST(ADD) Donor*/ "INSERT INTO Donor (supporter_id, donor_type, donor_status) VALUES (newSupporterId, newDonorType, newStatus)",
/*queryNum = 6: POST(ADD) Staff*/ "INSERT INTO Staff (supporter_id, staff_type, staff_status) VALUES (newSupporterId, newStaffType, newStatus)",
/*queryNum = 7: POST(ADD) Patient Needs*/ "INSERT INTO Needs (patient_id, item) VALUES (newPatientId, newItem)",
/*queryNum = 8: POST(ADD) Pledge Installments*/ "INSERT INTO Installments (pledge_id, amount, installment_date) VALUES (newPledgeId, newAmount, newInstallmentDate)",
/*queryNum = 9: POST(ADD) Donors to Event*/ "INSERT INTO Attends (donor_id, campaign_id) VALUES (newDonorId, newCampaignId)",
/*queryNum = 10: POST(ADD) Staff to Event*/ "INSERT INTO Works (staff_id, campaign_id) VALUES (newStaffId, newCampaignId)",
/*queryNum = 11: POST(ADD) Contributions to Event*/ "INSERT INTO PresentedAt (contrib_id, campaign_id) VALUES (newContribId, newCampaignId)"
];

var putQueries = [
/*queryNum = 0: PUT(UPDATE) Supporter w/ ID*/ "UPDATE Supporter SET last_name = newLastName, first_name = newFirstName, salutation = newSalutation, alias = newAlias WHERE supporter_id = keyword",
/*queryNum = 1: PUT(UPDATE) Donor w/ ID*/ "UPDATE Donor SET donor_type = newDonorType, donor_status = newStatus WHERE Donor.supporter_id = keyword",
/*queryNum = 2: PUT(UPDATE) Staff w/ ID*/ "UPDATE Staff SET staff_type = newStaffType, staff_status = newStatus WHERE Staff.supporter_id = keyword",
/*queryNum = 3: PUT(UPDATE) Pledge w/ ID*/ "UPDATE Pledge SET pledge_date = newPledgeDate, target_amount = newTargetAmount, is_behind = newIsBehind WHERE pledge_id = keyword",
/*queryNum = 4: PUT(UPDATE) Campaign w/ ID*/ "UPDATE Campaign SET campaign_name = newCampaignName, campaign_type_id = newCampaignTypeId, is_event = newIsEvent, campaign_date = newCampaignDate, theme = newTheme WHERE campaign_id = keyword",
/*queryNum = 5: PUT(UPDATE) Contribution w/ ID*/ "UPDATE Contribution SET Contribution.donor_id = newDonorId, Contribution.contrib_date = newContribDate, Contribution.item_name = newItemName, Contribution.is_event_item = newIsEventItem, Contribution.contrib_type = newContribType, Contribution.amount = newAmount, Contribution.pay_method = newPayMethod, Contribution.destination = newDestination, Contribution.notes = newNotes, Contribution.appeal = newAppeal, Contribution.thanked = newThanked WHERE Contribution.contrib_id = keyword",
/*queryNum = 6: PUT(UPDATE) CampaignType w/ ID*/ "UPDATE CampaignType SET CampaignType.campaign_type_name = newCampaignTypeName WHERE campaign_type_id = keyword"
];

//SUPPORTER
function updateSupporterData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var basicObj = {
			newLastName: '\"' + body.last_name + '\"',
			newFirstName: '\"' + body.first_name + '\"',
			newSalutation: '\"' + body.salutation + '\"',
			newAlias: '\"' + body.alias + '\"',
			keyword: id
		};

		var patchedQuery = putQueries[0].replace(/newLastName|newFirstName|newSalutation|newAlias|keyword/gi, (matched) =>
		{
			return basicObj[matched];
		});
		
		//Update basic information
		console.log(patchedQuery);
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				 throw err;
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
					newEmail: '\"' + email.email_address + '\"',
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
			con.query(deleteQueries[6].replace('@id', id), (err, rows) =>
			{
				if (err)
					throw err;
				resolve(rows);
			});
		}).then((res) =>
		{
			//Add phones
			return new Promise((resolve, reject) =>
			{
				body.phones.forEach((phone) =>
				{
					var phoneObj = {
						newSupporterId: id,
						newPhoneType: '\"' + phone.phone_type + '\"',
						newPhoneNumber: '\"' + phone.phone_number + '\"',
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
				con.query(deleteQueries[7].replace('@id', id), (err, rows) =>
				{
					if (err)
						throw err;
					resolve(rows);
				});
			}).then((res) =>
			{
				//Add addresses
				return new Promise((resolve, reject) =>
				{
					body.addresses.forEach((address) =>
					{
						var addressObj = {
							newSupporterId: id,
							newAddressType: '\"' + address.address_type + '\"',
							newAddLine1: '\"' + address.address_line_1 + '\"',
							newAddLine2: '\"' + address.address_line_2 + '\"',
							newCity: '\"' + address.city + '\"',
							newState: '\"' + address.state + '\"',
							newZip: '\"' + address.zip_code + '\"',
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
				}).then((res) =>
				{

				});
			})
		});
	});
}

//DONOR
function updateDonorData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var fieldObj = {
			newDonorType: '\"' + body.donor_type + '\"',
			newStatus: '\"' + body.donor_status + '\"',
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

		//Drop existing companies
		con.query(deleteQueries[8].replace('@id', id));
	}).then((res) =>
	{
		//Add companies
		return new Promise((resolve, reject) =>
		{
			body.companies.forEach((company) =>
			{
				var companyObj = {
					newSupporterId: id,
					newCompanyName: '\"' + company.company_name + '\"',
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

//STAFF
function updateStaffData(id, body, queryNum)
{
	return new Promise((resolve, reject) =>
	{
		var fieldObj = {
			newStaffType: '\"' + body.staff_type + '\"',
			newStatus: '\"' + body.staff_status + '\"',
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

//PATIENT
var updateIndividualPatient = function(id, body, callback)
{
	return new Promise((resolve, reject) =>
	{
		//Drop existing needs
		con.query(deleteQueries[11].replace('@id', id), (err, rows) =>
		{
			if (err)
				throw err;
			resolve(rows);
		});
	}).then((res) =>
	{
		//Add new needs
		return new Promise((resolve, reject) =>
		{
			body.needs.forEach((need) =>
			{
				var needObj = {
					newPatientId: id,
					newItem: '\"' + need.item + '\"'
				}
				
				var patchedQuery = postQueries[7].replace(/newPatientId|newItem/gi, (matched) =>
				{
					return needObj[matched];
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
}

//PLEDGE
var updateIndividualPledge = function(id, body, callback)
{
	return new Promise((resolve, reject) =>
	{
		var basicObj = {
			newPledgeDate: '\"' + body.pledge_date + '\"',
			newTargetAmount: '\"' + body.target_amount + '\"',
			newIsBehind: body.is_behind,
			keyword: id
		};
		
		var patchedQuery = putQueries[3].replace(/newPledgeDate|newTargetAmount|newIsBehind|keyword/gi, (matched) =>
		{
			return basicObj[matched];
		});
		
		//Update basic information
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				 throw err;
			resolve(rows);
		});

		con.query(deleteQueries[12].replace('@id', id));
	}).then((res) =>
	{
		//Add new installments
		return new Promise((resolve, reject) =>
		{
			body.installments.forEach((installment) =>
			{
				var installmentObj = {
					newPledgeId: id,
					newAmount: '\"' + installment.amount + '\"',
					newInstallmentDate: '\"' + installment.installment_date + '\"'
				}

				var patchedQuery = postQueries[8].replace(/newPledgeId|newAmount|newInstallmentDate/gi, (matched) =>
				{
					return installmentObj[matched];
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
}


//CAMPAIGN
var updateIndividualCampaign = function(id, body, callback)
{
	return new Promise((resolve, reject) =>
	{
		var basicObj = {
			newCampaignId: body.campaign_id,
			newCampaignName: '\"' + body.campaign_name + '\"',
			newCampaignTypeId: body.campaign_type_id,
			newIsEvent: body.is_event,
			newCampaignDate: '\"' + body.campaign_date + '\"',
			newTheme: '\"' + body.theme + '\"',
			keyword: id
		};
		
		var patchedQuery = putQueries[4].replace(/newCampaignId|newCampaignName|newCampaignTypeId|newIsEvent|newCampaignDate|newTheme|keyword/gi, (matched) =>
		{
			return basicObj[matched];
		});
		
		//Update basic information
		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				 throw err;
			resolve(rows);
		});

		//Drop existing donors
		con.query(deleteQueries[13].replace('@id', id));
	}).then((res) =>
	{
		return new Promise((resolve, reject) =>
		{
			//Add new donors
			body.donors.forEach((donor) =>
			{
				var donorObj = {
					newDonorId: donor,
					newCampaignId: id
				}

				var patchedQuery = postQueries[9].replace(/newDonorId|newCampaignId/gi, (matched) =>
				{
					return donorObj[matched];
				});

				con.query(patchedQuery, (err, rows) =>
				{
					if (err)
						throw err;
					resolve(rows);
				});
			});

			//Drop existing staff
			con.query(deleteQueries[14].replace('@id', id), (err, rows) =>
			{
				if (err)
					throw err;
				resolve(rows);
			});
		}).then((res) =>
		{
			return new Promise((resolve, reject) =>
			{
				body.staff.forEach((staff) =>
				{
					//Add new staff
					var staffObj = {
						newStaffId: staff,
						newCampaignId: id
					}

					var patchedQuery = postQueries[10].replace(/newStaffId|newCampaignId/gi, (matched) =>
					{
						return staffObj[matched];
					});

					con.query(patchedQuery, (err, rows) =>
					{
						if (err)
							throw err;
						resolve(rows);
					});
				});
				
				//Drop existing contributions
				con.query(deleteQueries[15].replace('@id', id), (err, rows) =>
				{
					if (err)
						throw err;
					resolve(rows);
				});
			}).then((res) =>
			{
				return new Promise((resolve, reject) =>
				{
					body.contributions.forEach((contribution) =>
					{
						//Add new contributions
						var contribObj = {
							newContribId: contribution,
							newCampaignId: id
						}
				
						var patchedQuery = postQueries[11].replace(/newContribId|newCampaignId/gi, (matched) =>
						{
							return contribObj[matched];
						});

						con.query(patchedQuery, (err, rows) =>
						{
							if (err)
								throw err;
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


//CONTRIBUTIONS
var updateIndividualContribution = function(id, body, callback)
{
	return new Promise((resolve, reject) =>
	{
		var basicObj = {
			newDonorId: body.donor_id,
			newContribDate: '\"' + body.contrib_date + '\"',
			newItemName: '\"' + body.item_name + '\"',
			newIsEventItem: body.is_event_item,
			newContribType: '\"' + body.contrib_type + '\"',
			newAmount: body.amount,
			newPayMethod: '\"' + body.pay_method + '\"',
			newDestination: '\"' + body.destination + '\"',
			newNotes: '\"' + body.notes + '\"',
			newAppeal: '\"' + body.appeal + '\"',
			newThanked: body.thanked,
			keyword: id
		};
		
		var patchedQuery = putQueries[5].replace(/newDonorId|newContribDate|newItemName|newIsEventItem|newContribType|newAmount|newPayMethod|newDestination|newNotes|newAppeal|newThanked|keyword/gi, (matched) =>
		{
			return basicObj[matched];
		});

		//Update basic information
		console.log(patchedQuery);
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
}


//CAMPAIGNTYPE
var updateIndividualCampaignType = function(id, body, callback)
{
	return new Promise((resolve, reject) =>
	{
		var campaignTypeObj = {
			newCampaignTypeName: '\"' + body.campaign_type_name + '\"',
			keyword: id
		};

		var patchedQuery = putQueries[6].replace(/newCampaignTypeName|keyword/gi, (matched) =>
		{
			return campaignTypeObj[matched];
		});

		con.query(patchedQuery, (err, rows) =>
		{
			if (err)
				throw err;
			resolve (rows);
		})
	}).then((res) =>
	{
		callback(res);
	});
}

exports.updateIndividualDonor = updateIndividualDonor;
exports.updateIndividualStaff = updateIndividualStaff;
exports.updateIndividualPatient = updateIndividualPatient;
exports.updateIndividualPledge = updateIndividualPledge;
exports.updateIndividualCampaign = updateIndividualCampaign;
exports.updateIndividualContribution = updateIndividualContribution;
exports.updateIndividualCampaignType = updateIndividualCampaignType;