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
/*queryNum = 6: POST(ADD) Staff*/ "INSERT INTO Staff (supporter_id, staff_type, staff_status) VALUES (newSupporterId, newStaffType, newStatus)"

];

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

		console.log(patchedQuery);
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

exports.addDonor = addDonor;
exports.addStaff = addStaff;