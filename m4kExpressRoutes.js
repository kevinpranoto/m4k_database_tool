'use strict';

const express = require('express');
const app = express();
const queries = require('./m4kQueryScripts.js');

app.get('/', (req, res) =>
{
	console.log('Connected to DB');
	res.send('Express/Node Demo');
});

app.get('/donors', (req, res) =>
{
	queries.getData(0, (err, data) =>
	{
		if (err)
			throw err;
		console.log('Retrieved all donors');
		res.send(data);
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