var Task = require('./taskModel');

var taskController = {};

taskController.getAllTasks = function(next) {
  Task.find({}, next);
};

taskController.createTask = function(req, res, body) {
  console.log(req.body.title);
  var newTask = new Task();
  newTask.title = req.body.title;
  newTask.audioClip = req.body.audioClip;
  newTask.author = req.body.author;  
  newTask.save(function(err){
    if (err) throw err;
  });
  res.redirect('/timeline');

};


module.exports = taskController;
