import React, { useState } from 'react';
import styles from './palette.module.css';

/* eslint-disable react/prop-types */
/* eslint-disable no-use-before-define */
export default function Palette({ colours, name }) {
  const [copiedColour, setCopiedColour] = useState('');
  return (
    <div className={styles.palette} aria-label="Palette">
      <div>
        {colours.map((colour) => (
          <div
            className={styles.sliver}
            style={{ background: colour }}
            key={colour}
            aria-label="Palette Sliver"
          >
            <span>{colour}</span>
            <button
              type="button"
              className={styles.copyIcon}
              aria-label="Copy to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(colour);
                setCopiedColour(colour);
                setTimeout(() => {
                  setCopiedColour('');
                }, 1500);
              }}
            >
              {copiedColour === colour ? successIcon() : copyIcon()}
            </button>
          </div>
        ))}
      </div>
      {
                name ? <div className={styles.sliver}><span>{name}</span></div> : null
            }
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
      <path
        d="M12,36.2c-1.27,0-2.34-.46-3.23-1.38s-1.33-1.97-1.33-3.17V4.55c0-1.2,.44-2.26,1.33-3.17,.88-.92,1.96-1.38,3.23-1.38h21.05c1.27,0,2.35,.46,3.25,1.38,.9,.92,1.35,1.97,1.35,3.17V31.65c0,1.2-.45,2.26-1.35,3.17s-1.98,1.38-3.25,1.38H12Zm0-4.55h21.05V4.55H12V31.65h0Zm-7.4,11.95c-1.27,0-2.35-.46-3.25-1.38s-1.35-1.98-1.35-3.17V9.6H4.6v29.45H27.55v4.55H4.6ZM12,4.55h0V31.65h0V4.55h0Z"
      />
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
