"use client";
import { MENU_ITEMS } from "@/lib/constants";
import { actionItemClick } from "@/lib/redux/menuSlice";
import { ReduxState } from "@/lib/redux/types";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldDraw = useRef<boolean>(false);
  const { activeMenuItem, actionMenuItem } = useSelector((state: ReduxState) => state.menu);
  const { color, size } = useSelector((state: ReduxState) => state.toolbox[activeMenuItem]);
  console.log("color...", color);
  console.log("size...", size);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "sketchlab-image.jpg";
      anchor.click();
    }

    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = () => {
      if (context) {
        context.strokeStyle = color;
        context.lineWidth = size;
      }
    };

    changeConfig();
  }, [color, size]);

  //! UseLayoutEffect is used to draw on the canvas before browser paints the screen to avoid flickering effect on the canvas while drawing on it
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //* When Component is mounted
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x: number, y: number) => {
      if (context) {
        context.beginPath();
        context.moveTo(x, y);
      }
    };

    const drawLine = (x: number, y: number) => {
      if (context) {
        context.lineTo(x, y);
        context.stroke();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      shouldDraw.current = true;
      beginPath(e.clientX, e.clientY);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldDraw.current) return;
      drawLine(e.clientX, e.clientY);
    };
    const handleMouseUp = (e: MouseEvent) => {
      shouldDraw.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
