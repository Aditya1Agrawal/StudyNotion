const mongoose =require("mongoose");
require("dotenv").config()
exports.connect=()=>{
    mongoose.connect(
        process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        }
    ).then(()=>(console.log("DB connection successfull")))
    .catch((err)=>{
        console.log("Issue in DB connection")
        console.error(err);
        process.exit(1)
    })
}