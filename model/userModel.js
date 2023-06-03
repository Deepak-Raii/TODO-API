const mongoose = require("mongoose");
require("../config/config");

const user_model = mongoose.Schema({
    username:{
        type:String,
    },

    password:{
        type:String,
    },

    age:{
        type:Number,
    },

    token:{
        type:String,
    },

    taskname:{
        type:String
    },

    newtaskname:{
        type:String
    },

    taskinformation:
    {
        type:String
    },

    description:
    {
        type:String
    },

    mail:{
        type:String
    },

    status:{
        type:String
    }
});

module.exports = mongoose.model("MyTodo",user_model);