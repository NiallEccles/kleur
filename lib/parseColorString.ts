import {hexToRgb} from "@/lib/hexToRgb";
import {hslToHex} from "@/lib/hslToHex";

export const parseColorString = (colorStr: string): [number, number, number] | null => {
    // Remove whitespace
    colorStr = colorStr.trim()

    // Hex format
    if (colorStr.startsWith('#')) {
        if (colorStr.length === 7) {
            return hexToRgb(colorStr)
        }
    }

    // RGB format
    const rgbMatch = colorStr.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (rgbMatch) {
        return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
    }

    // HSL format
    const hslMatch = colorStr.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/)
    if (hslMatch) {
        const h = parseInt(hslMatch[1])
        const s = parseInt(hslMatch[2])
        const l = parseInt(hslMatch[3])
        const hex = hslToHex(h, s, l)
        return hexToRgb(hex)
    }

    return null
}
