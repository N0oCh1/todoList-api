const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.get('/users/:ip', async(req, res) => {
  try{
      const user = await Usuario.findOne({ ip: req.params.ip });
      if (!user) return res.status(404).send('User not found');
      res.status(200).json(user);
    }catch(err){
      res.status(500).json({message: err.message});
    }
  }
);
app.post('/users/:ip', async(req, res) => {

  try {
    const user = await Usuario.findOne({ ip: req.params.ip });
    if(user){
      return res.status(400).send('User already exists');
    }
    const newUser = new Usuario(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.post('/users/:ip/tasks', async(req, res) => {
  try {
    const user = await Usuario.findOne({ ip: req.params.ip });
    if (!user) return res.status(404).send('User not found');

    const newTask = {
      homework: req.body.homework || '',
      complete: req.body.complete || false
    };
    user.tasks.push(newTask);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
/**
 * body=>
 * id: task id
 * homework: task name
 * complete: task status
 */
app.put("/Users/:ip/tasks", async (req, res) => {
  const user = await Usuario.findOne({ ip: req.params.ip });
  if (!user) return res.status(404).send('User not found');
  
  user.tasks.map((taks)=> {
    if(taks.id === req.body.id){
      taks.homework = req.body.homework;
      taks.complete = req.body.complete;  
    }
  });
  await user.save();
  res.status(200).json(user); 
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
