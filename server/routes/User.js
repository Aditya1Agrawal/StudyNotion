const express =require("express")
const router =express.Router()
const {login,signUp,sendOtp,changePassword}=require("../controllers/Auth")
const {ResetPasswordToken,ResetPassword} =require("../controllers/ResetPassword")
const {auth}=require("../middlewares/auth")
router.post("/login",login);
router.post("/signup",signUp);
router.post("/sendOtp",sendOtp);
router.put("/changepassword",auth,changePassword);
router.post("/reset-password-token",ResetPasswordToken);
router.post("/reset-password",ResetPassword);
module.exports =router;
