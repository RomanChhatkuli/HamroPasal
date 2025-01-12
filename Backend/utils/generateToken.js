import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const generateAccessToken = (userId) => {
  const accessToken = jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5h" }
  )

  return accessToken
};

export const generateRefreshToken = async (userId) => {
  try {
    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    await UserModel.findByIdAndUpdate(userId, { refresh_token: refreshToken });
    return refreshToken;
    
  } catch (error) {
    throw new Error("Failed to generate or store refresh token");
  }
};

