import { useState, useEffect, JSX } from "react";
import styles from "./new-palette.module.css";
import { useUpdateControl } from "../../customHooks/useUpdateControl";
import PaletteManager from "../palette-manager/palette-manager";
import ColourPicker from "../colour-picker/colour-picker";
import { useRouter } from "next/router";
import { PAGES } from "../../public/constants";

// Define the shape of a control if needed (here assumed to be just a hex string)
type Control = string;

export default function NewPalette(): JSX.Element {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
    } = useUpdateControl(["#1FAB89", "#62D2A2", "#9DF3C4", "#D7FBE8"]);

    const [currentControl, setCurrentControl] = useState<number>(0);
    const [name, setName] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className={styles.paletteContainer}>
                <div>
                    <PaletteManager
                        controls={controls}
                        setCurrentControl={setCurrentControl}
                        removeControl={removeControl}
                        currentControl={currentControl}
                        updateSingleControl={updateSingleControl}
                        isGradientPalette={false}
                        previewGradient={false}
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
        </>
    );
}

function createPalette(
    controls: string[],
    name: string | null,
    router: ReturnType<typeof useRouter>
): void {
    const prevLocalStorage =
        localStorage.getItem("palettes") === null
            ? []
            : JSON.parse(localStorage.getItem("palettes") as string);

    const createdAt = new Date().getTime();

    const newPalette = [...prevLocalStorage, { controls, name, createdAt }];

    localStorage.setItem("palettes", JSON.stringify(newPalette));

    router.push(PAGES.HOME);
}
