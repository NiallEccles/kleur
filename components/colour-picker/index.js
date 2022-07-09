import styles from './colour-picker.module.css'
import {HexColorPicker} from "react-colorful";

function ColourPicker({controls, updateSingleControl, currentControlIndex, color}) {

    return  (
        <div
            className={`${styles.colourPicker} ${
                currentControlIndex > -1 ? styles.showPicker : ""
            }`}
        >
            <HexColorPicker
                color={controls[currentControlIndex] ? controls[currentControlIndex] : '#ffffff'}
                onChange={(e) => {
                    updateSingleControl(currentControlIndex,
                        e.includes("NaN") ? "#ffffff" : e,
                    );
                }}
            />
        </div>
    )
}

export default ColourPicker;