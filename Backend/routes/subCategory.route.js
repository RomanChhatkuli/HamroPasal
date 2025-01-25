import express from 'express'
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.js';
import { addSubCategory, deleteSubCategory, editSubCategory, getSubCategory } from '../controllers/subCategory.controller.js';

const subCategoryRouter = express.Router()

subCategoryRouter.post('/add-subCategory',protectRoute,upload.single('Sub-Category'),addSubCategory)
subCategoryRouter.put('/edit-subCategory',protectRoute,upload.single('Sub-Category'),editSubCategory)
subCategoryRouter.post('/delete-subCategory',protectRoute,deleteSubCategory)
subCategoryRouter.get('/get-subCategory',protectRoute,getSubCategory)

export default subCategoryRouter;