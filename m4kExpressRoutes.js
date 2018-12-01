'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//const queries = require('./m4kQueryScripts.js');
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


//HANDLE DONOR REQUESTS
app.route('/donors').get((req, res) =>
{
	getQueries.getData(0, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all donors');
		res.json(data);
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addDonor(req.body, (data) =>
	{
		console.log('Added new donor');
		res.send(data);
	});
});

app.route('/donors/:id').get((req, res) =>
{
	var donor_id = req.params.id;
	getQueries.getIndividualDonor(donor_id, (data) =>
	{
		console.log('Retrieved donor with id: ' + donor_id);
		//Send prettified JSON response for debugging
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var donor_id = req.params.id;
	putQueries.updateIndividualDonor(donor_id, req.body, (data) =>
	{
		console.log('Updated donor with id: ' + donor_id);
		res.send(data);
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


//HANDLE STAFF REQUESTS
app.route('/staff').get((req, res) =>
{
	getQueries.getData(1, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all staff');
		res.send(data);
	});
}).post(jsonParser, (req, res) =>
{
	postQueries.addStaff(req.body, (data) =>
	{
		console.log('Added new staff');
		res.send(data);
	});
});

app.route('/staff/:id').get((req, res) =>
{
	var staff_id = req.params.id;
	getQueries.getIndividualStaff(staff_id, (data) =>
	{
		console.log('Retrieved staff with id: ' + staff_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put(jsonParser, (req, res) =>
{
	var staff_id = req.params.id;
	putQueries.updateIndividualStaff(staff_id, req.body, (data) =>
	{
		console.log('Updated staff with id: ' + staff_id);
		res.send(data);
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


//HANDLE PATIENT REQUESTS
app.get('/patients', (req, res) =>
{
	getQueries.getData(2, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all patients');
		res.send(data);
	});
});

app.route('/patients/:id').get((req, res) =>
{
	var patient_id = req.params.id;
	getQueries.getIndividualPatient(patient_id, (data) =>
	{
		console.log('Retrieved patient with id: ' + patient_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put((req, res) =>
{
	//put shenanigans
}).delete((req, res) =>
{
	var patient_id = req.params.id;
	deleteQueries.deleteIndividualPatient(patient_id, (data) =>
	{
		console.log('Deleted patient with id: ' + patient_id);
		res.send(data);
	});
});


//HANDLE PLEDGE REQUESTS
app.get('/pledges', (req, res) =>
{
	getQueries.getData(3, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all pledges');
		res.send(data);
	});
});

app.route('/pledges/:id').get((req, res) =>
{
	var pledge_id = req.params.id;
	getQueries.getIndividualPledge(pledge_id, (data) =>
	{
		console.log('Retrieved pledge with id: ' + pledge_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put((req, res) =>
{
	//put shenanigans
}).delete((req, res) =>
{
	var pledge_id = req.params.id;
	deleteQueries.deleteIndividualPledge(pledge_id, (data) =>
	{
		console.log('Deleted pledge with id: ' + pledge_id);
		res.send(data);
	});
});


//HANDLE EVENT REQUESTS
app.get('/events', (req, res) =>
{
	getQueries.getData(4, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all events');
		res.send(data);
	});
});

app.route('/events/:id').get((req, res) =>
{
	var event_id = req.params.id;
	getQueries.getIndividualEvent(event_id, (data) =>
	{
		console.log('Retrieved event with id: ' + event_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put((req, res) =>
{
	//put shenanigans
}).delete((req, res) =>
{
	var event_id = req.params.id;
	deleteQueries.deleteIndividualEvent(event_id, (data) =>
	{
		console.log('Deleted event with id: ' + event_id);
		res.send(data);
	});
});


//HANDLE CONTRIBUTION REQUESTS
app.get('/contributions', (req, res) =>
{
	getQueries.getData(5, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all contributions');
		res.send(data);
	});
});

app.route('/contributions/:id').get((req, res) =>
{
	var contrib_id = req.params.id;
	getQueries.getIndividualContribution(contrib_id, (data) =>
	{
		console.log('Retrieved event item with id: ' + contrib_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put((req, res) =>
{
	//put shenanigans
}).delete((req, res) =>
{
	var contrib_id = req.params.id;
	deleteQueries.deleteIndividualContribution(contrib_id, (data) =>
	{
		console.log('Deleted contribution with id: ' + contrib_id);
		res.send(data);
	});
});


//HANDLE EVENT ITEM REQUESTS
app.get('/eventitems', (req, res) =>
{
	getQueries.getData(6, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all eventitems');
		res.send(data);
	});
});

app.route('/eventitems/:id').get((req, res) =>
{
	var event_item_id = req.params.id;
	getQueries.getIndividualEventItem(event_item_id, (data) =>
	{
		console.log('Retrieved event item with id: ' + event_item_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
}).put((req, res) =>
{
	//put shenanigans
}).delete((req, res) =>
{
	var event_item_id = req.params.id;
	deleteQueries.deleteIndividualContribution(event_item_id, (data) =>
	{
		console.log('Deleted contribution with id: ' + event_item_id);
		res.send(data);
	});
});


//SET UP EXPRESS CONNECTION
var server = app.listen(8081, function()
{
	var host = server.address().address;
	var port = server.address().port;
	console.log("Express app listening at http://%s:%s", host, port);
});