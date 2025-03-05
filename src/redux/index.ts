import { configureStore } from "@reduxjs/toolkit";
import reducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    cart: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./cartSlice";
