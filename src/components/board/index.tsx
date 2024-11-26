"use client";
import { ReduxState } from "@/lib/redux/types";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Board = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeMenuItem = useSelector((state: ReduxState) => state.menu.activeMenuItem);
  const { color, size } = useSelector((state: ReduxState) => state.toolbox[activeMenuItem]);
  console.log("color...", color);
  console.log("size...", size);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // const context = canvas.getContext("2d");

    //* When Component is mounted
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
