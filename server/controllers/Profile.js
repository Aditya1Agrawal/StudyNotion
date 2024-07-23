const Profile =require("../models/Profile")
const User =require("../models/User");

const Course = require("../models/Course")
const { uploadImagetoCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress =require("../models/CourseProgress")

exports.updateProfile =async(req,res)=>{
   try{
    const {dateOfBirth ="",about="",gender,contactNumber}=req.body;
    const id =req.user.id;
    if(!contactNumber || !id || !gender){
        return res.status(400).json({
            success:false,
            message:"all fields are required"
        })
    }
    const user =await User.findById(id);
    const userDetails =user.additionalDetails
    const profileDetails =await Profile.findById({_id:userDetails})
    profileDetails.gender =gender
    profileDetails.dateOfBirth=dateOfBirth
    profileDetails.about=about
    profileDetails.contactNumber =contactNumber
    await profileDetails.save()
    const updatedUserDetails =await User.findById(id).populate("additionalDetails").exec()
    res.status(200).json({
        success:true,
        message:"profile updated successfully",
        updatedUserDetails
    })
   }
   catch(err){
    console.error(err)
    res.status(500).json({
        success:false,
        message:"cannot update profile"
    })
   }
}
exports.deleteAccount =async(req,res)=>{
  try{
    const id =req.user.id;
const userDetails =await User.findById(id);
if(!userDetails){
    return res.status(404).json({
        success:false,
        message:"user not found",
    })
}
const profileId = userDetails.additionalDetails;
await Profile.findByIdAndDelete({_id:profileId})
await User.findByIdAndDelete(id);
return res.status(200).json({
    success:true,
    message:"user account deleted successfully"
})
}
catch(err){
    console.error(err)
    return res.status(500).json({
        success:false,
        message:"cannot delete the user .Please try again later"
    })
}
}
exports.getAllUserDetails = async(req,res)=>{
    try{
        const id =req.user.id;
        const userdetails = await User.findById(id).populate("additionalDetails").exec()
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            data:userdetails
        })
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"User data cannot be fetched"
        })
    }
}
exports.updateDisplayPicture =async(req,res)=>{
   try{
    const displayPicture =req.files.displayPicture
    const userId =req.user.id;
    const image =await uploadImagetoCloudinary(displayPicture,process.env.FOLDER,1000,1000)
    console.log(image)
    const updatedProfile =await User.findByIdAndUpdate({
        _id:userId
    },{image:image.secure_url},{new:true}
    )
    console.log(updatedProfile)
    return res.status(200).json({
        success:true,
        message:"profile picture updated successfully",
        data:updatedProfile
        
    })
   }
   catch(err){
    console.error(err)
    return res.status(500).json({
        success:false,
        message:"cannot update display picture"
    })
   }
}
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseID: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }