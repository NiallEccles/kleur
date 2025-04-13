import {JSX, useState } from "react";
import styles from "./new-radial-gradient.module.css";
import ColourPicker from "../colour-picker/colour-picker";
import PaletteManager from "../palette-manager/palette-manager";
import { useUpdateControl } from "../../customHooks/useUpdateControl";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { hexStringSanitizer } from "../../utils/paletteUtils";
import RemoveIcon from "../icons/removeIcon";
import PaletteIcon from "../icons/paletteIcon";
import {PAGES} from "../../public/constants";

type ControlType = string;

export default function NewRadialGradient(): JSX.Element {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
        createControl,
    } = useUpdateControl(["#E23E57", "#88304E", "#522546", "#311D3F"]);

    const [currentControl, setCurrentControl] = useState<number | null>(null);
    const [shouldOpen, setShouldOpen] = useState<boolean>(false);
    const [previewGradient, setPreviewGradient] = useState<boolean>(false);
    const [name, setName] = useState<string | null>(null);

    const router = useRouter();
    const [isVisible, setIsVisible] = useState<boolean>(false);

    setTimeout(() => {
        setIsVisible(true);
    }, 300);

    const generateStyles = (): string => {
        return `radial-gradient(${controls.map(hexStringSanitizer).join(", ")})`;
    };

    function removeAndSetNewControlIndex(index: number): void {
        const controlsIndexAfterDelete = controls.length - 2;
        removeControl(index);

        if (currentControl !== null && controlsIndexAfterDelete < currentControl) {
            setCurrentControl(controlsIndexAfterDelete);
        }
    }

    function hidePicker(): void {
        setCurrentControl(null);
        setShouldOpen(false);
    }

    return (
        <>
                <div className={styles.side}>
                    <input
                        type="text"
                        placeholder="Gradient name"
                        className="input w-full font-semibold max-w-xs bg-gray-300 text-black placeholder-gray-800 mb-3"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className={styles.palette}>
                        {controls.map((control: string, index: number) => (
                            <div
                                className={styles.sliver}
                                style={{ background: hexStringSanitizer(control) }}
                                aria-label="Palette Sliver"
                                key={index}
                            >
                                <input
                                    type="text"
                                    value={control}
                                    onChange={(e) => {
                                        setCurrentControl(index);
                                        updateSingleControl(index, hexStringSanitizer(e.target.value));
                                    }}
                                />
                                <button
                                    style={{ opacity: previewGradient ? 0 : 1 }}
                                    className={styles.icon}
                                    onClick={() => removeAndSetNewControlIndex(index)}
                                >
                                    <RemoveIcon />
                                </button>
                                <button
                                    style={{ opacity: previewGradient ? 0 : 1 }}
                                    className={`${styles.icon} ${currentControl === index ? styles.active : ""}`}
                                    onClick={() => {
                                        if (currentControl === index) {
                                            hidePicker();
                                        } else {
                                            setCurrentControl(index);
                                            setShouldOpen(true);
                                        }
                                    }}
                                >
                                    <PaletteIcon />
                                </button>
                            </div>
                        ))}
                    </div>
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
                <div
                    className={styles.gradientDisplay}
                    style={{ background: generateStyles() }}
                >
                    <div className={styles.pickerContainer}>
                        {typeof currentControl === "number" && shouldOpen && (
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
    console.log(controls);
    const prevLocalStorage =
        localStorage.getItem("gradients") === null
            ? []
            : JSON.parse(localStorage.getItem("gradients") as string);

    const createdAt = new Date().getTime();

    const newGradient = [...prevLocalStorage, { controls, name, createdAt }];

    localStorage.setItem("gradients", JSON.stringify(newGradient));

    router.push(PAGES.HOME);
}
