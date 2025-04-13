import { useState, useEffect, JSX } from "react";
import styles from "./new-gradient.module.css";
import ColourPicker from "../colour-picker/colour-picker";
import PaletteManager from "../palette-manager/palette-manager";
import { useUpdateControl } from "../../customHooks/useUpdateControl";
import { useRouter } from "next/router";
import {PAGES} from "../../public/constants";

// Type for individual control color (e.g., a hex string)
type Control = string;

export default function NewGradient(): JSX.Element {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
        createControl,
    } = useUpdateControl(["#E23E57", "#88304E", "#522546", "#311D3F"]);

    const [currentControl, setCurrentControl] = useState<number>(0);
    const [previewGradient, setPreviewGradient] = useState<boolean>(false);
    const [name, setName] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="my-8 py-5 sm:py-15 rounded-3xl" />
            <div className={styles.paletteContainer}>
                <div className={styles.options}>
                    <input
                        type="text"
                        placeholder="Gradient name"
                        className="input w-full font-semibold max-w-xs bg-gray-300 text-black placeholder-gray-800"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        className={`btn btn-active mt-4 w-auto ${
                            previewGradient ? "" : "btn-ghost"
                        }`}
                        onClick={() => setPreviewGradient(!previewGradient)}
                    >
                        Preview {previewGradient ? "On" : "Off"}
                    </button>
                    <button
                        className={`btn btn-active btn-ghost mt-4 w-full ${styles.addIcon}`}
                        onClick={createControl}
                    >
                        Add Sliver
                    </button>
                    <button
                        className={`btn mt-4 w-full ${styles.createButton}`}
                        onClick={() => createPalette(controls, name, router)}
                    >
                        Create Gradient
                    </button>
                </div>

                <div className={styles.colourPickerContainer}>
                    <PaletteManager
                        controls={controls}
                        setCurrentControl={setCurrentControl}
                        removeControl={removeControl}
                        currentControl={currentControl}
                        updateSingleControl={updateSingleControl}
                        previewGradient={previewGradient}
                        isGradientPalette={true}
                    />

                    {currentControl > -1 && (
                        <ColourPicker
                            controls={controls}
                            updateSingleControl={updateSingleControl}
                            currentControlIndex={currentControl}
                        />
                    )}
                </div>
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
        localStorage.getItem("gradients") === null
            ? []
            : JSON.parse(localStorage.getItem("gradients") as string);

    const createdAt = new Date().getTime();

    const newGradient = [...prevLocalStorage, { controls, name, createdAt }];

    localStorage.setItem("gradients", JSON.stringify(newGradient));

    router.push(PAGES.HOME);
}
