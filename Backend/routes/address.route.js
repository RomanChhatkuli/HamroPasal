import express from 'express'
import { protectRoute } from "../middlewares/auth.middleware.js";
import { addAddress, deleteAddress, editAddress, getAddress } from '../controllers/address.controller.js'

const addressRouter = express.Router()

addressRouter.get("/get",protectRoute,getAddress)
addressRouter.post("/add",protectRoute,addAddress)
addressRouter.put("/edit",protectRoute,editAddress)
addressRouter.post("/delete",protectRoute,deleteAddress)

export default addressRouter;