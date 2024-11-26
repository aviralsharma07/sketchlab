import { MENU_ITEMS } from "../constants";

export interface MenuState {
  activeMenuItem: "PENCIL" | "ERASER" | "UNDO" | "REDO" | "DOWNLOAD";
  actionMenuItem: string | null;
}

export interface ToolItem {
  color: string; // Assuming color is a string, based on the use of `COLORS.BLACK`
  size: number; // Size is a number, as seen with PENCIL and ERASER
}

export interface ToolboxState {
  // [MENU_ITEMS.PENCIL]: ToolItem;
  // [MENU_ITEMS.ERASER]: ToolItem;
  // [MENU_ITEMS.UNDO]: {};
  // [MENU_ITEMS.REDO]: {};
  // [MENU_ITEMS.DOWNLOAD]: {};
  // [key: string]: ToolItem | {};
  [key: string]: ToolItem;
}

export interface ReduxState {
  menu: MenuState;
  toolbox: ToolboxState;
}
