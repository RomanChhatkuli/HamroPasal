import { create } from "zustand";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

export const useSubCategoryStore = create(
  persist(
    (set, get) => ({
      isFetchingSubCategory: false,
      loading: false,
      subCategories: [],
      isAddModalOpen: false,
      isDeleteModalOpen: false,
    
      setIsDeleteModalOpen: (data) => {
        set({ isDeleteModalOpen: data });
      },
      setIsAddModalOpen: (data) => {
        set({ isAddModalOpen: data });
      },
    
      setSubCategories: (data) => {
        set({ subCategories: data });
      },
    
      fetchSubCategory: async () => {
        try {
          set({ isFetchingSubCategory: true });
          const response = await Axios.get("/sub-category/get-subCategory");
          if (response.data.success === true) {
            get().setSubCategories(response.data.subCategories);
          } else {
            toast.error(response?.data?.message);
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "An error occurred during fetch Sub-Category"
          );
        } finally {
          set({ isFetchingSubCategory: false });
        }
      },
    
      addSubCategory: async (data) => {
        try {
          set({ loading: true });
          const response = await Axios.post("/sub-category/add-subCategory", data);
          if (response.data.success) {
            toast.success(response.data.message); 
            get().fetchSubCategory()
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
      editSubCategory: async (data) => {
        try {
          set({ loading: true });
    
          const response = await Axios.put("/sub-category/edit-subCategory", data);
          if (response.data.success) {
            toast.success(response.data.message); 
            get().fetchSubCategory()
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
      deleteSubCategory: async (_id) => {
        try {
          set({ loading: true });
          const response = await Axios.post("/sub-category/delete-subCategory",{_id});
          if (response.data.success) {
            toast.success(response.data.message); 
            get().fetchSubCategory()
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
    }),
    {
      name: "subCategories", // Key in localStorage
      partialize: (state) => ({ subCategories: state.subCategories }), // Persist only products
    }
  )
);
