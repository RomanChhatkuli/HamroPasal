import { create } from "zustand";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";
import { useCartStore } from "./useCartStore.js";

export const useOrderStore = create(
  persist((set, get) => ({
    adminOrders: [],
    Orders: [],
    orderData: {},
    setOrders: (data) => {
      set({ Orders: data });
    },
    setAdminOrders: (data) => {
      set({ adminOrders: data });
    },
    setOrderData: (cartProducts, selectedAddress, paymentMethod, total) => {
      set({
        orderData: {
          orderItems: cartProducts.map((item) => ({
            product: item._id,
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item?.image?.[0],
            discount: item?.discount,
          })),
          shippingAddress: selectedAddress._id,
          paymentMethod: paymentMethod,
          totalPrice: total,
        },
      });
    },
    emptyOrderData: () =>{
      set({orderData: {}})
    },
    getOrders: async () => {
      try {
        const response = await Axios.get("/order/get");
        if (response.data.success === true) {
          get().setOrders(response?.data?.Order);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred during get orders"
        );
      }
    },
    getOrdersAdmin: async () => {
      try {
        const response = await Axios.get("/order/get-admin");
        if (response.data.success === true) {
          get().setAdminOrders(response?.data?.Order);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred during get admin orders"
        );
      }
    },
    addOrders: async (transactionId) => {
      if (!get().orderData || Object.keys(get().orderData).length === 0) {
        return; 
    }
      try {
        const orderDataWithTransaction = {
          ...get().orderData,
          transactionId: transactionId,
        };
        const response = await Axios.post("/order/add", orderDataWithTransaction);
        if (response.data.success === true) {
          get().emptyOrderData()
          useCartStore.getState().emptyCartProducts();
          localStorage.removeItem("cartProducts");
          localStorage.removeItem("orderData");
          toast.success("Order placed");
        } 
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred during add orders"
        );
      }
    },
    editOrders: async (_id,newStatus) => {
      try {
        const data = { _id, newStatus };
        const response = await Axios.put("/order/edit", data);
        if (response.data.success === true) {
          get().getOrdersAdmin();
          toast.success("Order Updated")
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred during edit orders"
        );
      }
    },
  }),
  {
    name: "orderData", // Key in localStorage
    partialize: (state) => ({ orderData: state.orderData  }),
  }
)
);
