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
/*queryNum = 6: POST(ADD) Staff*/ "INSERT INTO Staff (supporter_id, staff_type, staff_status) VALUES (newSupporterId, newStaffType, newStatus)"

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
					newEmail: '\'' + email.email_address + '\'',
					newIsPrimary: email.is_primary
				}

				var patchedQuery = postQueries[1].replace(/newSupporterId|newEmail|newIsPrimary/gi, (matched) =>
				{
					return emailObj[matched];
				});
			
				console.log(patchedQuery);
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

exports.updateIndividualDonor = updateIndividualDonor;
exports.updateIndividualStaff = updateIndividualStaff;