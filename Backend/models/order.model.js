import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    orderId: {
      type: string,
      required: [true, "Provide orderId"],
      unique: true,
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    productDetail: {
      _id: string,
      name: String,
      image: Array,
    },
    payment_id: {
      type: string,
      default: "",
    },
    payment_status: {
      type: string,
      default: "",
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    subTotalAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    invoice_receive: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order",orderSchema)