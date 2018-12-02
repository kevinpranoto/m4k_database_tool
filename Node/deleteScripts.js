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
];

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

exports.deleteIndividualSupporter = deleteIndividualSupporter;
exports.deleteIndividualPatient = deleteIndividualPatient;
exports.deleteIndividualEvent = deleteIndividualEvent;
exports.deleteIndividualPledge = deleteIndividualPledge;
exports.deleteIndividualContribution = deleteIndividualContribution;