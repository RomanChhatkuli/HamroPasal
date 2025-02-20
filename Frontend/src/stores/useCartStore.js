import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartProducts: [],
      emptyCartProducts: () =>{
        set({cartProducts: []})
      },
      addCartProducts: async (product) => {
        set((state) => {
          return {
            cartProducts: [...state.cartProducts, { ...product, quantity: 1 }],
          };
        });
      },
      removeCartProducts: async (product) => {
        set((state) => {
          return {
            cartProducts: state.cartProducts.filter(
              (p) => p._id !== product._id
            ),
          };
        });
      },
      incCartProductsQuantity: async (product) => {
        set((state) => {
          return {
            cartProducts: state.cartProducts.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        });
      },
      decCartProductsQuantity: async (product) => {
        set((state) => {
          return {
            cartProducts: state.cartProducts.map((item) => {
              if (item._id === product._id) {
                if (item.quantity <= 1) {
                return get().removeCartProducts(product);
                }else{
                   return {...item, quantity: item.quantity - 1}
                }
              }else{
                return item
              }
            })
            .filter((item) => item.quantity > 0),
          };
        });
      },
    }),
    {
      name: "cartProducts", // Key in localStorage
      partialize: (state) => ({ cartProducts: state.cartProducts }), // Persist only cart products
    }
  )
);
