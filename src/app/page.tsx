"use client";
import Board from "@/components/board";
import Menu from "@/components/menu";
import Toolbox from "@/components/toolbox";
import { store } from "@/lib/redux/store";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <Menu />
      <Toolbox />
      <Board />
    </Provider>
  );
}
