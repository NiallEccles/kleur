import { useState } from "react";
import styles from "./new-palette.module.css";

// const controls = [{ colour: "#E23E57" }, { colour: "#88304E" }];

export default function NewPalette() {
  const [controls, setControl] = useState([
    { colour: "#E23E57" },
    { colour: "#88304E" },
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
            <button className={styles.copyIcon}>{copyIcon()}</button>
          </div>
        ))}
      </div>
      <button
        className={`btn btn-ghost mt-4 w-full ${styles.addIcon}`}
        onClick={() => {
          newControl(controls, setControl);
        }}
      >
        {controls.length < 4 ? "Add Sliver" : "Max Slivers Reached"} {addIcon()}
      </button>
    </div>
  );
}

function copyIcon() {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 37.65 43.6"
    >
      <path d="M12,36.2c-1.27,0-2.34-.46-3.23-1.38s-1.33-1.97-1.33-3.17V4.55c0-1.2,.44-2.26,1.33-3.17,.88-.92,1.96-1.38,3.23-1.38h21.05c1.27,0,2.35,.46,3.25,1.38,.9,.92,1.35,1.97,1.35,3.17V31.65c0,1.2-.45,2.26-1.35,3.17s-1.98,1.38-3.25,1.38H12Zm0-4.55h21.05V4.55H12V31.65h0Zm-7.4,11.95c-1.27,0-2.35-.46-3.25-1.38s-1.35-1.98-1.35-3.17V9.6H4.6v29.45H27.55v4.55H4.6ZM12,4.55h0V31.65h0V4.55h0Z" />
    </svg>
  );
}

function addIcon() {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29.55 29.5"
    >
      <path d="M12.5,29.5v-12.45H0v-4.55H12.5V0h4.55V12.5h12.5v4.55h-12.5v12.45h-4.55Z" />
    </svg>
  );
}

function newControl(controls, setControl) {
  if (controls.length < 4) {
    let newArr = [...controls, { colour: "#" }];
    setControl(newArr);
  }
}

function updateControl(controls, setControls, index, newValue) {
  let newArr = [...controls];
  newArr[index] = newValue;
  setControls(newArr);
}
