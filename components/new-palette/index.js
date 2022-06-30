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
        { colour: "#1FAB89" },
        { colour: "#62D2A2" },
        { colour: "#9DF3C4" },
        { colour: "#D7FBE8" },
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
                    isGradientPallete
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
		localStorage.getItem("palletes") === null
			? []
			: JSON.parse(localStorage.getItem("palletes"));

	const createdAt = new Date().getTime();

	const newPallete = [
		...prevLocalStorage,
		{
			createdAt,
			pallete: controls,
		},
	];
    
    localStorage.setItem("palletes", JSON.stringify(newPallete));

    router.push(PAGES.HOME);
}
