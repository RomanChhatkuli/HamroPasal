import { UserModel } from "../models/user.model.js";
import { orderModel } from "../models/order.model.js";

export const getOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const Order = await orderModel.find({userId}).populate('shippingAddress') ;
        if (!Order) {
          return res
            .status(500)
            .json({ message: "Order fetch Failed ", success: false });
        }

        return res
          .status(201)
          .json({
            message: "Order fetched successfully ",
            success: true,
            Order: Order,
          });
      } catch (error) {
        console.log("Error in get order controller ", error);
        return res
          .status(500)
          .json({ message: "Internal Server Error", success: false });
      }
};

export const addOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, transactionId } = req.body;
    const userId = req.user._id;
    if (!orderItems || !shippingAddress || !paymentMethod || !totalPrice) {
      return res
        .status(400)
        .json({ message: "Order purchase failed", success: false });
    }
    
    if (transactionId) {
      const existingOrder = await orderModel.findOne({ transactionId });
      if (existingOrder) {
        return res.status(200)
      }
    }

    const newOrder = new orderModel({
      userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      transactionId
    });
    const Order = await newOrder.save();
    if (!Order) {
      return res
        .status(500)
        .json({ message: "Order purchase Failed ", success: false });
    }
    const addUserOrder = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: Order._id } },
      { new: true }
    );

    return res
      .status(201)
      .json({
        message: "Order placed successfully ",
        success: true,
        Order: Order,
      });
  } catch (error) {
    console.log("Error in add order controller ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const editOrder = async (req, res) => {
  try {
    const { newStatus, _id } = req.body;
    if (!newStatus || !_id) {
      return res
        .status(400)
        .json({ message: "Order status update failed", success: false });
    }
    
    const Order = await orderModel.findByIdAndUpdate(_id,{order_status: newStatus},{new: true});
    if (!Order) {
      return res
        .status(500)
        .json({ message: "Order update Failed ", success: false });
    }

    return res
      .status(200)
      .json({
        message: "Order update successfully ",
        success: true,
        Order: Order,
      });
  } catch (error) {
    console.log("Error in edit order controller ", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const getAdminOrder = async (req, res) => {
  try {
      const Order = await orderModel.find().populate('shippingAddress') ;
      if (!Order) {
        return res
          .status(500)
          .json({ message: "Order fetch Failed ", success: false });
      }

      return res
        .status(201)
        .json({
          message: "Order fetched successfully ",
          success: true,
          Order: Order,
        });
    } catch (error) {
      console.log("Error in get order controller ", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", success: false });
    }
};