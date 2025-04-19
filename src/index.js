const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.get('/users', async(req, res) => {
  try{
      const users = await Usuario.find();
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
