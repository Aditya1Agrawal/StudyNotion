const Category  = require("../models/categorys")

exports.createcategory =async(req,res)=>{
   try{
    const {name,description}=req.body;
    if(!name || !description){
        return res.status(400).json({
            success:false,
            message:"All fields are mandatory"
        })
    }
    const categoryDetails = await Category.create({
        name:name,
        description:description,
    })
    console.log(categoryDetails)
    return res.status(200).json({
        success:true,
        message:"category created successfully"
    })
   }catch(err){
    console.error(err)
    return res.status(500).json({
        success:false,
        message:"Cannot create category"
    })
   }
}
exports.showAllcategorys = async(req,res)=>{
    try{
        const allcategorys  = await Category.find({})
        return res.status(200).json({
            success:true,
            message:"All categorys are fetched",
            data:allcategorys,
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"Cannot show all categorys"
        })
    }
}
exports.categoryPageDetails =async(req,res)=>{
    try{
      
        const {categoryId}=req.body;
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec()
    if(!selectedCategory){
        return res.status(404).json({
            success:false,
            message:"category not found"
        })
    }
    const differentCategories =await Category.find({_id:{$ne:categoryId}}).populate("courses").exec()
    return res.status(200).json({
        success:true,
        message:"category details fetched successfully",
        data:{
            selectedCategory,
            differentCategories
        }
    })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"cannot fetch category"
        })
    }
}
