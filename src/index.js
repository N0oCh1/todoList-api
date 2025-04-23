const express = require('express');
const mongoose = require('mongoose');
const userTasks = require('./models/userTasks');
const userSession = require('./models/users');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
app.use(cors());
mongoose.connect(process.env.MONGO_URL);
app.use(express.json());

// obtener todos lo usuarios registrado
app.get("/tasks", async (req, res) => {
  try {
    const users = await userTasks.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
//obtener un usuario concreto
app.get('/user/:code', async (req, res) =>{
  try{
    const users = await userSession.find()
    const user = users.filter(item=>item.id === req.params.code)
    if(!user){
     return  res.status(404).json({message:"user not found"})
    }
    res.status(201).json(user[0])
  } catch(err){
    res.status(500).json({message: err.message})
  }
})
// agregar nueva tarea para la session del usuario
app.post('/tasks/:code/new-task', async (req, res)=>{
  try{
    const  taskId  = req.params.code
    const body = req.body
    const newTask = await userTasks.findOneAndUpdate(
      {sesionID: taskId},
      {$push: {tasks: body}},
      {new: true}
    )
    if(!newTask){
      return  res.status(404).json({message:"the user not exist"})
    }
    res.status(201).json(newTask)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})
// eliminar una tarea especifica
app.delete('/tasks/:code/:taskID', async(req, res) => {
  try{
    const sessionID = req.params.code
    const taskID = req.params.taskID
    const deleteTask = await userTasks.findOneAndUpdate(
      {sesionID: sessionID},
      {$pull:{tasks:{_id:taskID}}},
      {new:true}
    )
    if(!deleteTask){
      return res.status(404).json(
        {message: "task not found"}
      )
    }
    res.status(201).json(deleteTask)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})
// actualisar tarea especifica
app.put('/tasks/:code/:taskID', async(req, res) => {
  try{
    const sessionID = req.params.code
    const taskID = req.params.taskID
    const body = req.body
    const deleteTask = await userTasks.findOneAndUpdate(
      {sesionID: sessionID},
      {$pull:{tasks:{_id:taskID}}},
      {new:true}
    )
    if(!deleteTask){
      return res.status(404).json(
        {message: "task not found"}
      )
    }
    res.status(201).json(deleteTask)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

// login 
app.post('/login', async (req, res) =>{

  try {
    const newUser = new userSession({
      user: req.body.user,
      id: req.body.id 
    });
    const savedUser = await newUser.save();
    const newTask = new userTasks({
      sesionID: newUser.id,
      tasks: []
    })
    await newTask.save()
    res.status(201).json(savedUser);
  }
  catch(err){
    res.status(500).json({message: err.message});
  }
})

app.get("/users", async (req, res) => {
  try{
    const user = await userSession.find();
    if (!user) return res.status(404).send('User not found');
    res.status(200).json(user);
  }catch(err){
    res.status(500).json({message: err.message});
  } 
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});