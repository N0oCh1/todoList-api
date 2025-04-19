const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Usuario = require('./models/Usuario');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

app.use(express.json());
app.get('/users', async(req, res) => {
  try{
      await connectDB();
      const users = await Usuario.find({});
      res.status(200).json(users);
    }catch(err){
      res.status(500).json({message: err.message});
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
