import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    recipient_name: {
      type: String,
      default: "",
    },
    address_line: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    province: {
      type: String,
      default: "",
    },
    localPlace: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      default: ''
    }
  },
  { timestamps: true }
);

export const AddressModel = mongoose.model("address",addressSchema)