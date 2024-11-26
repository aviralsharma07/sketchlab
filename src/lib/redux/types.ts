export interface MenuState {
  activeMenuItem: string;
  actionMenuItem: string | null;
}

export interface ReduxState {
  menu: MenuState;
}
