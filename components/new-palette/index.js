import { useState } from "react";
import styles from "./new-palette.module.css";
import { HexColorPicker } from "react-colorful";

export default function NewPalette() {
  const [controls, setControl] = useState([
    { colour: "#", showPicker: false },
    { colour: "#", showPicker: false },
    { colour: "#", showPicker: false },
    { colour: "#", showPicker: false },
  ]);
  const [currentControl, setCurrentControl] = useState(-1);
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
                setCurrentControl(index);
                updateControl(controls, setControl, index, {
                  colour: e.target.value,
                });
              }}
            />
            <button
              className={styles.paletteIcon}
              onClick={() => {
                setCurrentControl(index);
              }}
            >
              {paletteIcon()}
            </button>
          </div>
        ))}
      </div>
      <button
        className={`btn btn-ghost mt-4 w-full ${styles.addIcon}`}
        onClick={() => createPalette(controls)}
      >
        Create Palette
      </button>
      {colourPicker(controls, setControl, currentControl)}
    </div>
  );
}

function colourPicker(controls, setControl, currentControl, color) {
  return currentControl > -1 ? (
    <div
      className={`${styles.colourPicker} ${
        controls[currentControl].showPicker ? styles.showPicker : ""
      }`}
    >
      <HexColorPicker
        color={controls[currentControl].colour}
        onChange={(e) => {
          updateControl(controls, setControl, currentControl, {
            colour: e.includes("NaN") ? "#ffffff" : e,
          });
        }}
      />
    </div>
  ) : (
    ""
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

function createPalette(controls) {
  console.log(controls);
}
