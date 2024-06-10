const User =require("../models/User")
const crypto =require("crypto");
const bcrypt=require("bcrypt")
const mailSender = require("../utils/mailSender");
exports.ResetPasswordToken =async(req,res)=>{
 try{
    const {email}=req.body;
    const user =await User.findOne({email})
    if(!user){
        return res.status(403).json({
            success:false,
            message:"user is not registered"
        })
    }
    const token = crypto.randomUUID();
    const updateduser = await User.findOneAndUpdate(
        {email:email},
        {token:token,
        
            resetTokenExpires: Date.now()+5*60*1000
        },
        {new :true}
    )
    const url =`http://localhost:3000/update-password/${token}`
    await mailSender(email,"Password reset Link",`password reset link ${url}`);
    return res.status(200).json({
        success:true,
        message:"reset mail sent successfully",
        token,
    })
 }
 catch(err){
    console.error(err)
    return res.status(500).json({
        success:false,
        message:"cannot sent password reset mail"
    })
 }
}
exports.ResetPassword =async(req,res)=>{
  try{
    const {password,confirmPassword,token}=req.body;
    if(password !=confirmPassword){
        return res.status(403).json({
            success:false,
            message:"password and confirm password do not match"
        })
    }
    const user =await User.findOne({token:token})
    if(!user){
        return res.status(400).json({
            success:false,
            message:"Invalid token"
        })
    }
    if( user.resetTokenExpires < Date.now()  ) {
        return res.json({
            success:false,
            message:'Token is expired, please regenerate your token',
        });
}
    const hashedpassword =await bcrypt.hash(password,10)
    const updateduser =await User.findOneAndUpdate({token:token}
        ,{password:hashedpassword},{new:true})
        console.log(updateduser)
        return res.status(200).json({
            success:true,
            message:"password reset successfully",
            updateduser
        })
  }catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:"cannot reset the password ,please try again later"
    })
  }
}