import { UserModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken || (req.headers?.authorization && req.headers.authorization.split(" ")[1]);  // for mobile

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized- No Token Provided" });
    }

    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    req.user = await UserModel.findOne({ _id: decode.userId }).select("-password");
    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
