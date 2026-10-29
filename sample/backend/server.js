const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sec = process.env.JWT;
app.use(cors());
const PORT = 3000;

// Middleware
app.use(express.json());

function authMiddleware(req,res,next){
  const authH = req.headers.authorization;
  console.log("backend "+authH);
  if(!authH){
    return res.status(401).json({msg:"Token Missing"})
  }
  let token = authH;
  try{
    const decode = jwt.verify(token,sec);
    req.user = decode;
    next();
  }
  catch(error){
    return res.status(401).json({msg:"Invalid Token"})
  }
}
let todos = [
  {
    id: 1,
    title: "Learn REST API",
    completed: false
  },
  {
    id: 2,
    title: "Practice Express",
    completed: true
  }
];
let users = [{
  // sample data
    "id" : 1,
    "name": "naveen",
    "pass": "1234"
}];
// Home route
app.get("/", authMiddleware, (req, res) => {
  res.json(todos);
});
app.post("/",authMiddleware,(req,res) => {
  let todo = {
    id : todos.length+1,
    title : req.body.title,
    completed : false
  }
  todos.push(todo)
  res.json({msg : "Successful"});
})


app.get("/users", authMiddleware, (req, res) => {
  res.json(users);
});

app.post("/users/reg",async (req,res)=>{    // Reg API
  const us = req.body.name
  const pass = req.body.pass
  const usr = {
    id : users.length+1,
    name : us,
    pass : await bcrypt.hash(pass,7)
  }
  users.push(usr)
  res.json(usr)
})


app.post("/users/login",async (req,res)=>{
  const us = req.body.name
  const pass = req.body.pass
  const user = users.find(u=>us==u.name);
  if(user){
    if(await bcrypt.compare(pass,user.pass)){
      let token = jwt.sign(
        {
          id:user.id,
          name:user.name
        },
        sec,
        {
          expiresIn :"1h"
        }
      )
      res.json({
        msg:"Login Success",
        token:token
      })
    }
    else{
      res.json({msg:"Invalid Cridentials"})
    }
  }
  else{
    //reject 
    res.json({msg:"Login failed"})
  }
})


app.get("/users/profile", authMiddleware, (req, res) => {
    res.json({
        msg: "Welcome to your profile"+req.user.name,
        user: req.user
    });
});

app.get("/:id",authMiddleware,(req,res) => {
    let i = parseInt(req.params.id);
    let x = todos.find(t => t.id===i);
    res.json(x);
})
app.put("/:id",authMiddleware,(req,res) => {
    let i = parseInt(req.params.id);
    let todo = todos.find(t => t.id==i);
    todo.completed = req.body.completed;
    res.json(todo);
})
app.delete("/:id",authMiddleware,(req,res) =>{
    let id = parseInt(req.params.id);
    todos = todos.filter(t => t.id!==id);
    res.json(
      {
        msg:"deleted"
      }
    );
})



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
