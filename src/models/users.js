const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);