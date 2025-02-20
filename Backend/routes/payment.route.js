import express from 'express'
import { esewaFailure, esewaSuccess } from '../controllers/payment.controller.js';
import { protectRoute } from "../middlewares/auth.middleware.js";
const paymentRouter = express.Router();

paymentRouter.get('/esewa/success',protectRoute,esewaSuccess)
paymentRouter.get('/esewa/failure',protectRoute,esewaFailure)

export default paymentRouter;