var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var fs = require('fs');
const mongoose = require('mongoose');
const querystring = require('querystring');
const userController = require('./server/user/userController');
const cookieController = require('./server/util/cookieController');
const sessionController = require('./server/session/sessionController');
const taskController = require('./server/task/taskController');
const request = require('request');
// const audioApp = require('./server/audio/app');

app.use(express.static(path.join(__dirname, './client')));

//mongo connection string 

const mongoURI = process.env.NODE_ENV === 'test' ? 'mongodb://localhost/soloproject' : 'mongodb://localhost/soloproject';
mongoose.connect(mongoURI);

//setting express to use ejs
app.set('view engine', 'ejs');

//parsing the body and adding to the req

app.use(bodyParser.urlencoded({ extended: true }));

//error handling
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

//handling cookies for all requests
app.use(cookieParser(), cookieController.setCookie);

app.get('/', function(req, res) {
  //calling the index ejs file
  res.render('./../client/index');
});

// user model creation
app.get('/signup', function(req, res) {
  res.render('./../client/signup', {error: null});
});

app.post('/signup', userController.createUser);

//login

app.post('/login', userController.verifyUser);

//createTask
app.post('/createTask', taskController.createTask);

//timeline 

app.get('/timeline', sessionController.isLoggedIn, function(req, res) {

  taskController.getAllTasks(function(err, tasks) {
    userController.getAllUsers(function(err, users) {
      if (err) throw err;
      // console.log('-------', users, allUsers, tasks);
      res.render('./../client/timeline', { tasks: tasks, users: users });
    });
  });
});

// github integration

app.get('/oauth', function(req, res) {
  var state = "thisismysoloproject";
  console.log(req.query);
  if(req.query.state.toString() === state ){
    console.log(state);
    var tokenQuery = {
      client_id: 'e6c71ecc9da9473ac924',
      client_secret: '7a5700b88d8410c9fe98bb89d7ca6f540a0c8676',
      code: req.query.code,
      accept: 'application/json'
    }

    var url = 'https://github.com/login/oauth/access_token?' + querystring.stringify(tokenQuery);
    var options = {
      url:url,
      headers:{'user-agent': 'friendly agent'},
      json: true
      }
    request(options, function(err, resp, body){
      if(err) return res.send(500,err);
      //setting token cookie
      res.cookie('token', body.access_token);
      cookieController.setSSIDCookie(req, res, body.access_token);
      var options = {
        url: 'https://api.github.com/user',
        headers: {
          'user-agent': 'friendly agent',
          'Accept': 'application/json',
          'Authorization': 'token ' + body.access_token
        },
        json:true
      }
      // next();
      request(options, function(err,resp, body){
        // console.log('body ', body);
        userController.createUser(req,res, body);
        // res.redirect('/timeline');
      })


    })
  }

  // res.end();
})

app.listen(3000);

module.exports = app;