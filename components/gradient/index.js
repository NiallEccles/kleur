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
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 43.75 42.8"
    >
      <path d="M21.75,41.45L3.5,23.15h6.5l15.05,15.1h0l10.95-10.9h-5.8v-4.6h13.55v13.6h-4.55v-5.8l-10.95,10.9c-.9,.9-1.98,1.35-3.25,1.35-1.27,0-2.35-.45-3.25-1.35ZM0,20V6.4H4.6v5.75L15.45,1.35c.9-.9,1.98-1.35,3.23-1.35s2.32,.45,3.22,1.35l18.4,18.25h-6.5L18.65,4.55h0L7.8,15.4h5.8v4.6H0Z" />
    </svg>
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
