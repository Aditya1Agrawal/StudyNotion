const express =require("express");
const app =express();
const userRoutes =require("./routes/User");
const profileRoutes =require("./routes/Profile")
const paymentRoutes =require("./routes/Payments")
const courseRoutes =require("./routes/Courses");
const contactRoutes =require("./routes/Contact")
const cors =require("cors")
const fileUpload =require("express-fileupload");
const cookieParser =require("cookie-parser");
const database =require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

require("dotenv").config();
const PORT =process.env.PORT ||4000;
database.connect()
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
	tempFileDir:"/tmp",
}))
app.use(
    cors({
        origin:"https://study-notion-frontend-eosin-eight.vercel.app",
        credentials:true,
    })
)
cloudinaryConnect()
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes)
app.use("/api/v1/payment",paymentRoutes)
app.use("/api/v1/course",courseRoutes)
app.use("/api/v1/reach",contactRoutes)
app.get("/",async(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running"
    })
})
app.listen(PORT,()=>{
    console.log(`App is runnning at ${PORT}`)
})
