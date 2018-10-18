//Script for opening connection to postgres db
var pg = require('pg');
var connString = NULL; //DB not yet setup

if (connString != NULL)
{
	var client = new pg.Client(connString);
	client.connect();

	query.on('row', function(row) { console.log(row); });
	query.on('end', function() { client.end(); });
}
else
{
	console.log("connString is NULL");
}
