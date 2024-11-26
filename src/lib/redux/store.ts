import { configureStore } from "@reduxjs/toolkit";
import MenuReducer from "./menuSlice";
import ToolboxReducer from "./toolboxSlice";
export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    toolbox: ToolboxReducer,
  },
});
