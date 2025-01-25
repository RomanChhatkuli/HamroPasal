import uploadImage from "../utils/uploadImageCloudinary.js";
import { SubCategoryModel } from "../models/subCategory.model.js";
import mongoose from "mongoose";

function sanitizePublicId(name) {
  // Remove spaces, special characters, and keep only letters, numbers, hyphens, underscores, and slashes
  return name
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-zA-Z0-9-_\/.]/g, ""); // Remove disallowed characters for cloudniary public_id
}

export const addSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const image = req.file;
    if (!name || !image || !category[0]) {
      return res
        .status(400)
        .json({ message: "Fill in all credentials", success: false });
    }

    const existingSubCategory = await SubCategoryModel.findOne({ name });
    if (existingSubCategory) {
      return res
        .status(400)
        .json({ message: "Sub-Category Already Exists", success: false });
    }
    
    // Parse `category` if it's a stringified array
    let categoryArray = category;
    if (typeof category === "string") {
      categoryArray = JSON.parse(category); // Convert to array
    }
    
    // Validate `category` as an array of ObjectIds
    if (!Array.isArray(categoryArray)) {
      return res
      .status(400)
      .json({ message: "Category must be an array", success: false });
    }
    categoryArray = categoryArray.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid category ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });
    const uploadResult = await uploadImage(
      image,
      "Sub-Category",
      sanitizePublicId(name)
    );
    if (!uploadResult) {
      return res
        .status(500)
        .json({ message: "Category Image Upload Failed", success: false });
    }

    const newCategory = new SubCategoryModel({
      name,
      image: uploadResult.secure_url,
      category: categoryArray,
    });
    const updatedCategory = await newCategory.save();
    if (!updatedCategory) {
      return res
        .status(500)
        .json({ message: "Category Update Failed ", success: false });
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "Category update successfull",
        category: updatedCategory,
      });
  } catch (error) {
    console.log("Error in add subCategory controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const editSubCategory = async (req, res) => {
  try {
    const { _id, name, category } = req.body;
    const image = req.file;
    if (!_id) {
      return res
        .status(400)
        .json({ message: "SubCategory id not found", success: false });
    }

    if (!name && !image) {
      return res.status(400).json({ message: "Same old data", success: false });
    }
    // Parse `category` if it's a stringified array
    let categoryArray = category;
    if (typeof category === "string") {
      categoryArray = JSON.parse(category); // Convert to array
    }
    
    // Validate `category` as an array of ObjectIds
    if (!Array.isArray(categoryArray)) {
      return res
      .status(400)
      .json({ message: "Category must be an array", success: false });
    }
    categoryArray = categoryArray.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid category ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const updateFields = { name, category: categoryArray };
    if (image) {
      const uploadResult = await uploadImage(
        image,
        "Sub-Category",
        sanitizePublicId(name)
      );
      if (!uploadResult) {
        return res
          .status(500)
          .json({ message: "Category Image Upload Failed", success: false });
      }
      updateFields.image = uploadResult?.secure_url;
    }

    const updatedCategory = await SubCategoryModel.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(500)
        .json({ message: "Category not found", success: false });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Category update successfull",
        category: updatedCategory,
      });
  } catch (error) {
    console.log("Error in edit subCategory controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const deleteSubCategory = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ message: "SubCategory id not found", success: false });
    }

    const updatedCategory = await SubCategoryModel.findByIdAndDelete(_id, {
      new: true,
    });
    if (!updatedCategory) {
      return res
        .status(500)
        .json({ message: "Category delete failed", success: false });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Category delete successfull",
        category: updatedCategory,
      });
  } catch (error) {
    console.log("Error in delete subCategory controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const getSubCategory = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.find()
    if (!subCategories) {
      return res
        .status(500)
        .json({ message: "Sub-Category fetch failed", success: false });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Sub-Category fetch successfull",
        subCategories,
      });
  } catch (error) {
    console.log("Error in get Sub-Category controller: ", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
