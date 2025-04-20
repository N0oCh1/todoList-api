const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await Usuario.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

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
    const newUser = new Usuario({
      ip: req.params.ip,
      tasks: []
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
app.put("/users/:ip/tasks", async (req, res) => {
  const user = await Usuario.findOne({ ip: req.params.ip });
  if (!user) return res.status(404).send('User not found');
  
  const taskIndex = user.tasks.findIndex((taks) => taks.id === req.body.id);
  if (taskIndex === -1) return res.status(404).send('Task not found');
  user.tasks[taskIndex].homework = req.body.homework;
  user.tasks[taskIndex].complete = req.body.complete;  

  await user.save();
  res.status(200).json(user); 
})

app.delete('/users/:ip/tasks/:id', async (req, res) => {
  const user = await Usuario.findOne({ ip: req.params.ip });
  if (!user) return res.status(404).send('User not found');

  const taskIndex = user.tasks.findIndex((task) => task._id.toString() === req.params.id);
  if (taskIndex === -1) return res.status(404).send('Task not found');

  user.tasks.splice(taskIndex, 1);
  await user.save();
  res.status(200).json(user);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
