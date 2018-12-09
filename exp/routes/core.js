//Middle Layer
//Christian Simons

var express = require('express');
var db = require('../database');
var app = express();
module.exports = app;


app.get('/search', function (request, response)
{
    response.render('core/search', {
        title: 'Search Course Classifieds'
    })
});

app.get('/core', function (request, response) {
  response.render('index', {title: 'Study Buddy Finder'})
});

app.get('/post', function (request, response)
{
    response.render('core/post', {
        title: 'Post a Course Classified'
    })
});

//Search Function, returns results
app.post('/results', function (request,response)
{
	request.assert('school', 'school is required').notEmpty();	//Input validation
  request.assert('class', 'class is required').notEmpty();
  //request.assert('course', 'course is required').notEmpty();
  var errors = request.validationErrors();
  if (!errors) 
  {
      var item = 
      {
          school: request.sanitize('school').escape().trim(),
          class: request.sanitize('class').escape().trim()
      };
    db.any('SELECT username, school, class, availability FROM userinfo WHERE school = $1 AND class = $2',[item.school,item.class])
   		.then(function (rows)
   		{
       		response.render('core/results', {
        	title: 'Search Results',
        	data: rows
        	})
    	})
          .catch(function (err) {
          request.flash('error', err);
          response.render('core/results', {
              title: 'Search Results',
              data: ''
          })
      })
    }
});

app.post('/add', function (request, response) {
    //Input Validation
    request.assert('username', 'Username is required').notEmpty();
    request.assert('school', 'School is required').notEmpty();
    request.assert('class', 'Class is required').notEmpty();
    request.assert('availability', 'Availability is required').notEmpty();
    var errors = request.validationErrors();
    if (!errors)
    {
        var item = {
            username: request.sanitize('username').escape().trim(),
            school: request.sanitize('school').escape().trim(),
            class: request.sanitize('class').escape().trim(),
            availability: request.sanitize('availability').escape().trim()
        };
        //Data insertion
        db.none('INSERT INTO userinfo (username, school, class, availability) VALUES ($1, $2, $3, $4)', [item.username, item.school, item.class, item.availability])
            .then(function (result) {
                request.flash('success', 'Data added successfully!');
                response.render('core/post', {
                    title: 'Post a Study Buddy Classified',
                    username: '',
                    school: '',
                    class: '',
                    availability: ''
                })
            }).catch(function (err) {
            request.flash('error', err);
            response.render('core/post', {
                title: 'Post a Study Buddy Classified',
                username: item.username,
                school: item.school,
                class: item.class,
                availability: item.availability
            })
        })
    } else {
        var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
        request.flash('error', error_msg);
        response.render('core/post', {
            title: 'Post a Study Buddy Classified',
            username: request.body.username,
            school: request.body.school,
            class: request.body.class,
            availability: request.body.availability
        })
    }
});
