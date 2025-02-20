import express from 'express'
import { addCategory, deleteCategory, editCategory, getCategory } from '../controllers/category.controller.js';
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.js';
import { admin } from '../middlewares/admin.middleware.js';

const categoryRouter = express.Router()

categoryRouter.post('/add-category',protectRoute,admin,upload.single('category'),addCategory)
categoryRouter.put('/edit-category',protectRoute,admin,upload.single('category'),editCategory)
categoryRouter.post('/delete-category',protectRoute,admin,deleteCategory)
categoryRouter.get('/get-category',getCategory)

export default categoryRouter;