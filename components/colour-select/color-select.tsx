import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerEyeDropper, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/shadcn-io/color-picker'; // Adjust the import path as needed
import { useState } from 'react';

function ColorSelect() {
    const [colorValue, setColorValue] = useState([0, 0, 0, 1]); // Example initial RGBA
    const [colorMode, setColorMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');

    const handleColorChange = (newRgba: number[]) => {
        setColorValue(newRgba);
        console.log("New RGBA:", newRgba);
    };

    const handleModeChange = (newMode: 'hex' | 'rgb' | 'hsl') => {
        setColorMode(newMode);
        console.log("New Mode:", newMode);
    };

    return (
        <ColorPicker
            value={colorValue}
            onChange={(e) => {
                console.log(e)}}
            mode={colorMode} // Pass the controlled mode
            // If you wanted an uncontrolled default mode, you could use defaultMode="rgb" instead
        >
            <div className="flex flex-col gap-4">
                <ColorPickerSelection className="h-60 w-60" />
                <div className="flex flex-col gap-4">
                    <ColorPickerHue />
                    <ColorPickerAlpha />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <ColorPickerEyeDropper />
                <ColorPickerOutput /> {/* This component still allows internal mode changes */}
                <ColorPickerFormat />
            </div>
            <button onClick={() => setColorMode('rgb')}>Set Mode to RGB</button> {/* Example of changing mode externally */}
            <button onClick={() => setColorMode('hsl')}>Set Mode to HSL</button>
        </ColorPicker>
    );
}

export default ColorSelect;