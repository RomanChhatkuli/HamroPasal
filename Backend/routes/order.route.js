import express from 'express'
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addOrder, editOrder, getAdminOrder, getOrder } from '../controllers/order.controller.js';
import { admin } from '../middlewares/admin.middleware.js';
const orderRouter = express.Router()

orderRouter.get('/get',protectRoute,getOrder)
orderRouter.get('/get-admin',protectRoute,getAdminOrder)
orderRouter.post('/add',protectRoute,addOrder)
orderRouter.put('/edit',protectRoute,admin,editOrder)

export default orderRouter;