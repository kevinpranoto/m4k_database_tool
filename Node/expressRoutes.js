'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const getQueries = require('./getScripts.js');
const deleteQueries = require('./deleteScripts.js');
const postQueries = require('./postScripts.js');
const putQueries = require('./putScripts.js');


//DEAL WITH CORS ISSUES
var originsWhiteList = ['http://127.0.0.1:8080', 'localhost:8080'];
var corsOptions = {
	origin: function(origin, callback)
	{
		var isWhiteListed = originsWhiteList.indexOf(origin) !== -1;
		callback(null, isWhiteListed);
	},
	credentials: true
}
app.use(cors(corsOptions));
var jsonParser = bodyParser.json();


//HANDLE LOGIN
app.route('/login').post(jsonParser, (req, res, next) =>
{
	postQueries.validateLogin(req.body, (err, data) =>
	{
		if (err)
		{
			console.log('BAD LOGIN');
			res.status(401).send(data);
		}
		else
		{
			console.log('Validated login');
			res.status(200).send(data);	
		}
	});
});

//HANDLE GENERAL DONOR REQUESTS
app.route('/donors').get((req, res) =>
{
	getQueries.getData(0, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all donors');
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addDonor(req.body, (data) =>
	{
		console.log('Added new donor');
		res.status(200).send(data);
	});
});


//HANDLE SPECIFIC DONOR REQUESTS
app.route('/donors/:id').get((req, res) =>
{
	var donor_id = req.params.id;
	getQueries.getIndividualDonor(donor_id, (data) =>
	{
		console.log('Retrieved donor with id: ' + donor_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var donor_id = req.params.id;
	putQueries.updateIndividualDonor(donor_id, req.body, (data) =>
	{
		console.log('Updated donor with id: ' + donor_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var donor_id = req.params.id;
	deleteQueries.deleteIndividualSupporter(donor_id, (data) =>
	{
		console.log('Deleted donor with id: ' + donor_id);
		res.send(data);
	});
});


//HANDLE GENERAL STAFF REQUESTS
app.route('/staff').get((req, res) =>
{
	getQueries.getData(1, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all staff');
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addStaff(req.body, (data) =>
	{
		console.log('Added new staff');
		res.status(200).send(data);
	});
});


//HANDLE SPECIFIC STAFF REQUESTS
app.route('/staff/:id').get((req, res) =>
{
	var staff_id = req.params.id;
	getQueries.getIndividualStaff(staff_id, (data) =>
	{
		console.log('Retrieved staff with id: ' + staff_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var staff_id = req.params.id;
	putQueries.updateIndividualStaff(staff_id, req.body, (data) =>
	{
		console.log('Updated staff with id: ' + staff_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var staff_id = req.params.id;
	deleteQueries.deleteIndividualSupporter(staff_id, (data) =>
	{
		console.log('Deleted staff with id: ' + staff_id);
		res.send(data);
	});
});


//HANDLE GENERAL PATIENT REQUESTS
app.route('/patients').get((req, res) =>
{
	getQueries.getData(2, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all patients');
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).post(jsonParser, (req, res) => {
	postQueries.addPatient(req.body, (data) =>
	{
		console.log('Added new patient');
		res.status(200).send(data);
	});
});


//HANDLE SPECIFIC PATIENT REQUESTS
app.route('/patients/:id').get((req, res) =>
{
	var patient_id = req.params.id;
	getQueries.getIndividualPatient(patient_id, (data) =>
	{
		console.log('Retrieved patient with id: ' + patient_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var patient_id = req.params.id;
	putQueries.updateIndividualPatient(patient_id, req.body, (data) =>
	{
		console.log('Updated patient with id: ' + patient_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var patient_id = req.params.id;
	deleteQueries.deleteIndividualPatient(patient_id, (data) =>
	{
		console.log('Deleted patient with id: ' + patient_id);
		res.send(data);
	});
});


//HANDLE GENERAL PLEDGE REQUESTS
app.route('/pledges').get((req, res) =>
{
	putQueries.checkPledgeDate((info) =>
	{
		console.log('Checked pledge due dates, updated accordingly');
	}).then((rows) =>
	{
		getQueries.getData(3, (err, data) =>
	    {
			if (err)
	    		throw err;
			console.log('Retrieved all pledges');
			res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	   	});
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addPledge(req.body, (data) =>
	{
		console.log('Added new pledge');
		res.status(200).send(data);
	});
});


//HANDLE SPECIFIC PLEDGE REQUESTS
app.route('/pledges/:id').get((req, res) =>
{
	var pledge_id = req.params.id;
	getQueries.getIndividualPledge(pledge_id, (data) =>
	{
		console.log('Retrieved pledge with id: ' + pledge_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var pledge_id = req.params.id;
	putQueries.updateIndividualPledge(pledge_id, req.body, (data) =>
	{
		console.log('Updated pledge with id: ' + pledge_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var pledge_id = req.params.id;
	deleteQueries.deleteIndividualPledge(pledge_id, (data) =>
	{
		console.log('Deleted pledge with id: ' + pledge_id);
		res.send(data);
	});
});

//HANDLE GENERAL CAMPAIGN TYPE REQUESTS
app.route('/campaigntype').get((req, res) =>
{
	getQueries.getData(34, (err, data) =>
	{
		if (err)
			throw err;
		console.log("Retrieved all campaign types");
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addCampaignType(req.body, (data) =>
	{
		console.log("Added new campaign type");
		res.status(200).send(data);
	});
})


//HANDLE SPECIFIC CAMPAIGN TYPE REQUESTS
app.route('/campaigntype/:id').put(jsonParser, (req, res) =>
{
	var campaign_type_id = req.params.id;
	putQueries.updateIndividualCampaignType(campaign_type_id, req.body, (data) =>
	{
		console.log("Updated campaign type with id: " + campaign_type_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var campaign_type_id = req.params.id;
	deleteQueries.deleteIndividualCampaignType(campaign_type_id, (data) =>
	{
		console.log('Deleted campaign type with id: ' + campaign_type_id);
		res.send(data);
	});
});


//HANDLE GENERAL CAMPAIGN REQUESTS
app.route('/campaigns').get((req, res) =>
{
	getQueries.getData(33, (err, data) =>
	{
		if (err)
			throw err;
		console.log("Retrieved all campaigns");
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addCampaign(req.body, (data) =>
	{
		console.log('Added new campaign');
		res.status(200).send(data);
	});
});


//HANDLE SPECIFIC CAMPAIGN REQUESTS
app.route('/campaigns/:id').get((req, res) =>
{
	var campaign_id = req.params.id;
	getQueries.getIndividualCampaign(campaign_id, (data) =>
	{
		console.log('Retrieved campaign with id: ' + campaign_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var campaign_id = req.params.id;
	putQueries.updateIndividualCampaign(campaign_id, req.body, (data) =>
	{
		console.log('Updated campaign with id: ' + campaign_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var campaign_id = req.params.id;
	deleteQueries.deleteIndividualEvent(campaign_id, (data) =>
	{
		console.log('Deleted campaign with id: ' + campaign_id);
		res.send(data);
	});
});


//HANDLE GENERAL EVENT REQUESTS
app.route('/events').get((req, res) =>
{
	getQueries.getData(4, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all events');
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});


//HANDLE SPECIFIC EVENT REQUESTS
app.route('/events/:id').get((req, res) =>
{
	var event_id = req.params.id;
	getQueries.getIndividualEvent(event_id, (data) =>
	{
		console.log('Retrieved event with id: ' + event_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});


//HANDLE GENERAL CONTRIBUTION REQUESTS
app.route('/contributions').get((req, res) =>
{
	getQueries.getData(5, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all contributions');
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addContribution(req.body, (data) =>
	{
		console.log('Added new contribution');
		res.status(200).send(data);
	});
});


//HANDLE SPECIFIC CONTRIBUTION REQUESTS
app.route('/contributions/:id').get((req, res) =>
{
	var contrib_id = req.params.id;
	getQueries.getIndividualContribution(contrib_id, (data) =>
	{
		console.log('Retrieved event item with id: ' + contrib_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var contribution_id = req.params.id;
	putQueries.updateIndividualContribution(contribution_id, req.body, (data) =>
	{
		console.log('Updated contribution with id: ' + contribution_id);
		res.status(200).send(data);
	});
}).delete((req, res) =>
{
	var contrib_id = req.params.id;
	deleteQueries.deleteIndividualContribution(contrib_id, (data) =>
	{
		console.log('Deleted contribution with id: ' + contrib_id);
		res.send(data);
	});
});


//HANDLE GENERAL EVENT ITEM REQUESTS
app.route('/eventitems').get((req, res) =>
{
	getQueries.getData(6, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all event items');
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});


//HANDLE SPECIFIC EVENT ITEM REQUESTS
app.route('/eventitems/:id').get((req, res) =>
{
	var event_item_id = req.params.id;
	getQueries.getIndividualEventItem(event_item_id, (data) =>
	{
		console.log('Retrieved event item with id: ' + event_item_id);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});


//SET UP EXPRESS CONNECTION
var server = app.listen(8081, function()
{
	var host = server.address().address;
	var port = server.address().port;
	console.log("Express app listening at http://%s:%s", host, port);
});
