var User = require('./userModel');
var cookieController = require('./../util/cookieController');
var sessionController = require('./../session/sessionController');

var userController = {};
// var bcrypt = require('bcryptjs');

/**
* getAllUsers
*
* @param next - Callback Function w signature (err, users)
*/
userController.getAllUsers = function(next) {
  User.find({}, next);
};

/**
* createUser - create a new User model and then save the user to the database.
*
* @param req - http.IncomingRequest
* @param rs - http.ServerResponse
*/
userController.createUser = function(req, res) {
  // write code here
  if (req.body.username && req.body.password){
	  var newguy = new User();
    newguy.username = req.body.username;
    newguy.password = req.body.password;
    // console.log(newguy);
    newguy.save(function(err){
      if (err) throw err;
    })

    cookieController.setSSIDCookie(req, res, newguy._id.toString());
    
    res.redirect('/timeline');
	}
  else{
    res.status(500).render();
  }

};

/**
* verifyUser - Obtain username and password from the request body, locate
* the appropriate user in the database, and then authenticate the submitted password
* against the password stored in the database.
*
* @param req - http.IncomingRequest
* @param rs - http.ServerResponse
*/
userController.verifyUser = function(req, res) {
  var loggingIn = User.findOne({username: req.body.username}, function(err, user){
    if (err) throw err;
      // console.log(user);
    
    if (user) {
      if(bcrypt.compareSync(req.body.password, user.password)){
        console.log("you're right!");
        cookieController.setSSIDCookie(req, res, req.cookies.token);
        res.redirect('/timeline');
      }      
      else{
        res.redirect('/signup');
      }
    } else{
      res.redirect('/signup');
    } 
})
   
  
};

module.exports = userController;
