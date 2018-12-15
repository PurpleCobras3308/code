//Middle Layer
//Christian Simons

var express = require('express');
var db = require('../database');
var app = express();
module.exports = app;

/*app.get('/login', function (request, response)
{
    response.render('core/login', {
        title: 'Search Course Classifieds'
    })
});*/

app.get('/', function (request,response)
{
    request.assert('password', 'password is required').notEmpty();
    request.assert('username', 'username is required').notEmpty();

    var errors = request.validationErrors();

    if(!errors)
    {
        console.log("No Errors");
        var username = request.query.username;
        var pw1 = request.query.password;
        //var username = "trash@man.com"
        //var pw1 = "charlie"
        db.one('SELECT password FROM logininfo WHERE username = $1',[username])
        .then(function (row)
          {
            if (row.password == pw1)
            {
            db.any("SELECT * FROM userinfo")
          .then(function (rows) 
          {
              response.render('core/results', 
              {
              title: 'Study Buddies',
              data: rows
              })
          })
          .catch(function (err)
          {
              request.flash('error', err);
              response.render('core/results', 
              {
                title: 'Study Buddies',
                data: ''
              })
          })

          }
          })
          /*console.log("Passwords Match");
          db.any("SELECT * FROM userinfo")
          .then(function (rows) 
          {
              response.render('core/results', 
              {
              title: 'Study Buddies',
              data: rows
              })
          })
          .catch(function (err)
          {
              request.flash('error', err);
              response.render('core/results', 
              {
                title: 'Study Buddies',
                data: ''
              })
          })*/
    }
    else 
    {
        var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
        request.flash('error', error_msg);
        response.render('/', {
            title: 'Study Buddy Finder'
        })
    }
    
});

app.get('/search', function (request, response)
{
    response.render('core/search', {
        title: 'Search Course Classifieds'
    })
});

app.get('/newuser', function (request, response)
{
    response.render('core/newuser', {
        title: 'Create an Account'
    })
});

app.get('/core', function (request, response) {
  response.render('/', {title: 'Study Buddy Finder'})
});

app.get('/post', function (request, response)
{
    response.render('core/post', {
        title: 'Post a Course Classified'
    })
});

//Search Function, returns results
app.post('/search', function (request,response)
{
	request.assert('school', 'school is required').notEmpty();	//Input validation
  request.assert('class1', 'class is required').notEmpty();
  //request.assert('course', 'course is required').notEmpty();
  var errors = request.validationErrors();
  if (!errors) 
  {
      var item = 
      {
          school: request.sanitize('school').escape().trim(),
          class1: request.sanitize('class1').escape().trim()
      };
      //var sc = request.query.school;
      //var cl = request.query.class1;
    db.any('SELECT * FROM userinfo WHERE school = $1 AND class = $2',[item.school,item.class1])
   		.then(function (rows)
   		{
          console.log(".then rows")
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

app.post('/post', function (request, response) {
    //Input Validation
    request.assert('username', 'Username is required').notEmpty();
    request.assert('school', 'School is required').notEmpty();
    request.assert('class1', 'Class is required').notEmpty();
    request.assert('availability', 'Availability is required').notEmpty();
    var errors = request.validationErrors();
    if (!errors)
    {
        var item = {
            username: request.sanitize('username').escape().trim(),
            school: request.sanitize('school').escape().trim(),
            class: request.sanitize('class1').escape().trim(),
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

app.post('/newuser', function (request, response) {
    //Input Validation
    request.assert('username', 'Username is required').notEmpty();
    request.assert('password1', 'Class is required').notEmpty();
    request.assert('password2', 'Availability is required').notEmpty();
    var errors = request.validationErrors();
    pw01 = request.query.password1
    pw02 = request.query.password2
    if (!errors)
    {
        var item = {
            username: request.sanitize('username').escape().trim(),
            password1: request.sanitize('password1').escape().trim(),
            password2: request.sanitize('password2').escape().trim(),
        };
        if (pw01 == pw02)
        {
        //Data insertion
        db.none('INSERT INTO logininfo (username, password) VALUES ($1, $2)', [item.username, item.password1])
            .then(function (result) {
                console.log("newuser success");
                request.flash('success', 'Data added successfully!');
                response.render('core/search', {
                    title: 'Study Buddy App',
                })
            }).catch(function (err) {
            request.flash('error', err);
            response.render('core/newuser', {
                title: 'Create an Account',

            })
        })
        }
    } else {
        var error_msg = errors.reduce((accumulator, current_error) => accumulator + '<br />' + current_error.msg, '');
        request.flash('error', error_msg);
        response.render('core/newuser', {
            title: 'Create an Account',
        })
    }
});
