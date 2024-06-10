const express =require("express")
const router =express.Router()
const { isInstructor, auth, isAdmin, isStudent } = require("../middlewares/auth")
const { createCourse, showAllCourses, getCourseDetails,getInstructorCourses,getFullCourseDetails,editCourseDetails,deleteCourse } = require("../controllers/Course");
const { createSection, updateSection, deleteSection } = require("../controllers/Section");
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");
const { createcategory, showAllcategorys, categoryPageDetails } = require("../controllers/categorys");
const { createRating, getAverageRating,getAllRatings } = require("../controllers/RatingAndReview");
const {updateCourseProgress}=require("../controllers/courseProgress")

router.post("/createCourse",auth,isInstructor,createCourse);
router.put("/editCourse", auth, isInstructor, editCourseDetails)
router.post("/addSection",auth,isInstructor,createSection);
router.put("/updateSection",auth,isInstructor,updateSection);
router.delete("/deleteSection",auth ,isInstructor,deleteSection);
router.post("/addSubSection",auth,isInstructor,createSubSection);
router.put("/updateSubSection",auth,isInstructor,updateSubSection);
router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection);
router.get("/getAllCourses",showAllCourses);
router.post("/getCourseDetails",getCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

router.post("/createCategory",auth,isAdmin,createcategory);
router.get("/showallcategories",showAllcategorys);
router.post("/getCategoryPageDetails",categoryPageDetails);

router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRatings);
router.delete("/deleteCourse",deleteCourse)

module.exports =router;
