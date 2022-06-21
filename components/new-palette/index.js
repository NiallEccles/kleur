import { useState } from "react";
import styles from "./new-palette.module.css";
import { HexColorPicker } from "react-colorful";

// const controls = [{ colour: "#E23E57" }, { colour: "#88304E" }];

export default function NewPalette() {
  const [controls, setControl] = useState([
    { colour: "#" },
    { colour: "#" },
    { colour: "#" },
    { colour: "#" },
  ]);
  return (
    <div className={styles.paletteContainer}>
      <div className={styles.palette} aria-label="Palette">
        {controls.map((control, index) => (
          <div
            className={styles.sliver}
            style={{ background: control.colour }}
            aria-label="Palette Sliver"
            key={index}
          >
            <input
              type="text"
              value={control.colour}
              onChange={(e) => {
                updateControl(controls, setControl, index, {
                  colour: e.target.value,
                });
              }}
            />
            <button className={styles.paletteIcon}>{paletteIcon()}</button>
            {/* {colourPicker(showPicker, setShowPicker, controls, setControl, index)} */}
          </div>
        ))}
      </div>
      <button className={`btn btn-ghost mt-4 w-full ${styles.addIcon}`}>
        Create Palette
      </button>
    </div>
  );
}

function colourPicker(showPicker, setShowPicker, controls, setControl, index) {
  return (
    <div
      className={`${styles.colourPicker} ${
        controls[index].showPicker ? styles.showPicker : ""
      }`}
    >
      <HexColorPicker
        color={"#ffffff"}
        onChange={(e) => {
          updateControl(controls, setControl, index, {
            colour: e,
          });
        }}
      />
    </div>
  );
}

function paletteIcon() {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37.8 37.8"
    >
      <path d="M0,37.8v-9.5L18.95,9.35l-3.45-3.5,2.8-2.8,4.45,4.5L29.55,.7c.5-.47,1.02-.7,1.55-.7s1.03,.25,1.5,.75l4.45,4.45c.5,.47,.75,.97,.75,1.5,0,.53-.23,1.05-.7,1.55l-6.8,6.75,4.45,4.5-2.8,2.8-3.45-3.5L9.5,37.8H0Zm3.85-3.85h4.25L25.85,16.2l-4.25-4.25L3.85,29.7v4.25Z" />
    </svg>
  );
}

function updateControl(controls, setControls, index, newValue) {
  let newArr = [...controls];
  newArr[index] = newValue;
  setControls(newArr);
}

function togglePicker(controls, setControls, index) {
  let newArr = [...controls];
  newArr[index].showPicker = !newArr[index].showPicker;
  setControls(newArr);
  console.log(controls);
}
