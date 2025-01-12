import sendEmail from "../config/resend.js";
import { UserModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import uploadImage from "../utils/uploadImageCloudinary.js";
import generateOTP from "../utils/generateOTP.js";
import OTPEmailTemplate from "../utils/OTPEmailTemplate.js";

const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies only in production (HTTPS)
  sameSite: "None", // SameSite only required for cross-origin requests (production)
};

export const Signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Fill all the credentials" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    let userData = await newUser.save();

    const verifyEmailToken = jwt.sign(
      { userID: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyEmailToken}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify Your Email",
      html: verifyEmailTemplate({ url: verifyEmailUrl }),
    });

    return res.status(201).json(userData);
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    const updateUser = await UserModel.findByIdAndUpdate(decode.userID, {
      verify_email: true,
    });

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    console.log("Error in VerifyEmail controller ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Fill all the credentials" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid User Data." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 60 * 1000,
      ...cookieOption,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...cookieOption,
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", "", cookieOption);
    res.clearCookie("refreshToken", "", cookieOption);

    const user = req.user;
    await UserModel.findByIdAndUpdate(user._id, { refresh_token: "" });

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.log("Error in logout controller: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UploadAvatar = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res
        .status(400)
        .json({ message: "Avatar Upload Failed: No image provided" });
    }
    const uploadResult = await uploadImage(
      image,
      "User-Avatar",
      `${req.user.name} ${req.user._id}`
    );
    if (!uploadResult) {
      return res.status(500).json({ message: "Avatar Upload Failed" });
    }
    const userUpdate = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        avatar: uploadResult.secure_url,
      },
      { new: true, select: "-password" }
    );

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      user: userUpdate,
    });
  } catch (error) {
    console.log("Error in uploadAvatar controller: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const UpdateUserDetail = async (req, res) => {
  try {
    const { name, password, mobile, email } = req.body;
    let hashedPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(mobile && { mobile }),
        ...(password && { password: hashedPassword }),
      },
      { new: true, select: "-password" }
    );

    return res
      .status(200)
      .json({ message: "Update Successful", user: updateUser });
  } catch (error) {
    console.log("Error in updateUserDetail controller: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Fill in all credentials" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const OTP = generateOTP(6);
    const expireTime = new Date();
    expireTime.setTime(expireTime.getTime() + 5 * 60 * 1000);

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: OTP,
      forgot_password_expiry: new Date(expireTime).toLocaleString(),
    });

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await sendEmail({
      sendTo: user.email,
      subject: "Reset Your Password",
      html: OTPEmailTemplate({OTP}), 
    });

    res.status(200).json({ message: "OTP sent successfully", OTP });
  } catch (error) {
      console.log("Error in forgetPassword controller: ", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const VerifyForgotPasswordOTP = async (req,res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({ message: 'Fill all credentials', success: false });
        }
        
        const user = await UserModel.findOne({ email })
        if(!user){
            return res.status(400).json({ message: "User Not Found", success: false });
        }
        
        if(otp !== user.forgot_password_otp){
            return res.status(400).json({ message: "Invalid OTP", success: false });
        }
        
        if(user.forgot_password_expiry < new Date()){
            return res.status(400).json({ message: "OTP has expired", success: false });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully.' });
        
    } catch (error) {
        console.log("Error in verifyForgetPasswordOTP controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const ResetPassword = async (req,res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Fill all credentials', success: false });
        }

        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({ message: "User Not Found", success: false });
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password,salt)

        await UserModel.findByIdAndUpdate(user._id, { forgot_password_otp: '', forgot_password_expiry: '' });

        const updatedUser = await UserModel.findByIdAndUpdate(user._id,{password: hashedPassword},{new: true})
        
        res.status(200).json({ success: true, message: 'Password changed successfully.',user: updatedUser });
    } catch (error) {
        console.log("Error in resetPassword controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const RefreshToken = async (req,res) => {
    try {
    const refreshToken = req.cookies.refreshToken || (req.headers?.authorization && req.headers.authorization.split(" ")[1]);  // for mobile

    if(!refreshToken){
        return res.status(401).json({ message: "Unauthorized: Invalid Token", success: false });
    }

    let decode;
    try {
      decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log("JWT Error:", err.message);
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or Expired Token", success: false });
    }

    if(!decode){
      return res.status(401).json({ message: "Unauthorized: Invalid Token", success: false });
    }
    const newAccessToken = generateAccessToken(decode.userId)
    res.cookie("accessToken", newAccessToken, {
        maxAge: 5 * 60 * 60 * 1000,
        ...cookieOption,
      });

    return res.status(200).json({message: "New Access Token Generated",success: true})
        
    } catch (error) {
        console.log("Error in refreshToken controller: ", error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}