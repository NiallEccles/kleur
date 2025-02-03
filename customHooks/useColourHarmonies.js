function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generateColorHarmonies(hex) {
    const rgbToHsl = (r, g, b) => {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }
        return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    };

    const hexToRgb = hex => {
        hex = hex.replace(/^#/, '');
        let bigint = parseInt(hex, 16);
        return [bigint >> 16 & 255, bigint >> 8 & 255, bigint & 255];
    };

    let [h, s, l] = rgbToHsl(...hexToRgb(hex));

    return {
        complementary: hslToHex((h + 180) % 360, s, l),
        analogous: [hslToHex((h + 30) % 360, s, l), hslToHex((h - 30 + 360) % 360, s, l)],
        triadic: [hslToHex((h + 120) % 360, s, l), hslToHex((h - 120 + 360) % 360, s, l)],
        monochromatic: [hslToHex(h, s, Math.max(10, l - 20)), hslToHex(h, s, Math.min(90, l + 20))]
    };
}

export const useColourHarmonies = (hex) => {
    return generateColorHarmonies(hex);
};

export default useColourHarmonies;