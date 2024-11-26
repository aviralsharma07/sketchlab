import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./menuSlice";
export const store = configureStore({
  reducer: {
    menu: MenuReducer,
  },
});
