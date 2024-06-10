const User =require("../models/User");
const Profile =require("../models/Profile")
const Otp =require("../models/Otp");
const otpGenerator =require("otp-generator")
const bcrypt =require("bcrypt")
const jwt =require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} =require("../mail/templates/passwordUpdate")
require("dotenv").config()

 exports.sendOtp =async(req,res)=>{
 try{
    const {email}=req.body;
    const ExistingUser = await User.findOne({email})
    if(ExistingUser){
        return res.status(401).json({
            success:false,
            message:"user already registered"
        })
    }
    let  otp =otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    console.log(otp);
    let  result = await Otp.findOne({otp:otp});
    while(result){
        otp  =otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        result=await Otp.findOne({otp:otp});
    }
    const otppayload ={email,otp}
    const otpbody = await Otp.create(otppayload)
    console.log(otpbody)
    return res.status(200).json({
        success:true,
        message:"otp send succcessfully",
        otp,
    })
 }
 catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:"cannot send otp"

    })
 }
    
}
exports.signUp= async(req,res)=>{
    try{
        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;
        if(!firstName|| !lastName || !email|| !password||!confirmPassword ||!otp){
            return res.status(403).json({
                success:false,
                message:"all field are mandatory"
            })
        }
        if(password != confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password is not matching"
            })
        }
        const existinguser =await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                success:false,
                message:"user is already registered"
            })
        }
        const recentOtp =await Otp.find({email:email}).sort({createdAt:-1}).limit(1)
        console.log(recentOtp)
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"otp not found"
            })
        }else if(recentOtp[0].otp !=otp){
            return res.status(400).json({
                success:false,
                message:"otp not matching"
            })
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const profile = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber,
        })
        console.log(profile);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedpassword,
            accountType,
            additionalDetails:profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        return res.status(200).json({
            success:true,
            message:"user registered successfully",
            user,
        })
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"cannot register user"
        })
    }
}
exports.login =async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email|| !password ){
            return res.status(401).json({
                success:false,
                message:"all fields are mandatory"
            })
        }
        const user = await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(403).json({
                success:false,
                message:"user not registered,please signup first"
            })
        }
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token =jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user.token =token;
            user.password=undefined
            const options ={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"user logged in successfully",
                user,
                token,
            })
        }
        else {
            return res.status(401).json({
                success:false,
                message:"password is incorrect",
            })
        }

    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"cannot login user,try again later"
        })
    }
}
exports.changePassword =async(req,res)=>{
   try{
    const userDetails =await User.findById(req.user.id);
    if(!userDetails){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    const {oldPassword,newPassword}=req.body;
    const ispasswordmatch = await bcrypt.compare(oldPassword,userDetails.password);
    if(!ispasswordmatch){
        return res.status(401).json({
            success:false,
            message:"oldpassword is not matching"
        })
    }
   
    const hashedpassword = await bcrypt.hash(newPassword,10);
    const updateduserDetails =await User.findByIdAndUpdate({_id:req.user.id},
        {password:hashedpassword},{new:true})
        try{
            const mailresponse =await mailSender(
                updateduserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(updateduserDetails.email,
                    `password changed successfully of ${updateduserDetails.firstName} ${updateduserDetails.lastName}`)
            )
           console.log("email send successfully",mailresponse)
        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                success:false,
                message:"cannot send email "
            })
        }
        return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
   }
   catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:"cannot change password"
    })
   }



}

