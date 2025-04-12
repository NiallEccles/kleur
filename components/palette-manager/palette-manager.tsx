import styles from "./palette-manager.module.css";
import RemoveIcon from "../icons/removeIcon";
import PaletteIcon from "../icons/paletteIcon";
import {hexStringSanitizer} from "../../utils/paletteUtils";

type PaletteManagerProps = {
    controls: string[];
    setCurrentControl: (index: number) => void;
    removeControl: (index: number) => void;
    currentControl: number;
    previewGradient: boolean;
    updateSingleControl: (index: number, value: { colour: string }) => void;
    isGradientPalette: boolean;
};

const PaletteManager = ({
                            controls,
                            setCurrentControl,
                            removeControl,
                            currentControl,
                            previewGradient,
                            updateSingleControl,
                            isGradientPalette
                        }: PaletteManagerProps) => {

    function generateGradient(controls: string[]) {
        return [controls.map((control) => control)].toString();
    }

    function removeAndSetNewControlIndex(index: number){
        const controlsIndexAfterDelete = controls.length - 2
        removeControl(index);

        if(controlsIndexAfterDelete < currentControl){
            setCurrentControl(controlsIndexAfterDelete)
        }

    }

    return (
        <div
            style={{
                background: `linear-gradient(${180}deg, ${generateGradient(controls)})`,
            }}
            className={styles.palette}
            aria-label="Palette"
        >
            {controls.map((control, index) => (
                <div
                    className={styles.sliver}
                    style={isGradientPalette ? { background: hexStringSanitizer(control) } : undefined}
                    aria-label="Palette Sliver"
                    key={index}
                >
                    <input
                        type="text"
                        value={control}
                        style={{ opacity: previewGradient ? 0 : 1 }}
                        onChange={(e) => {
                            setCurrentControl(index);
                            updateSingleControl( index, {  colour: hexStringSanitizer(e.target.value) });
                        }}
                    />
                    <div>
                        {
                            !isGradientPalette && controls.length > 2 &&
                            <button
                                style={{ opacity: previewGradient ? 0 : 1 }}
                                className={styles.icon}
                                onClick={() => {
                                    removeAndSetNewControlIndex(index)
                                }}
                            >
                                <RemoveIcon />
                            </button>
                        }
                        <button
                            style={{ opacity: previewGradient ? 0 : 1 }}
                            className={`${styles.icon} ${currentControl === index ? styles.active : ''}`}
                            onClick={() => setCurrentControl(index)}
                        >
                            <PaletteIcon />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PaletteManager;