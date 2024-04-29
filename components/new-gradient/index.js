import {useState} from "react";
import styles from "./new-gradient.module.css";
import ColourPicker from "../colour-picker";
import PaletteManager from "../palette-manager";
import {useUpdateControl} from "../../customHooks/useUpdateControl";
import {useRouter} from "next/router";
import {PAGES} from "/public/shared.constants";
import {motion} from "framer-motion";

export default function NewGradient() {
    const {
        controls,
        setControls,
        updateSingleControl,
        removeControl,
        createControl,
    } = useUpdateControl(["#E23E57", "#88304E", "#522546", "#311D3F"]);

    const [currentControl, setCurrentControl] = useState(0);

    const [previewGradient, setPreviewGradient] = useState(false);

    const [name, setName] = useState(null);

    const router = useRouter();

    const [isVisible, setIsVisible] = useState(false);

    setTimeout(() => {
        setIsVisible(true);
    }, 300);

    return (
        <>
            <motion.div initial={false} animate={{opacity: isVisible ? 1 : 0}}>
                <div className="my-8 py-5 sm:py-15 rounded-3xl">
                </div>
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
                            // onMouseDown={() => setPreviewGradient(true)}
                            // onMouseUp={() => setPreviewGradient(false)}
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
                            setControls={setControls}
                            currentControl={currentControl}
                            updateSingleControl={updateSingleControl}
                            previewGradient={previewGradient}
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

function previewOff() {
    return (
        <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 45.9 40.65"
        >
            <path
                d="M39.25,40.65l-7.65-7.55c-1.17,.47-2.49,.84-3.98,1.12s-3.04,.42-4.67,.42c-4.93,0-9.48-1.4-13.65-4.2-4.17-2.8-7.27-6.73-9.3-11.8,.57-1.73,1.48-3.46,2.75-5.17,1.27-1.72,2.72-3.38,4.35-4.98L.95,2.5,3.35,0,41.5,38.15l-2.25,2.5Zm-16.3-13.65c.4,0,.81-.05,1.23-.15,.42-.1,.76-.2,1.02-.3l-10.25-10.15c-.07,.33-.14,.7-.23,1.1-.08,.4-.13,.78-.12,1.15,0,2.37,.82,4.35,2.45,5.95,1.63,1.6,3.6,2.4,5.9,2.4Zm15,2.4l-7.45-7.45c.27-.4,.47-.92,.6-1.55,.13-.63,.2-1.22,.2-1.75,0-2.33-.81-4.31-2.42-5.92-1.62-1.62-3.59-2.43-5.92-2.43-.57,0-1.12,.06-1.65,.18-.53,.12-1.08,.31-1.65,.57l-6.4-6.45c1.13-.47,2.64-.91,4.53-1.32,1.88-.42,3.69-.62,5.42-.62,4.8,0,9.27,1.4,13.42,4.2,4.15,2.8,7.24,6.73,9.28,11.8-.8,2.2-1.9,4.2-3.3,6-1.4,1.8-2.95,3.38-4.65,4.75Zm-11.2-11.25l-3.65-3.6c.4-.27,.89-.38,1.48-.32,.58,.05,1.11,.24,1.58,.57,.43,.43,.73,.91,.88,1.43,.15,.52,.06,1.16-.28,1.92Z"/>
        </svg>
    );
}

function previewOn() {
    return (
        <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45.9 32">
            <path
                d="M22.95,24.35c2.33,0,4.31-.82,5.92-2.45,1.62-1.63,2.42-3.6,2.42-5.9s-.82-4.31-2.45-5.92c-1.63-1.62-3.6-2.43-5.9-2.43-2.33,0-4.31,.82-5.92,2.45-1.62,1.63-2.43,3.6-2.43,5.9,0,2.33,.82,4.31,2.45,5.92,1.63,1.62,3.6,2.43,5.9,2.43Zm0-3.55c-1.33,0-2.47-.48-3.4-1.42-.93-.95-1.4-2.07-1.4-3.38s.48-2.47,1.42-3.4c.95-.93,2.07-1.4,3.38-1.4s2.47,.48,3.4,1.42c.93,.95,1.4,2.07,1.4,3.38,0,1.33-.48,2.47-1.42,3.4-.95,.93-2.07,1.4-3.38,1.4Zm0,11.2c-5.03,0-9.61-1.48-13.73-4.45-4.12-2.97-7.19-6.82-9.22-11.55C2.03,11.27,5.11,7.42,9.22,4.45,13.34,1.48,17.92,0,22.95,0s9.61,1.48,13.72,4.45c4.12,2.97,7.19,6.82,9.23,11.55-2.03,4.73-5.11,8.58-9.23,11.55-4.12,2.97-8.69,4.45-13.72,4.45Z"/>
        </svg>
    );
}
