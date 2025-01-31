import { create } from "zustand";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  isFetchingProduct: false,
  isFetchingCategoryWiseProduct: false,
  isFetchingProductDetails: false,
  loading: false,
  products: [],
  productDetail: {},
  isAddModalOpen: false,
  isDeleteModalOpen: false,
  
  setProductDetail: (data) => {
    set({ productDetail: data });
  },
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
      set({ isFetchingProduct: true });
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
      set({ isFetchingProduct: false });
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

  fetchCategoryWiseProduct: async (id) => {
    try {
      set({ isFetchingCategoryWiseProduct: true });
      const response = await Axios.post("/product/get-product-by-category",{id});
      if (response.data.success === true) {
        return response.data.products
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during Fetch Category Wise Product"
      );
    } finally {
      setTimeout(() => {
        set({ isFetchingCategoryWiseProduct: false });
      },500)
    }
  },
  fetchProductByCategoryAndSubcategory: async (categoryId,subCategoryId) => {
    try {
      set({ isFetchingProductByCategoryAndSubcategory: true });
      const response = await Axios.post("/product/get-product-by-category-and-subcategory",{categoryId,subCategoryId});
      if (response.data.success === true) {
        return response.data.products
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during Fetch Category Wise Product"
      );
    } finally {
      setTimeout(() => {
        set({ isFetchingProductByCategoryAndSubcategory: false });
      },500)
    }
  },
  fetchProductDetail: async (id) => {
    try {
      set({isFetchingProductDetails: true})
      const response = await Axios.post("/product/get-product-detail",{id});
      if (response.data.success === true) {
        get().setProductDetail(response.data.product)
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "An error occurred during Fetch Category Wise Product"
      );
    }finally{
      set({isFetchingProductDetails: false})
    }
  },
  

}));
