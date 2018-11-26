'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const queries = require('./m4kQueryScripts.js');

//Deal with CORS issues
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

//Handle requests
app.get('/', (req, res) =>
{
	console.log('Connected to DB');
	res.send('Express/Node Demo');
});

app.route('/donors').get((req, res) =>
{
	queries.getData(0, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all donors');
		res.json(data);
	});
});

app.get('/donors/:id', (req, res) =>
{
	var donor_id = req.params.id;
	queries.getIndividualDonor(donor_id, (data) =>
	{
		console.log('Retrieved donor with id: ' + donor_id);
		//Send prettified JSON response for debugging
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});

app.get('/staff', (req, res) =>
{
	queries.getData(1, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all staff');
		res.send(data);
	});
});

app.get('/staff/:id', (req, res) =>
{
	var staff_id = req.params.id;
	queries.getIndividualStaff(staff_id, (data) =>
	{
		console.log('Retrieved staff with id: ' + staff_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});

app.get('/patients', (req, res) =>
{
	queries.getData(2, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all patients');
		res.send(data);
	});
});

app.get('/patients/:id', (req, res) =>
{
	var patient_id = req.params.id;
	queries.getIndividualPatient(patient_id, (data) =>
	{
		console.log('Retrieved patient with id: ' + patient_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});

app.get('/events', (req, res) =>
{
	queries.getData(5, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all events');
		res.send(data);
	});
});

app.get('/events/:id', (req, res) =>
{
	var event_id = req.params.id;
	queries.getIndividualEvent(event_id, (data) =>
	{
		console.log('Retrieved patient with id: ' + event_id);
		//res.json(data);
		res.set({'Content-Type': 'application/json; charset=utf-8'}).send(JSON.stringify(data, undefined, ' '));
	});
});

app.get('/requests', (req, res) =>
{
	queries.getData(3, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all requests');
		res.send(data);
	});
});

app.get('/pledges', (req, res) =>
{
	queries.getData(4, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all pledges');
		res.send(data);
	});
});


app.get('/eventitems', (req, res) =>
{
	queries.getData(6, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all eventitems');
		res.send(data);
	});
});

app.get('/contributions', (req, res) =>
{
	queries.getData(7, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all contributions');
		res.send(data);
	});
});

var server = app.listen(8081, function()
{
	var host = server.address().address;
	var port = server.address().port;
	console.log("Express app listening at http://%s:%s", host, port);
});