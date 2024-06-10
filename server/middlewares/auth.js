const jwt =require("jsonwebtoken")
require("dotenv").config()

exports.auth = async(req,res,next)=>{
   try{
    const token =
    req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

    if(!token){
        return res.status(401).json({
            success:false,
            message:"token is missing"
        })
    }
    try{
        const decode =jwt.verify(token,process.env.JWT_SECRET)
        console.log(decode);
        req.user =decode;
        
    }
    catch(err){
        console.error(err)
        return res.status(401).json({
            success:false,
            message:"invalid token"
        })
    }
    next()
   }
   catch(err){
    console.error(err)
    return res.status(500).json({
        success:false,
        message:"something went wrong while validating the token"
    })
   }
}
exports.isStudent =async(req,res,next)=>{
    try{
        if(req.user.accountType!="Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for student only"
            })
        }
        next()
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified ,Please try again later"
        })
    }
}
exports.isInstructor =async(req,res,next)=>{
    try{
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for instructor only"
            })
        }
        next()
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified ,Please try again later"
        })
    }
}
exports.isAdmin =async(req,res,next)=>{
    try{
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for admin only"
            })
        }
        next()
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified ,Please try again later"
        })
    }
}