const mongoose =require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema=  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:"5m",
    }
})
    async function sendVerificationmail(email,otp){
        try{
            const mailResponse = await mailSender(
                email,
                "Verification Email",
                otpTemplate(otp)
            )
             console.log("mail send succesfully",mailResponse)

        }catch(error){
            console.log("Issue in Sending verification mail")
            console.error(error);
            
        }
    }

otpSchema.pre("save",async function(next){
    await sendVerificationmail(this.email,this.otp);
    next()
})
module.exports =  mongoose.model("Otp",otpSchema)