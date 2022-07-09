import { useState } from "react";
import styles from "./new-palette.module.css";
import {useUpdateControl} from "../../customHooks/useUpdateControl";
import PaletteManager from "../palette-manager";
import ColourPicker from "../colour-picker";
import { useRouter } from 'next/router';
import { PAGES } from "/public/shared.constants";

export default function NewPalette() {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
    } = useUpdateControl([
        "#1FAB89",
        "#62D2A2",
        "#9DF3C4",
        "#D7FBE8",
    ]);

    const [currentControl, setCurrentControl] = useState(0);

    const router = useRouter();

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
                    isGradientPalette
                />
                <button
                    className={`btn btn-ghost mt-4 w-full ${styles.addIcon}`}
                    onClick={() => createPalette(controls, router)}
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

function createPalette(controls, router) {
    console.log(controls);
    const prevLocalStorage =
		localStorage.getItem("palettes") === null
			? []
			: JSON.parse(localStorage.getItem("palettes"));

	const createdAt = new Date().getTime();

	const newPalette = [
		...prevLocalStorage,
		controls
	];
    
    localStorage.setItem("palettes", JSON.stringify(newPalette));

    router.push(PAGES.HOME);
}
