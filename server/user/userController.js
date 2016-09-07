var User = require('./userModel');
var cookieController = require('./../util/cookieController');
var sessionController = require('./../session/sessionController');

var userController = {};
// var bcrypt = require('bcryptjs');


userController.getAllUsers = function(next) {
  User.find({}, next);
};

userController.createUser = function(req, res, body) {
  // User.findOne({username: body.login}, function(err, user) {
  //   console.log('user already exists', user);
  //   cookieController.setSSIDCookie(req, res, user._id.toString());
  //   res.redirect('/timeline');
  // });
  var newguy = new User();
  newguy.username = body.login;
  newguy.password = 'github';
  newguy.profileImage = body.avatar_url;
  newguy.save(function(err){
    if (err) throw err;
  });
  cookieController.setSSIDCookie(req, res, newguy._id.toString());
  res.redirect('/timeline');

};

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

// userController.oauthConnect = function(req, res){
//   var state = "thisismysoloproject";
//   console.log(req.query);
//   if(req.query.state.toString() === state ){``
//     console.log(state);
//     var tokenQuery = {
//       client_id: 'e6c71ecc9da9473ac924',
//       client_secret: '7a5700b88d8410c9fe98bb89d7ca6f540a0c8676',
//       code: req.query.code,
//       accept: 'application/json'
//     }

//     var url = 'https://github.com/login/oauth/access_token?' + querystring.stringify(tokenQuery);
//     var options = {
//       url:url,
//       headers:{'user-agent': 'friendly agent'},
//       json: true
//       }
//     request(options, function(err, resp, body){
//       if(err) return res.send(500,err);
//       //setting token cookie
//       res.cookie('token', body.access_token);
//       cookieController.setSSIDCookie(req, res, body.access_token);
//       var options = {
//         url: 'https://api.github.com/user',
//         headers: {
//           'user-agent': 'friendly agent',
//           'Accept': 'application/json',
//           'Authorization': 'token ' + body.access_token
//         },
//         json:true
//       }
//       request(options, function(err,resp, body){
//         console.log('body ', body);
//         res.redirect('/timeline');
//       })

//     }

module.exports = userController;
