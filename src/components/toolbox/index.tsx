"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { COLORS, MENU_ITEMS } from "@/lib/constants";
import { ReduxState } from "@/lib/redux/types";
import { changeBrushSize, changeColor } from "@/lib/redux/toolboxSlice";
import cx from "classnames";
import { socket } from "@/lib/socket";

const Toolbox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state: ReduxState) => state.menu.activeMenuItem);
  const { color, size } = useSelector((state: ReduxState) => state.toolbox[activeMenuItem]);
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption = activeMenuItem === MENU_ITEMS.PENCIL || MENU_ITEMS.ERASER;

  const updateBrushSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changeBrushSize({ item: activeMenuItem, size: parseInt(e.target.value) }));
    socket.emit("changeConfig", { color, size: parseInt(e.target.value) });
  };

  const updateColor = (color: string) => {
    dispatch(changeColor({ item: activeMenuItem, color }));
    socket.emit("changeConfig", { color, size });
  };

  return (
    <div className={styles.toolboxContainer}>
      {showStrokeToolOption && (
        <div className={styles.toolboxItem}>
          <h4 className={styles.toolboxText}>Stroke Color</h4>
          <div className={styles.itemContainer}>
            {/* {Object.keys(COLORS).map((color) => (
              <div key={color} className={cx(styles.colorBox,{[]:styles.active})} style={{ backgroundColor: COLORS[color as keyof typeof COLORS] }} onClick={() => updateColor(COLORS[color as keyof typeof COLORS])} />
            ))} */}
            {Object.keys(COLORS).map((colorKey) => {
              // Get the current color for this iteration
              const currentColor = COLORS[colorKey as keyof typeof COLORS];

              return <div key={colorKey} className={cx(styles.colorBox, { [styles.active]: color === currentColor })} style={{ backgroundColor: currentColor }} onClick={() => updateColor(currentColor)} />;
            })}
          </div>
        </div>
      )}
      {showBrushToolOption && (
        <div className={styles.toolboxItem}>
          <h4 className={styles.toolboxText}>Brush Size</h4>
          <div className={styles.itemContainer}>
            <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} value={size} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;
