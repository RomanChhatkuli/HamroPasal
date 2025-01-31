import { ProductModel } from "../models/product.model.js";
import uploadImage from "../utils/uploadImageCloudinary.js";
import mongoose from "mongoose";

// Parse `category` if it's a stringified array
function stringifiedArray(category) {
    let categoryArray = category;
    if (typeof category === "string") {
        categoryArray = JSON.parse(category); // Convert to array
    }

    // Validate `category` as an array of ObjectIds
    if (!Array.isArray(categoryArray)) {
        return res.status(400).json({
            message: "Category/Sub-category must be an array",
            success: false,
        });
    }
    categoryArray = categoryArray.map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid category ID: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
    });
    return categoryArray;
}

export const addProducts = async (req, res) => {
    try {
        const { name, category, subCategory, unit, price, description, stock, discount, moreDetails, } = req.body;
        const images = req.files;

        if (!name || !images[0] || !category[0] || !subCategory[0] || !unit || !price || !description || !stock) {
            return res
                .status(400)
                .json({ message: "Fill in all credentials", success: false });
        }

        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res
                .status(400)
                .json({ message: "Product Already Exists", success: false });
        }

        const uploadedImages = await Promise.all(
            images.map(async (image) => {
                const uploadResult = await uploadImage(
                    image,
                    `products/${name}`,
                );
                if (!uploadResult) {
                    throw new Error("Product Image Upload Failed");
                }
                return uploadResult.secure_url;
            })
        );
        const newProduct = new ProductModel({
            name,
            image: uploadedImages,
            category: stringifiedArray(category),
            subCategory: stringifiedArray(subCategory),
            unit,
            price,
            description,
            stock,
            discount,
            more_details: JSON.parse(moreDetails),
        });
        const updatedProduct = await newProduct.save();
        if (!updatedProduct) {
            return res
                .status(500)
                .json({ message: "Product upload Failed ", success: false });
        }
        return res.status(201).json({
            success: true,
            message: "Product upload successfull",
            product: updatedProduct,
        });
    } catch (error) {
        console.log("Error in add Product controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
export const editProduct = async (req, res) => {
    try {
        const { _id, name, category, subCategory, unit, price, description, stock, discount, moreDetails, image } = req.body;
        const images = req.files;
        if (!_id) {
            return res
                .status(400)
                .json({ message: "Product id not found", success: false });
        }

        const updateFields = {
            name,
            image: JSON.parse(image),
            category: stringifiedArray(category),
            subCategory: stringifiedArray(subCategory),
            unit,
            price,
            description,
            stock,
            discount,
            more_details: JSON.parse(moreDetails) || {},
        };
        if (images) {
            const uploadedImages = await Promise.all(
                images.map(async (image) => {
                    const uploadResult = await uploadImage(
                        image,
                        `products/${name}`,
                    );
                    if (!uploadResult) {
                        throw new Error("Product Image Upload Failed");
                    }
                    return uploadResult.secure_url;
                })
            );
            updateFields.image.push(...uploadedImages);
        }
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            _id,
            updateFields,
            { new: true }
        );
        if (!updatedProduct) {
            return res
                .status(500)
                .json({ message: "Product not found", success: false });
        }
        return res.status(200).json({
            success: true,
            message: "Product update successfull",
            product: updatedProduct,
        });
    } catch (error) {
        console.log("Error in edit Product controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res
                .status(400)
                .json({ message: "Product id not found", success: false });
        }

        const updatedProducts = await ProductModel.findByIdAndDelete(_id, {
            new: true,
        });
        if (!updatedProducts) {
            return res
                .status(500)
                .json({ message: "Product delete failed", success: false });
        }
        return res.status(200).json({
            success: true,
            message: "Product delete successfull",
            products: updatedProducts,
        });
    } catch (error) {
        console.log("Error in delete Product controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
export const getProduct = async (req, res) => {
    try {
        const products = await ProductModel.find().sort({ createdAt : -1});
        if (!products) {
            return res
                .status(500)
                .json({ message: "Product fetch failed", success: false });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetch successfull",
            products,
        });
    } catch (error) {
        console.log("Error in get Product controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
export const getProductByCategory = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res
                .status(400)
                .json({ message: "Product id not found", success: false });
        }
        const products = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        if (!products) {
            return res
                .status(500)
                .json({ message: "Product fetch failed", success: false });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetch successfull",
            products,
        });
    } catch (error) {
        console.log("Error in get getProductByCategory controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
export const getProductDetail = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res
                .status(400)
                .json({ message: "Product id not found", success: false });
        }
        const product = await ProductModel.findById(id);
        if (!product) {
            return res
                .status(500)
                .json({ message: "Product Detail fetch failed", success: false });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetch successfull",
            product,
        });
    } catch (error) {
        console.log("Error in get Product detail controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
export const getProductByCategoryAndSubcategory = async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.body
        if (!categoryId || !subCategoryId ) {
            return res
            .status(400)
            .json({ message: "Id's not found", success: false });
        }
        const products = await ProductModel.find({ 
            category : { $in : categoryId },
            subCategory: {$in : subCategoryId}
        })

        if (!products) {
            return res
                .status(500)
                .json({ message: "Product fetch by category and subcategory failed", success: false });
        }
        return res.status(200).json({
            success: true,
            message: "Product fetch successfull",
            products,
        });
    } catch (error) {
        console.log("Error in get getProductByCategoryAndSubCategory controller: ", error.message);
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
};
