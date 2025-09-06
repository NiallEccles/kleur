import {parseColorString} from "@/lib/parseColorString";
import {rgbToHex} from "@/lib/rgbToHex";

export const convertColorToHex = (colorStr: string): string => {
    const rgb = parseColorString(colorStr)
    if (!rgb) return "#000000"
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}
