var express = require('express');
var app = express();

app.get('/', function (request, response) 
{
   response.render('index', {title: 'Study Buddy Finder App'})
});

module.exports = app;
