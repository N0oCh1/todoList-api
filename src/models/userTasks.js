const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  homework: {
    type: String,
    default: '' 
  },
  complete: {
    type: Boolean,
    default: false
  }
});

const TasksSchema = new mongoose.Schema({
  sesionID: {
    type: String,
    required: false,
  },
  tasks: [tareaSchema]
});
module.exports = mongoose.model("userTasks", TasksSchema);