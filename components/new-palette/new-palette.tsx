import { useState, useEffect, JSX } from "react";
import styles from "./new-palette.module.css";
import { useUpdateControl } from "../../customHooks/useUpdateControl";
import PaletteManager from "../palette-manager/palette-manager";
import ColourPicker from "../colour-picker/colour-picker";
import { useRouter } from "next/router";
import { PAGES } from "../../public/constants";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

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
            <div className='flex gap-4 justify-center items-center'>
                <div className='flex flex-col gap-2'>
                    <PaletteManager
                        controls={controls}
                        setCurrentControl={setCurrentControl}
                        removeControl={removeControl}
                        currentControl={currentControl}
                        updateSingleControl={updateSingleControl}
                        isGradientPalette={false}
                        previewGradient={false}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Input
                        type="name"
                        id="name"
                        placeholder="Palette name"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {currentControl > -1 && (
                        <ColourPicker
                            controls={controls}
                            updateSingleControl={updateSingleControl}
                            currentControlIndex={currentControl}
                        />
                    )}
                    <Button onClick={() => createPalette(controls, name, router)}>Create Palette</Button>
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
        localStorage.getItem("palettes") === null
            ? []
            : JSON.parse(localStorage.getItem("palettes") as string);

    const createdAt = new Date().getTime();

    const newPalette = [...prevLocalStorage, { controls, name, createdAt }];

    localStorage.setItem("palettes", JSON.stringify(newPalette));

    router.push(PAGES.HOME);
}
