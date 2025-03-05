import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { products } from "../mocks/products";
import { Cart, Product, Voucher } from "../models";

const initialState: Cart = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initializeCart: (
      state,
      action: PayloadAction<{ id: string; quantity?: number }[]>
    ) => {
      const selectedIds = action.payload.map((item) => item.id);
      state.items = state.items.filter((item) =>
        selectedIds.includes(item.product.id)
      );

      action.payload.forEach(({ id, quantity }) => {
        const product = products.find((p: any) => p.id === id);
        if (!product) return;

        const existingItem = state.items.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          existingItem.quantity = quantity || existingItem.quantity;
        } else {
          const cartProduct: Product = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          };

          state.items.push({
            id: Math.floor(Math.random() * 1000000) + '', 
            product: cartProduct,
            quantity: quantity || 1,
            voucher: null,
          });
        }
      });
    },

    deleteCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    modifyQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    setVoucher: (
      state,
      action: PayloadAction<{ id: string; voucher: Voucher | null }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.voucher = action.payload.voucher;
      }
    },

    resetCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  initializeCart,
  deleteCartItem,
  modifyQuantity,
  setVoucher,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
