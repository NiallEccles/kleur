import { useState } from "react";
import styles from "./gradient.module.css";
import CircularSlider from "@fseehawer/react-circular-slider";

export default function Gradient({ colours }) {
  const [copiedColour, setCopiedColour] = useState("");
  const [degres, setDegres] = useState("180deg");
  const [showRotate, setShowRotate] = useState(false);
  return (
    <div
      className={styles.gradient}
      style={{
        background: `linear-gradient(${degres}, ${colours.toString()}`,
      }}
    >
      <button
        className={styles.rotateIcon}
        onClick={() => {
          setShowRotate(!showRotate);
          setTimeout(() => {
            setCopiedColour("");
          }, 1500);
        }}
      >
        {rotateToggle()}
      </button>
      <button
        className={styles.copyIcon}
        onClick={() => {
          const gradient = `linear-gradient(${degres}, ${colours.toString()})`;
          navigator.clipboard.writeText(gradient);
          setCopiedColour(colours);
          setTimeout(() => {
            setCopiedColour("");
          }, 1500);
        }}
      >
        {copiedColour === colours ? successIcon() : copyIcon()}
      </button>
      <Rotate setDegres={setDegres} showRotate={showRotate} />
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

function successIcon() {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34.65 25.65"
    >
      <path d="M12.25,25.65L0,13.4l3.3-3.3,8.95,9L31.35,0l3.3,3.25L12.25,25.65Z" />
    </svg>
  );
}

function rotateToggle() {
  return (
    <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.15 42.15"><path d="M21.05,30.25c2.57,0,4.73-.88,6.5-2.65,1.77-1.77,2.65-3.93,2.65-6.5s-.88-4.73-2.65-6.5c-1.77-1.77-3.93-2.65-6.5-2.65-2.57,0-4.73,.88-6.5,2.65s-2.65,3.93-2.65,6.5c0,2.57,.88,4.73,2.65,6.5,1.77,1.77,3.93,2.65,6.5,2.65Zm0,11.9c-2.87,0-5.59-.55-8.18-1.65-2.58-1.1-4.82-2.6-6.72-4.5-1.9-1.9-3.4-4.14-4.5-6.73-1.1-2.58-1.65-5.31-1.65-8.17s.55-5.58,1.65-8.15c1.1-2.57,2.6-4.8,4.5-6.7,1.9-1.9,4.14-3.42,6.72-4.55C15.46,.57,18.18,0,21.05,0c2.9,0,5.62,.57,8.17,1.7,2.55,1.13,4.78,2.65,6.67,4.55,1.9,1.9,3.42,4.13,4.55,6.68,1.13,2.55,1.7,5.28,1.7,8.18,0,2.87-.57,5.59-1.7,8.17-1.13,2.58-2.65,4.83-4.55,6.73s-4.12,3.4-6.67,4.5c-2.55,1.1-5.27,1.65-8.17,1.65Zm0-21.05h0Zm-.05,16.5c4.53,0,8.42-1.6,11.67-4.8,3.25-3.2,4.88-7.08,4.88-11.65s-1.62-8.47-4.85-11.7c-3.23-3.23-7.12-4.85-11.65-4.85s-8.46,1.61-11.68,4.82c-3.22,3.22-4.82,7.11-4.82,11.68s1.61,8.5,4.82,11.7c3.22,3.2,7.09,4.8,11.63,4.8Z"/></svg>
  );
}

function Rotate({ setDegres, showRotate }) {
  const [value, setValue] = useState(180);
  return (
    <div
      className={`${styles.rotate} ${
        showRotate ? styles.showCircularControl : ""
      }`}
    >
      <span className={`font-bold ${styles.rotateValue}`}>{value}°</span>
      <CircularSlider
        min={0}
        max={360}
        direction={1}
        knobPosition="right"
        trackSize={6}
        knobSize={50}
        dataIndex={180}
        labelColor="#2b2b2b"
        width="100"
        height="100"
        knobColor="#2b2b2b"
        trackColor="#ffffff"
        hideLabelValue={true}
        label=""
        onChange={(v) => {
          setValue(v);
          setDegres(v + "deg");
        }}
      />
    </div>
  );
}
