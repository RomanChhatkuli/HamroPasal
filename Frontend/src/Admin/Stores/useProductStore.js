import { create } from "zustand";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  isFetching: false,
  loading: false,
  products: [],
  isAddModalOpen: false,
  isDeleteModalOpen: false,
  
  setIsDeleteModalOpen: (data) => {
    set({ isDeleteModalOpen: data });
  },
  setIsAddModalOpen: (data) => {
    set({ isAddModalOpen: data });
  },

  setProduct: (data) => {
    set({ products: data });
  },

  fetchProduct: async () => {
    try {
      set({ isFetching: true });
      const response = await Axios.get("/product/get-product");
      if (response.data.success === true) {
        get().setProduct(response.data.products);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during fetch product"
      );
    } finally {
      set({ isFetching: false });
    }
  },

  addProduct: async (data) => {
    try {
      set({ loading: true });
      const response = await Axios.post("/product/add-product", data);
      if (response.data.success) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during add products"
      );
    } finally {
      set({ loading: false });
    }
  },  
  editProduct: async (data) => {
    try {
      set({ loading: true });
      const response = await Axios.put("/product/edit-product", data);
      if (response.data.success) {
        toast.success(response.data.message); 
        get().fetchProduct()
        get().setIsAddModalOpen(false)
      } else {
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during edit product"
      );
    } finally {
      set({ loading: false });
    }
  },  
  deleteProduct: async (_id) => {
    try {
      set({ loading: true });
      const response = await Axios.post("/product/delete-product",{_id});
      if (response.data.success) {
        toast.success(response.data.message); 
        get().fetchProduct()
        get().setIsDeleteModalOpen(false);
      } else {
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during delete product"
      );
    } finally {
      set({ loading: false });
    }
  },  
}));
