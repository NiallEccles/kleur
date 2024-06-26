import {useState} from "react";
import styles from "./new-palette.module.css";
import {useUpdateControl} from "../../customHooks/useUpdateControl";
import PaletteManager from "../palette-manager";
import ColourPicker from "../colour-picker";
import {useRouter} from "next/router";
import {PAGES} from "/public/shared.constants";
import {motion} from "framer-motion";

export default function NewPalette() {
    const {controls, setControls, updateSingleControl, removeControl} =
        useUpdateControl(["#1FAB89", "#62D2A2", "#9DF3C4", "#D7FBE8"]);

    const [currentControl, setCurrentControl] = useState(0);

    const router = useRouter();

    const [name, setName] = useState(null);

    const [isVisible, setIsVisible] = useState(false);

    setTimeout(() => {
        setIsVisible(true);
    }, 300);

    return (
        <>
            <motion.div initial={false} animate={{opacity: isVisible ? 1 : 0}}>
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
                        <input
                            type="text"
                            placeholder="Palette name"
                            className="input w-full font-semibold mt-5 max-w-xs bg-gray-300 text-black placeholder-gray-800"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button
                            className={`btn mt-4 w-full ${styles.addIcon}`}
                            onClick={() => createPalette(controls, name, router)}
                        >
                            Create Palette
                        </button>
                    </div>
                    {currentControl > -1 && (
                        <ColourPicker
                            controls={controls}
                            updateSingleControl={updateSingleControl}
                            currentControlIndex={currentControl}
                        />
                    )}
                </div>
            </motion.div>
        </>
    );
}

function createPalette(controls, name, router) {
    console.log(controls);
    const prevLocalStorage =
        localStorage.getItem("palettes") === null
            ? []
            : JSON.parse(localStorage.getItem("palettes"));

    const createdAt = new Date().getTime();

    const newPalette = [...prevLocalStorage, {controls, name}];

    localStorage.setItem("palettes", JSON.stringify(newPalette));

    router.push(PAGES.HOME);
}
