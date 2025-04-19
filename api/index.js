const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Usuario = require('./model/Usuario');
require('dotenv').config();


let isConnected;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};
await connectDB();
app.get('/users', async(req, res) => {
    try{
      const user = await Usuario.find({});
      res.json(user);
    }catch(err){
      res.status(500).json({message: err.message});
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;