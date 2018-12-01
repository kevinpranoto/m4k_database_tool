'use strict';

var mysql = require('mysql');
var Promise = require('promise');

var con = mysql.createConnection({
	host:"m4k-database.c947krbzy1fm.us-west-1.rds.amazonaws.com",
	user: "databois",
	password: "databoisroxx",
	database: "m4k_database"
});

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