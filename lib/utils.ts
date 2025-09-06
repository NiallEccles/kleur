import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { hexToHsl } from "./hexToHsl";
import { hslToHex } from "./hslToHex";
import { rgbToHex } from "./rgbToHex";
import { hexToRgb } from "./hexToRgb";
import { parseColorString } from "./parseColorString";
import { convertColorToHex } from "./convertColorToHex";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export { hexToHsl, hslToHex, rgbToHex, hexToRgb, parseColorString, convertColorToHex };