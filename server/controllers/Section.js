const Section =require("../models/Section")
const Course =require("../models/Course")
const SubSection = require("../models/SubSection")

exports.createSection = async(req,res)=>{
   try{
    const {sectionName,courseId}=req.body;
    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"cannot get all details"

        })
    }
    const newSection = await Section.create({
        sectionName,
    })
    const updatedCourse =await Course.findByIdAndUpdate(
        courseId,
        {
            $push:{
                courseContent:newSection._id
            }
        },
        {new:true}
    ) .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec()
    return res.status(200).json({
        success:true,
        message:"Section created successfully",
        updatedCourse
    })
   }
   catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:"Cannot create section"
    })
   }
}
exports.updateSection =async(req,res)=>{
  try{
    const { sectionName, sectionId, courseId } = req.body
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    )
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
    console.log(course)
    res.status(200).json({
      success: true,
      message: section,
      data: course,
    })
  }
  catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:"cannot update the section"
    })
  }
}
exports.deleteSection =async(req,res)=>{
   try{
    const { sectionId, courseId } = req.body
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })
    const section = await Section.findById(sectionId)
    console.log(sectionId, courseId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }
    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } })

    await Section.findByIdAndDelete(sectionId)

    // find the updated course and return it
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    })
   }
   catch(err){
    console.error(err)
    return res.status(500).json({
        success:false,
        message:"cannot delete section"
    })
   }
    
}