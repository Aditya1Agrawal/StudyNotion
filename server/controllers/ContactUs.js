const { contactUsEmail } = require("../mail/templates/contactFormres")
const mailSender = require("../utils/mailSender")

exports.contactUsController =async(req,res)=>{
    const {email,firstname,lastname,message,phoneNo,countrycode}=req.body
    try{
        const emailres =await mailSender(
            email,
            "your message has been send successfully",
            contactUsEmail(email,firstname,lastname,message,phoneNo,countrycode)
        )
        console.log("email res",emailres)
        res.status(200).json({
            success:true,
            message:"email send successfully"
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}