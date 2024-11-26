import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MENU_ITEMS, COLORS } from "../constants";
import { ToolboxState, ToolItem } from "./types";

export const initialToolboxState: ToolboxState = {
  [MENU_ITEMS.PENCIL]: {
    color: COLORS.BLACK,
    size: 3,
  },
  [MENU_ITEMS.ERASER]: {
    color: COLORS.WHITE,
    size: 10,
  },
  // [MENU_ITEMS.UNDO]: {},
  // [MENU_ITEMS.REDO]: {},
  // [MENU_ITEMS.DOWNLOAD]: {},
};

export const toolboxSlice = createSlice({
  name: "toolbox",
  initialState: initialToolboxState,
  reducers: {
    changeColor: (state, action: PayloadAction<{ item: keyof typeof MENU_ITEMS; color: string }>) => {
      const { item, color } = action.payload;
      const toolItem = state[item] as ToolItem;
      toolItem.color = color;
    },
    changeBrushSize: (state, action: PayloadAction<{ item: keyof typeof MENU_ITEMS; size: number }>) => {
      const { item, size } = action.payload;
      const toolItem = state[item] as ToolItem;
      toolItem.size = size;
    },
  },
});

export const { changeColor, changeBrushSize } = toolboxSlice.actions;

export default toolboxSlice.reducer;
