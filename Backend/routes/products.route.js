import express from 'express'
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.js';
import { addProducts, deleteProduct, editProduct, getProduct, getProductByCategory, getProductByCategoryAndSubcategory, getProductDetail } from '../controllers/products.controller.js';

const productRouter = express.Router()

productRouter.post('/add-product',protectRoute,upload.array('products',10),addProducts)
productRouter.put('/edit-product',protectRoute,upload.array('products',10),editProduct)
productRouter.post('/delete-product',protectRoute,deleteProduct)

productRouter.get('/get-product',getProduct)
productRouter.post('/get-product-by-category',getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubcategory)
productRouter.post('/get-product-detail',getProductDetail)

export default productRouter;