var Task = require('./taskModel');

var taskController = {};

taskController.getAllUsers = function(next) {
  Task.find({}, next);
};

taskController.createTask = function(req, res, body) {

  var newtask = new Task();
  console.log
  newTask.title = req.body.title;
  newTask.audioClip = req.body.audioClip;
  newTask.save(function(err){
    if (err) throw err;
  });
  res.redirect('/timeline');

};


module.exports = taskController;
