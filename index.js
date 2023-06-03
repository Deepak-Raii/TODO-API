const express = require("express");
const app = express();
const controller = require("./controller/controller");
const PORT = 3001;

app.use("/",controller.signup);
app.use("/",controller.signin);
app.use("/",controller.addTODO);
app.use("/",controller.readTODO);
app.use("/",controller.readTASK);
app.use("/",controller.updateTODO);
app.use("/",controller.deleteTODO);

app.listen(PORT,(err,result)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log(`You are using port ${PORT}`);
    }
    
})