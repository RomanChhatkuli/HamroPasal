import express from 'express'
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.js';
import { addSubCategory, deleteSubCategory, editSubCategory, getSubCategory } from '../controllers/subCategory.controller.js';
import { admin } from '../middlewares/admin.middleware.js';

const subCategoryRouter = express.Router()

subCategoryRouter.post('/add-subCategory',protectRoute,admin,upload.single('Sub-Category'),addSubCategory)
subCategoryRouter.put('/edit-subCategory',protectRoute,admin,upload.single('Sub-Category'),editSubCategory)
subCategoryRouter.post('/delete-subCategory',protectRoute,admin,deleteSubCategory)

subCategoryRouter.get('/get-subCategory',getSubCategory)

export default subCategoryRouter;