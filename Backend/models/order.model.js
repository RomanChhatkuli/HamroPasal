import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: function () {
        return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      },
    },
    transactionId: {
      type: String,
      default: function () {
        return `COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      },
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        discount: { type: Number },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      required: true,
      default: "Order Processing",
      enum: ["Order Processing", "Shipped", "Delivered", "Cancelled"],
    },
    shippingAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
