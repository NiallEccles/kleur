import styles from "./palette-manager.module.css";
import RemoveIcon from "../icons/removeIcon";
import PaletteIcon from "../icons/paletteIcon";
import {hexStringSanitizer} from "../../utils/paletteUtils";

const PalleteManager = ({
                            controls,
                            setCurrentControl,
                            removeControl,
                            currentControl,
                            previewGradient,
                            updateSingleControl,
                            isGradientPallete
                        }) => {

    function generateGradient(controls) {
        return [controls.map((control) => control.colour)].toString();
    }

    function removeAndSetNewControlIndex(index){
        const controlsIndexAfterDelete = controls.length - 2
        removeControl(index);

        if(controlsIndexAfterDelete < currentControl){
            setCurrentControl(controlsIndexAfterDelete)
        }

    }

    return (
        <div
            style={{
                background: `linear-gradient(${180}deg, ${generateGradient(
                    controls
                )})`,
            }}
            className={styles.palette}
            aria-label="Palette"
        >
            {controls.map((control, index) => (
                <div
                    className={styles.sliver}
                    style={isGradientPallete && {background: hexStringSanitizer(control.colour)}}
                    aria-label="Palette Sliver"
                    key={index}
                >
                    <input
                        type="text"
                        value={control.colour}
                        style={{ opacity: previewGradient ? 0 : 1 }}
                        onChange={(e) => {
                            setCurrentControl(index);
                            updateSingleControl( index, {  colour: hexStringSanitizer(e.target.value) });
                        }}
                    />
                    <div>
                        {
                            !isGradientPallete && controls.length > 2 &&
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
                            onClick={() => {
                                setCurrentControl(index);
                            }}
                        >
                            <PaletteIcon />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PalleteManager;
