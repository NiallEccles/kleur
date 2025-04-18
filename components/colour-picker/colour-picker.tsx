import styles from './colour-picker.module.css';
import { HexColorPicker } from "react-colorful";

type ColourPickerProps = {
    controls: string[];
    updateSingleControl: (index: number, color: string) => void;
    currentControlIndex: number;
};

function ColourPicker({ controls, updateSingleControl, currentControlIndex }: ColourPickerProps) {
    return (
        <div
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
