var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* Hint: Why is bcrypt required here?
*/
var SALT_WORK_FACTOR = 10;
// var bcrypt = require('bcryptjs');

var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  profileimage: {type: String, required: false}
});

userSchema.pre('save', function(next) {
 var salt = bcrypt.genSaltSync(10);
 var hash = bcrypt.hashSync(this.password, salt);
 this.password = hash;
  next();
});


// // Load hash from your password DB. 
// bcrypt.compareSync("B4c0/\/", hash); // true 
// bcrypt.compareSync("not_bacon", hash); // false 

module.exports = mongoose.model('User', userSchema);
