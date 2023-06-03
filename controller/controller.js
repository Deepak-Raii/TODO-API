const express = require("express");
const app = express();
const user_model = require("../model/userModel");
const status = require("../util/status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
app.use(express.json());
const secretkey = "ABCDEFG";

// USER SIGNUP
// http://localhost:3001/signup

const signup = app.post("/signup",async(req,res)=>{
    try{
        const data = await new user_model({
            username:req.body.username,
            password: bcrypt.hashSync(req.body.password,10),
            mail:req.body.mail,
            age:req.body.age
        })
        const wholedata = await user_model.findOne({mail:req.body.mail});
        if(wholedata)
        {
            const password = bcrypt.compare(wholedata.password, data.password);
            if(password)
            {
                res.send("User Already Exist, Please Login For Further Operation...");
            }
        }
        else
        {
            const saveData = await data.save();
            res.send(saveData);
        }
    }
    catch(err)
    {
        res.send(err);
    }
    
});

// USER SIGNIN
// http://localhost:3001/signin

const signin = app.get("/signin",async(req,res)=>{
    try{
        const data = await new user_model({
            mail:req.body.mail,
            password:req.body.password,
        });
        const wholedata = await user_model.findOne({mail:req.body.mail});
        
    if(wholedata)
    {
        const password = await bcrypt.compare(req.body.password,wholedata.password);
        if(password)
        {
            await jwt.sign({data},secretkey,{expiresIn: "24h",},(err,token)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                // console.log(token);
                res.json({token});
            }
        });
        }
        else
        {
            res.send("Wrong Password");
        }
    }
    else
    {
        res.send("Invalid User");
    }
    }
    catch(err)
    {
        res.send(err);
    }
});

// create TODO
//http://localhost:3001/addTODO

const addTODO = app.post("/addTODO",async(req,res)=>{
    const data = await new user_model({
        token:req.body.token,
        taskname:req.body.taskname,
        taskinformation:req.body.taskinformation,
        description:req.body.description,
        status:status.PENDING,
    });
    await jwt.verify(data.token,secretkey,async(err,newToken)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            const result = await data.save();
            res.send(result);
        }
    });
});

// read All TODO with Pagination
// http://localhost:3001/readTODO

const readTODO = app.get("/readTODO",async(req,res)=>{
    const data = await new user_model({
        token:req.body.token,
    });

    await jwt.verify(data.token,secretkey,async(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            const wholedata = await user_model.find({});
            res.send(wholedata);
        }
    });
    
});

// read TODO Task
// http://localhost:3001/readTASK

const readTASK = app.get("/readTASK",async(req,res)=>{
    const data = await new user_model({
        token:req.body.token,
        taskname:req.body.taskname,
    });

    await jwt.verify(data.token,secretkey,async(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            const wholedata = await user_model.findOne({taskname:req.body.taskname});
            if(wholedata)
            {
                const updateStatus = await user_model.findByIdAndUpdate({_id:wholedata._id},{$set:{status:status.COMPLETED}},{new:true});
                // console.log(updateStatus);
                res.send(updateStatus);
            } 
            else
            {
                res.send("Task not Found...");
            } 
        }
    });
    
});

// update TODO and send mail
// http://localhost:3001/updateTODO

const updateTODO = app.put("/updateTODO",async(req,res)=>{
    const data = await new user_model({
        token:req.body.token,
        mail:req.body.mail,
        taskname:req.body.taskname,
        newtaskname:req.body.newtaskname,
        taskinformation:req.body.taskinformation,
        description:req.body.description,
    });
    const verify = await jwt.verify(data.token,secretkey);
    if(verify)
    {
        const wholedata = await user_model.findOne({taskname:req.body.taskname});
    if(wholedata)
    {
        const updatedData = await user_model.findByIdAndUpdate({_id:wholedata._id},{taskname:req.body.newtaskname,taskinformation:req.body.taskinformation,description:req.body.description},{new:true});
        const testAccount = nodemailer.createTestAccount();
        const Transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "deepakraii9696@gmail.com",
                pass: "jgfuxzqelnlmnsyy",
            }
        });
        
  const message = {
    from: "deepakraii9696@gmail.com",
    to: req.body.mail,
    Text: "Update TODO",
    subject:"Update TODO",
    html: `<p><b> You have successfully updated your Todo </b></p><br>Taskname : ${data.taskname}<br>Task Information : ${data.taskinformation}<br> Description : ${data.description}`,
  };

  Transporter.sendMail(message);
  res.send(updatedData);
    }
    else
    {
        res.send("Task Not Found...")
    }
    }
    else
    {
        res.send("Invalid User...");
    }
    

});

// delete TODO
// http://localhost:3001/deleteTODO

const deleteTODO = app.delete("/deleteTODO",async(req,res)=>{
    const data = await new user_model({
        token:req.body.token,
        taskname:req.body.taskname,
    });
    await jwt.verify(data.token,secretkey,async(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            const task = await user_model.findOne({taskname:req.body.taskname});
            if(task)
            {
                await user_model.deleteOne({taskname:req.body.taskname});
                res.send("Task Deleted Successfully...")
            }
            else
            {
                res.send("Task Not Found...");
            }
        }
    });
});

module.exports = {signup,signin,addTODO,readTODO,updateTODO,deleteTODO,readTASK};