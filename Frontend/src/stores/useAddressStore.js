import { create } from "zustand";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";

export const useAddressStore = create((set, get) => ({
    Address: [],

    setAddress: (data) => {
        set({ Address: data });
    },

  getAddress: async () => {
    try {
      const response = await Axios.get("/address/get");
      if (response.data.success === true) {
        get().setAddress(response?.data?.Address)
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during get address"
      );
    }
  },
  addAddress: async (data) => {
    try {
      const response = await Axios.post("/address/add",data);
      if (response.data.success === true) {
        get().getAddress()
        toast.success("Address Added Successfully");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during adding address"
      );
    }
  },
  editAddress: async (data) => {
    try {
      const response = await Axios.put("/address/edit",data);
      if (response.data.success === true) {
        get().getAddress()
        toast.success("Address updated Successfully");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during updating address"
      );
    }
  },
  deleteAddress: async (_id) => {
    try {
      const response = await Axios.post("/address/delete",{_id});
      if (response.data.success === true) {
        get().getAddress()
        toast.success("Address deleted Successfully");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during deleting address"
      );
    }
  },
}));
