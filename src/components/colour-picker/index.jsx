import React from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from './colour-picker.module.css';

function ColourPicker({
// eslint-disable-next-line react/prop-types
  controls, updateSingleControl, currentControlIndex,
}) {
  return (
    <div
      className={`${styles.colourPicker} ${
        currentControlIndex > -1 ? styles.showPicker : ''
      }`}
    >
      <HexColorPicker
        color={controls[currentControlIndex] ? controls[currentControlIndex] : '#ffffff'}
        onChange={(e) => {
          updateSingleControl(
            currentControlIndex,
            e.includes('NaN') ? '#ffffff' : e,
          );
        }}
      />
    </div>
  );
}

export default ColourPicker;
