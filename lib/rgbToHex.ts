export const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
        const hex = Math.round(c).toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
};