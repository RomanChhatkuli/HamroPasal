import express from "express";
import { ForgetPassword, Login, Logout, RefreshToken, ResetPassword, Signup, UpdateUserDetail, UploadAvatar, VerifyEmail, VerifyForgotPasswordOTP } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.js";
const authRouter = express.Router()

authRouter.post('/signup', Signup)
authRouter.get('/verify-email', VerifyEmail)
authRouter.post('/login', Login)
authRouter.get('/logout',protectRoute, Logout)
authRouter.put('/upload-avatar',protectRoute,upload.single('avatar'),UploadAvatar)
authRouter.put('/update-user',protectRoute,UpdateUserDetail)
authRouter.post('/forget-password',ForgetPassword)
authRouter.post('/verify-forget-password-otp',VerifyForgotPasswordOTP)
authRouter.post('/reset-password',ResetPassword)
authRouter.post('/refresh-token',RefreshToken)

export default authRouter;