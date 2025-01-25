import { UserModel } from "../models/user.model.js";

export const admin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" ,success: false });
    }
    next();
  } catch (error) {
    console.log("Error in admin middleware: ", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
