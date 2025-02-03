import {useState} from "react";
import styles from "./new-radial-gradient.module.css";
import ColourPicker from "../colour-picker";
import PaletteManager from "../palette-manager";
import {useUpdateControl} from "../../customHooks/useUpdateControl";
import {useRouter} from "next/router";
import {PAGES} from "/public/shared.constants";
import {motion} from "framer-motion";
import {hexStringSanitizer} from "../../utils/paletteUtils";
import RemoveIcon from "../icons/removeIcon";
import PaletteIcon from "../icons/paletteIcon";

export default function NewRadialGradient() {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
        createControl,
    } = useUpdateControl(["#E23E57", "#88304E", "#522546", "#311D3F"]);

    const [currentControl, setCurrentControl] = useState(null);

    const [shouldOpen, setShouldOpen] = useState(false);

    const [previewGradient, setPreviewGradient] = useState(false);

    const [name, setName] = useState(null);

    const router = useRouter();

    const [isVisible, setIsVisible] = useState(false);

    setTimeout(() => {
        setIsVisible(true);
    }, 300);

    const generateStyles = () => {
        return `radial-gradient(${[controls.map((control) => control)].toString()}`;
    };

    function removeAndSetNewControlIndex(index){
        const controlsIndexAfterDelete = controls.length - 2
        removeControl(index);

        if(controlsIndexAfterDelete < currentControl){
            setCurrentControl(controlsIndexAfterDelete)
        }

    }

    function hidePicker() {
        setCurrentControl(null);
        setShouldOpen(false);
    }

    return (
        <>
            <motion.div initial={false} animate={{opacity: isVisible ? 1 : 0}} className={styles.container}>
                <div className={styles.side}>
                    <input
                        type="text"
                        placeholder="Gradient name"
                        className="input w-full font-semibold max-w-xs bg-gray-300 text-black placeholder-gray-800 mb-3"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className={styles.palette}>
                        {
                            controls.map((control, index) => (
                                <div className={styles.sliver}
                                     style={{background: hexStringSanitizer(control)}}
                                     aria-label="Palette Sliver"
                                     key={index}>
                                    <input
                                        type="text"
                                        value={control}
                                        onChange={(e) => {
                                            setCurrentControl(index);
                                            updateSingleControl(index, hexStringSanitizer(e.target.value));
                                        }}
                                    />
                                    <button
                                        style={{opacity: previewGradient ? 0 : 1}}
                                        className={styles.icon}
                                        onClick={() => {
                                            removeAndSetNewControlIndex(index)
                                        }}
                                    >
                                        <RemoveIcon/>
                                    </button>
                                    <button
                                        style={{opacity: previewGradient ? 0 : 1}}
                                        className={`${styles.icon} ${currentControl === index ? styles.active : ''}`}
                                        onClick={() => {
                                            if (currentControl === index) {
                                                hidePicker();
                                            } else {
                                                setCurrentControl(index);
                                                setShouldOpen(true);
                                            }
                                        }}
                                    >
                                        <PaletteIcon/>
                                    </button>
                                </div>
                            ))
                        }
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
                <div className={styles.gradientDisplay} style={{background: generateStyles()}}>
                    <div className={styles.pickerContainer}>
                        {currentControl > -1 && shouldOpen && (
                            <ColourPicker
                                controls={controls}
                                updateSingleControl={updateSingleControl}
                                currentControlIndex={currentControl}
                                onChangeCallback={() => setShouldOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

function createPalette(controls, name, router) {
    console.log(controls);
    const prevLocalStorage =
        localStorage.getItem("gradients") === null
            ? []
            : JSON.parse(localStorage.getItem("gradients"));

    const createdAt = new Date().getTime();

    const newGradient = [...prevLocalStorage, {controls, name}];

    localStorage.setItem("gradients", JSON.stringify(newGradient));

    router.push(PAGES.HOME);
}
