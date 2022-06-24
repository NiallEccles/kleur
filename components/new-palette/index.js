import { useState } from "react";
import styles from "./new-palette.module.css";
import {useUpdateControl} from "../../customHooks/useUpdateControl";
import PaletteManager from "../palette-manager";
import ColourPicker from "../colour-picker";

export default function NewPalette() {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
    } = useUpdateControl([
        { colour: "#1FAB89" },
        { colour: "#62D2A2" },
        { colour: "#9DF3C4" },
        { colour: "#D7FBE8" },
    ]);

    const [currentControl, setCurrentControl] = useState(0);

    return (
        <div className={styles.paletteContainer}>
            <div>
                <PaletteManager
                    controls={controls}
                    setCurrentControl={setCurrentControl}
                    removeControl={removeControl}
                    setControls={setControls}
                    currentControl={currentControl}
                    updateSingleControl={updateSingleControl}
                    isGradientPallete
                />
                <button
                    className={`btn btn-ghost mt-4 w-full ${styles.addIcon}`}
                    onClick={() => createPalette(controls)}
                >
                    Create Palette
                </button>
            </div>
                {
                currentControl > -1 &&
                <ColourPicker
                    controls={controls}
                    updateSingleControl={updateSingleControl}
                    currentControlIndex={currentControl}
                />
            }
        </div>
    );
}

function createPalette(controls) {
    console.log(controls);
}
