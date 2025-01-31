import { create } from "zustand";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
  isFetchingCategory: false,
  loading: false,
  categories: [],
  isAddModalOpen: false,
  isDeleteModalOpen: false,

  setIsDeleteModalOpen: (data) => {
    set({ isDeleteModalOpen: data });
  },
  setIsAddModalOpen: (data) => {
    set({ isAddModalOpen: data });
  },

  setCategories: (data) => {
    set({ categories: data });
  },

  fetchCategory: async () => {
    try {
      set({ isFetchingCategory: true });
      const response = await Axios.get("/category/get-category");
      if (response.data.success === true) {
        get().setCategories(response.data.Categories);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during fetchCategory"
      );
    } finally {
      set({ isFetchingCategory: false });
    }
  },

  addCategory: async (data) => {
    try {
      set({ loading: true });

      const response = await Axios.post("/category/add-category", data);
      if (response.data.success) {
        toast.success(response.data.message); 
        get().fetchCategory()
        get().setIsAddModalOpen(false)
      } else {
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during addCategory"
      );
    } finally {
      set({ loading: false });
    }
  },  
  editCategory: async (data) => {
    try {
      set({ loading: true });

      const response = await Axios.put("/category/edit-category", data);
      if (response.data.success) {
        toast.success(response.data.message); 
        get().fetchCategory()
        get().setIsAddModalOpen(false)
      } else {
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during edit Category"
      );
    } finally {
      set({ loading: false });
    }
  },  
  deleteCategory: async (_id) => {
    try {
      set({ loading: true });
      const response = await Axios.post("/category/delete-category",{_id});
      if (response.data.success) {
        toast.success(response.data.message); 
        get().fetchCategory()
        get().setIsDeleteModalOpen(false);
      } else {
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during delete Category"
      );
    } finally {
      set({ loading: false });
    }
  },  
}));
