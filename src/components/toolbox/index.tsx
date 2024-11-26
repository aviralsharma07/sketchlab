"use client";
import styles from "./index.module.css";
import { COLORS } from "@/lib/constants";

const Toolbox = () => {
  const updateBrushSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  return (
    <div className={styles.toolboxContainer}>
      <div className={styles.toolboxItem}>
        <h4 className={styles.toolboxText}>Stroke Color</h4>
        <div className={styles.itemContainer}>
          {/* <div className={styles.colorBox} style={{ backgroundColor: COLORS.BLACK }} /> */}
          {Object.keys(COLORS).map((color) => (
            <div key={color} className={styles.colorBox} style={{ backgroundColor: COLORS[color as keyof typeof COLORS] }} />
          ))}
        </div>
      </div>
      <div className={styles.toolboxItem}>
        <h4 className={styles.toolboxText}>Brush Size</h4>
        <div className={styles.itemContainer}>
          <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} />
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
