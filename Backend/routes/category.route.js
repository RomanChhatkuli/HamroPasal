import express from 'express'
import { addCategory, deleteCategory, editCategory, getCategory } from '../controllers/category.controller.js';
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from '../middlewares/multer.js';

const categoryRouter = express.Router()

categoryRouter.post('/add-category',protectRoute,upload.single('category'),addCategory)
categoryRouter.put('/edit-category',protectRoute,upload.single('category'),editCategory)
categoryRouter.post('/delete-category',protectRoute,deleteCategory)
categoryRouter.get('/get-category',getCategory)

export default categoryRouter;