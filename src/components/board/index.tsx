"use client";
import { MENU_ITEMS } from "@/lib/constants";
import { actionItemClick } from "@/lib/redux/menuSlice";
import { ReduxState, ToolItem } from "@/lib/redux/types";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "@/lib/socket";

const Board = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawHistory = useRef<Array<ImageData>>([]);
  const historyPointer = useRef<number>(0);
  const shouldDraw = useRef<boolean>(false);
  const { activeMenuItem, actionMenuItem } = useSelector((state: ReduxState) => state.menu);
  const { color, size } = useSelector((state: ReduxState) => state.toolbox[activeMenuItem]);

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
    } else if (actionMenuItem === MENU_ITEMS.UNDO) {
      if (historyPointer.current > 0) historyPointer.current -= 1;
      const imageData = drawHistory.current[historyPointer.current];
      context?.putImageData(imageData, 0, 0);
    } else if (actionMenuItem === MENU_ITEMS.REDO) {
      if (historyPointer.current < drawHistory.current.length - 1) historyPointer.current += 1;
      const imageData = drawHistory.current[historyPointer.current];
      context?.putImageData(imageData, 0, 0);
    }

    dispatch(actionItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeConfig = (color: string, size: number) => {
      if (context) {
        context.strokeStyle = color;
        context.lineWidth = size;
      }
    };

    const handleChangeConfig = (config: { color: string; size: number }) => {
      changeConfig(config.color, config.size);
    };

    changeConfig(color, size);

    socket.on("changeConfig", handleChangeConfig);

    return () => {
      socket.off("changeConfig", handleChangeConfig);
    };
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
      socket.emit("beginPath", { x: e.clientX, y: e.clientY });
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldDraw.current) return;
      drawLine(e.clientX, e.clientY);
      socket.emit("drawLine", { x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = (e: MouseEvent) => {
      shouldDraw.current = false;
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData as ImageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    const handleBeginPath = (data: { x: number; y: number }) => {
      beginPath(data.x, data.y);
    };

    const handleDrawLine = (data: { x: number; y: number }) => {
      drawLine(data.x, data.y);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    socket.on("beginPath", handleBeginPath);
    socket.on("drawLine", handleDrawLine);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);

      socket.off("beginPath", handleBeginPath);
      socket.off("drawLine", handleDrawLine);
    };
  }, []);
  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
