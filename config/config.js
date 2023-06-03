const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/TODO-APP").then((result,err)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("Database Connected...");
    }
}
)