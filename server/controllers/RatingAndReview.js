const RatingAndReview =require("../models/RatingAndReview")
const Course =require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating =async(req,res)=>{
    try{
        const userId=req.user.id;
    const {rating,review,courseId}=req.body;
    const courseDetails = await Course.findOne({_id:courseId,
        studentsEnrolled:{$elemMatch :{$eq:userId}}})
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"user not registered into the course"
            })
        }
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"user has already reviewed  the course"
            })
        }
        const ratingAndReviews =await RatingAndReview.create({
            user:userId,
            course:courseId,
            rating,
            review
        })
        console.log(ratingAndReviews)
        const updatedCourse =await Course.findByIdAndUpdate(
            {_id:courseId},
            {$push:{ratingAndReviews:ratingAndReviews._id}},
            {new:true}
        )
        console.log(updatedCourse)
        return res.status(200).json({
            success:true,
            message:"rating and review added successfully ",
            ratingAndReviews
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"cannot add rating and review"
        })
    }
}
exports.getAverageRating =async(req,res)=>{
    try{
        const {courseId}=req.user.id;
        const result = await RatingAndReview.aggregate(
            {$match:{ course :new mongoose.mongo.BSONPure.ObjectID.fromHexString(courseId)}},
            {$group :{
                _id:null,
                averageRating:{$avg:"$rating"}
            }}
        )
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        return res.status(200).json({
            success:true,
            message:"average rating is 0,no rating given till now",
            averageRating:0,
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"cannot get averagerating"

        })
    }
}
exports.getAllRatings  = async(req,res)=>{
    try{
        const allreviews =await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image"
        }).populate({path:"course",
    select:"courseName"}).exec()
    
    return res.status(200).json({
        success:true,
        message:"all reviews fetched succesfully",
        data:allreviews
    })
    
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"cannot get all ratings"
        })
    }
}