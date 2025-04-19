const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  homework: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  }
});

const usuarioSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  tasks: [tareaSchema]
});
module.exports = mongoose.model('Usuario', usuarioSchema, "session");