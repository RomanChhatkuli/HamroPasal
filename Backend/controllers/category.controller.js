import { CategoryModel } from "../models/category.model.js"
import uploadImage from "../utils/uploadImageCloudinary.js"

function sanitizePublicId(name) {
    // Remove spaces, special characters, and keep only letters, numbers, hyphens, underscores, and slashes
    return name
      .trim() // Remove leading and trailing spaces
      .replace(/[^a-zA-Z0-9-_\/.]/g, ''); // Remove disallowed characters for cloudniary public_id
  }

export const addCategory = async (req,res) => {
    try {
        const { name } = req.body
        const image = req.file

        if(!name || !image){
            return res.status(400).json({ message: "Fill in all credentials", success: false} )
        }

        const existingCategory = await CategoryModel.findOne({ name })
        if(existingCategory){
            return res.status(400).json({ message: "Category Already Exists", success:false });
        }

        const uploadResult = await uploadImage(image,"Category",sanitizePublicId(name))
        if (!uploadResult) {
            return res.status(500).json({ message: "Category Image Upload Failed", success:false });
        }

        const newCategory = new CategoryModel({name,image: uploadResult.secure_url})
        const updatedCategory = await newCategory.save()
        if(!updatedCategory){
            return res.status(500).json({message: "Category Update Failed ",success: false})
        }
        return res.status(201).json({success: true,message: "Category created successfully",category: updatedCategory})
        
    } catch (error) {
        console.log("Error in addCategory controller: ", error);
        return res.status(500).json({message: "Internal Server Error",success: false})
    }
}
export const editCategory = async (req,res) => {
    try {
        const { _id , name } = req.body
        const image = req.file
        
        if(!_id){
            return res.status(400).json({message: "Category id not found",success: false})
        }

        if(!name && !image){
            return res.status(400).json({message: "Same old data",success: false})
        }

        const updateFields = { name }
        if(image){
            const uploadResult = await uploadImage(image,"Category",sanitizePublicId(name))
            if (!uploadResult) {
                return res.status(500).json({ message: "Category Image Upload Failed", success:false });
            }
            updateFields.image = uploadResult?.secure_url;
        }
        
        const updatedCategory = await CategoryModel.findByIdAndUpdate(_id,updateFields,{new: true})
        if(!updatedCategory){
            return res.status(500).json({message: "Category not found",success: false})
        }
        return res.status(200).json({success: true,message: "Category update successfull",category: updatedCategory})
        
    } catch (error) {
        console.log("Error in edit Category controller: ", error.message);
        return res.status(500).json({message: "Internal Server Error",success: false})
    }
}
export const deleteCategory = async (req,res) => {
    try {
        const { _id } = req.body
        if(!_id){
            return res.status(400).json({message: "Category id not provided",success: false})
        }        
        const updatedCategory = await CategoryModel.findByIdAndDelete(_id,{new: true})
        if(!updatedCategory){
            return res.status(500).json({message: "Category delete failed",success: false})
        }
        return res.status(200).json({success: true,message: "Category delete successfull",category: updatedCategory})
        
    } catch (error) {
        console.log("Error in delete category controller: ", error.message);
        return res.status(500).json({message: "Internal Server Error",success: false})
    }
}
export const getCategory = async (req,res) => {
    try {        
        const Categories = await CategoryModel.find()
        if(!Categories){
            return res.status(500).json({message: "Category fetch failed",success: false})
        }
        return res.status(200).json({success: true,message: "Category fetch successfull", Categories})
        
    } catch (error) {
        console.log("Error in get category controller: ", error.message);
        return res.status(500).json({message: "Internal Server Error",success: false})
    }
}