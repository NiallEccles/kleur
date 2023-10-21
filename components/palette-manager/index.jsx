/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import styles from './palette-manager.module.css';
import RemoveIcon from '../icons/removeIcon';
import PaletteIcon from '../icons/paletteIcon';
import { hexStringSanitizer } from '../../utils/paletteUtils';

function PaletteManager({
  controls,
  setCurrentControl,
  removeControl,
  currentControl,
  previewGradient,
  updateSingleControl,
  isGradientPalette,
}) {
  function generateGradient(controlss) {
    return [controlss.map((control) => control)].toString();
  }

  function removeAndSetNewControlIndex(index) {
    const controlsIndexAfterDelete = controls.length - 2;
    removeControl(index);

    if (controlsIndexAfterDelete < currentControl) {
      setCurrentControl(controlsIndexAfterDelete);
    }
  }

  return (
    <div
      style={{
        background: `linear-gradient(${180}deg, ${generateGradient(
          controls,
        )})`,
      }}
      className={styles.palette}
      aria-label="Palette"
    >
      {controls.map((control, index) => (
        <div
          className={styles.sliver}
          style={{ background: isGradientPalette && hexStringSanitizer(control) }}
          aria-label="Palette Sliver"
          key={index}
        >
          <input
            type="text"
            value={control}
            style={{ opacity: previewGradient ? 0 : 1 }}
            onChange={(e) => {
              setCurrentControl(index);
              updateSingleControl(index, { colour: hexStringSanitizer(e.target.value) });
            }}
          />
          <div>
            {
                            !isGradientPalette && controls.length > 2
                            && (
                            <button
                              type="button"
                              style={{ opacity: previewGradient ? 0 : 1 }}
                              className={styles.icon}
                              onClick={() => {
                                removeAndSetNewControlIndex(index);
                              }}
                            >
                              <RemoveIcon />
                            </button>
                            )
                        }
            <button
              type="button"
              style={{ opacity: previewGradient ? 0 : 1 }}
              className={`${styles.icon} ${currentControl === index ? styles.active : ''}`}
              onClick={() => {
                setCurrentControl(index);
              }}
            >
              <PaletteIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaletteManager;
