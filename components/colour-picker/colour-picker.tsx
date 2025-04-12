import styles from './colour-picker.module.css';
import { HexColorPicker } from "react-colorful";

type ColourPickerProps = {
    controls: string[];
    updateSingleControl: (index: number, color: string) => void;
    currentControlIndex: number;
    color: string; // Optional: this prop isn't used in the component
};

function ColourPicker({ controls, updateSingleControl, currentControlIndex, color }: ColourPickerProps) {
    return (
        <div
            className={`${styles.colourPicker} ${
                currentControlIndex > -1 ? styles.showPicker : ""
            }`}
        >
            <HexColorPicker
                color={controls[currentControlIndex] ? controls[currentControlIndex] : '#ffffff'}
                onChange={(e) => {
                    updateSingleControl(
                        currentControlIndex,
                        e.includes("NaN") ? "#ffffff" : e
                    );
                }}
            />
        </div>
    );
}

export default ColourPicker;
