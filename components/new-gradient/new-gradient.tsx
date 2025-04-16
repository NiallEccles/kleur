import { useState, useEffect, JSX } from "react";
import styles from "./new-gradient.module.css";
import ColourPicker from "../colour-picker/colour-picker";
import PaletteManager from "../palette-manager/palette-manager";
import { useUpdateControl } from "../../customHooks/useUpdateControl";
import { useRouter } from "next/router";
import {PAGES} from "../../public/constants";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

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
        <div className='flex gap-4 justify-center'>
            <div className='flex flex-row gap-4'>
                <div className='flex gap-4'>
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
                <div className='flex flex-col gap-2'>
                    <Input
                        type="name"
                        id="name"
                        placeholder="Gradient name"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        onClick={() => setPreviewGradient(!previewGradient)}
                        variant="outline"
                    >
                        Preview {previewGradient ? "On" : "Off"}
                    </Button>
                    <Button
                        onClick={createControl}
                        variant="outline"
                    >
                        Add Sliver
                    </Button>
                    <Button onClick={() => createPalette(controls, name, router)}>Create Gradient</Button>
                </div>
            </div>
        </div>
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

    const newGradient = [...prevLocalStorage, {controls, name, createdAt}];

    localStorage.setItem("gradients", JSON.stringify(newGradient));

    router.push(PAGES.HOME);
}
