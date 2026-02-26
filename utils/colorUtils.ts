import type { ColorValue, ColorSpace, HexColor, RgbColor, HslColor, OklchColor, CvdType, WcagResult } from '../types/color'

// ---------------------------------------------------------------------------
// Hex parsing / formatting helpers
// ---------------------------------------------------------------------------

function hexToRgbTuple(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]
}

function rgbTupleToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')
}

// ---------------------------------------------------------------------------
// sRGB gamma
// ---------------------------------------------------------------------------

function gammaEncode(v: number): number {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055
}

function gammaDecode(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

// ---------------------------------------------------------------------------
// Canonical: any ColorValue → linear sRGB [0,1] triple
// ---------------------------------------------------------------------------

export function toLinearSRGB(v: ColorValue): [number, number, number] {
  switch (v.space) {
    case 'hex': {
      const [r, g, b] = hexToRgbTuple(v.value)
      return [gammaDecode(r / 255), gammaDecode(g / 255), gammaDecode(b / 255)]
    }
    case 'rgb': {
      return [gammaDecode(v.r / 255), gammaDecode(v.g / 255), gammaDecode(v.b / 255)]
    }
    case 'hsl': {
      const hex = hslToHex(v.h, v.s, v.l)
      const [r, g, b] = hexToRgbTuple(hex)
      return [gammaDecode(r / 255), gammaDecode(g / 255), gammaDecode(b / 255)]
    }
    case 'oklch': {
      return oklchToLinearSRGB(v.l, v.c, v.h)
    }
  }
}

// ---------------------------------------------------------------------------
// OKLCH → linear sRGB conversion chain
// ---------------------------------------------------------------------------

function oklchToLinearSRGB(L: number, C: number, H: number): [number, number, number] {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  // Oklab → LMS (cube-root space) via M1⁻¹
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  // LMS³ → linear sRGB (combined M2⁻¹ · M1 matrix — Björn Ottosson)
  return [
     4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ]
}

// ---------------------------------------------------------------------------
// toHex — for use with react-colorful / canvas / CSS
// ---------------------------------------------------------------------------

export function toHex(v: ColorValue): string {
  switch (v.space) {
    case 'hex':
      return v.value
    case 'rgb':
      return rgbTupleToHex(v.r, v.g, v.b)
    case 'hsl':
      return hslToHex(v.h, v.s, v.l)
    case 'oklch': {
      const [lr, lg, lb] = oklchToLinearSRGB(v.l, v.c, v.h)
      const r = gammaEncode(Math.max(0, Math.min(1, lr))) * 255
      const g = gammaEncode(Math.max(0, Math.min(1, lg))) * 255
      const b = gammaEncode(Math.max(0, Math.min(1, lb))) * 255
      return rgbTupleToHex(r, g, b)
    }
  }
}

// ---------------------------------------------------------------------------
// toCss — CSS-valid string in native space
// ---------------------------------------------------------------------------

export function toCss(v: ColorValue): string {
  switch (v.space) {
    case 'hex':
      return v.value
    case 'rgb':
      return `rgb(${Math.round(v.r)} ${Math.round(v.g)} ${Math.round(v.b)})`
    case 'hsl':
      return `hsl(${Math.round(v.h)} ${Math.round(v.s)}% ${Math.round(v.l)}%)`
    case 'oklch':
      return `oklch(${v.l.toFixed(3)} ${v.c.toFixed(3)} ${v.h.toFixed(1)})`
  }
}

// ---------------------------------------------------------------------------
// HSL helpers
// ---------------------------------------------------------------------------

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const a = sN * Math.min(lN, 1 - lN)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lN - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(255 * color)
  }
  return rgbTupleToHex(f(0), f(8), f(4))
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rN = r / 255, gN = g / 255, bN = b / 255
  const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6
  else if (max === gN) h = ((bN - rN) / d + 2) / 6
  else h = ((rN - gN) / d + 4) / 6
  return [h * 360, s * 100, l * 100]
}

function linearSRGBToOklch(lr: number, lg: number, lb: number): [number, number, number] {
  // linear sRGB → LMS (Björn Ottosson M1)
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  // Cube root
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  // LMS^(1/3) → Oklab
  const L  =  0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a  =  1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bv =  0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  const C = Math.sqrt(a * a + bv * bv)
  let H = (Math.atan2(bv, a) * 180) / Math.PI
  if (H < 0) H += 360

  return [L, C, H]
}

// ---------------------------------------------------------------------------
// convertTo — space switching
// ---------------------------------------------------------------------------

export function convertTo(v: ColorValue, space: ColorSpace): ColorValue {
  if (v.space === space) return v

  const hex = toHex(v)
  const [r, g, b] = hexToRgbTuple(hex)

  switch (space) {
    case 'hex':
      return { space: 'hex', value: hex }
    case 'rgb':
      return { space: 'rgb', r, g, b }
    case 'hsl': {
      const [h, s, l] = rgbToHsl(r, g, b)
      return { space: 'hsl', h, s, l }
    }
    case 'oklch': {
      const lr = gammaDecode(r / 255)
      const lg = gammaDecode(g / 255)
      const lb = gammaDecode(b / 255)
      const [L, C, H] = linearSRGBToOklch(lr, lg, lb)
      return { space: 'oklch', l: L, c: C, h: H }
    }
  }
}

// ---------------------------------------------------------------------------
// WCAG contrast
// ---------------------------------------------------------------------------

export function relativeLuminance(v: ColorValue): number {
  const [r, g, b] = toLinearSRGB(v)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(v1: ColorValue, v2: ColorValue): number {
  const l1 = relativeLuminance(v1)
  const l2 = relativeLuminance(v2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function wcagResult(v1: ColorValue, v2: ColorValue): WcagResult {
  const ratio = contrastRatio(v1, v2)
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  }
}

// ---------------------------------------------------------------------------
// CVD simulation (Machado 2009 matrices)
// ---------------------------------------------------------------------------

const CVD_MATRICES: Record<string, number[][]> = {
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501,  0.047413],
    [-0.011820, 0.042940, 0.968881],
  ],
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281,  0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809,  0.147602],
    [0.004733, 0.691367,  0.303900],
  ],
}

export function simulateCvd(v: ColorValue, type: CvdType): ColorValue {
  if (type === 'none') return v

  const [lr, lg, lb] = toLinearSRGB(v)
  const m = CVD_MATRICES[type]

  const sr = m[0][0] * lr + m[0][1] * lg + m[0][2] * lb
  const sg = m[1][0] * lr + m[1][1] * lg + m[1][2] * lb
  const sb = m[2][0] * lr + m[2][1] * lg + m[2][2] * lb

  const r = Math.max(0, Math.min(255, Math.round(gammaEncode(Math.max(0, Math.min(1, sr))) * 255)))
  const g = Math.max(0, Math.min(255, Math.round(gammaEncode(Math.max(0, Math.min(1, sg))) * 255)))
  const b = Math.max(0, Math.min(255, Math.round(gammaEncode(Math.max(0, Math.min(1, sb))) * 255)))

  const simulatedHex: HexColor = { space: 'hex', value: rgbTupleToHex(r, g, b) }
  return convertTo(simulatedHex, v.space)
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export function generateRandom(space: ColorSpace): ColorValue {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  const hex: HexColor = { space: 'hex', value: rgbTupleToHex(r, g, b) }
  return convertTo(hex, space)
}

// ---------------------------------------------------------------------------
// Harmony palette generation
// ---------------------------------------------------------------------------

export type HarmonyType = 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'golden'
export type PalettePreset = 'vibrant' | 'muted' | 'pastel' | 'deep'

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function harmonyHues(type: HarmonyType, base: number, count: number): number[] {
  const mod360 = (n: number) => ((n % 360) + 360) % 360
  const jitter = (range: number) => (Math.random() - 0.5) * range

  switch (type) {
    case 'analogous': {
      // Tight arc of similar hues — the most "natural" feel
      const halfSpread = 20 + Math.random() * 20  // 20°–40° either side
      return Array.from({ length: count }, (_, i) => {
        const t = count > 1 ? i / (count - 1) : 0.5
        return mod360(base - halfSpread + t * 2 * halfSpread)
      })
    }
    case 'complementary': {
      // Alternate between base hue and its opposite, small jitter keeps it from looking mechanical
      const comp = mod360(base + 180)
      return Array.from({ length: count }, (_, i) =>
        mod360((i % 2 === 0 ? base : comp) + jitter(18))
      )
    }
    case 'triadic': {
      // Three roots 120° apart, cycled across count
      const roots = [base, mod360(base + 120), mod360(base + 240)]
      return Array.from({ length: count }, (_, i) =>
        mod360(roots[i % 3] + jitter(12))
      )
    }
    case 'split-complementary': {
      // Base + two flanking complements — more dynamic than plain complementary
      const roots = [base, mod360(base + 150), mod360(base + 210)]
      return Array.from({ length: count }, (_, i) =>
        mod360(roots[i % 3] + jitter(10))
      )
    }
    case 'golden': {
      // Golden angle (137.508°) — maximally spaced hues that never visually clash
      return Array.from({ length: count }, (_, i) => mod360(base + i * 137.508))
    }
  }
}

/**
 * Generate a harmonious palette of `count` colours in the requested colour space.
 * Pass `harmonyOverride` / `presetOverride` to pin a specific strategy or mood;
 * omit (or pass 'random') to have each picked at random.
 */
export function generateHarmonyPalette(
  count: number,
  space: ColorSpace,
  harmonyOverride?: HarmonyType | 'random',
  presetOverride?: PalettePreset | 'random',
): ColorValue[] {
  const harmonyType = (!harmonyOverride || harmonyOverride === 'random')
    ? pickRandom(['analogous', 'complementary', 'triadic', 'split-complementary', 'golden'] as const)
    : harmonyOverride
  const preset = (!presetOverride || presetOverride === 'random')
    ? pickRandom(['vibrant', 'muted', 'pastel', 'deep'] as const)
    : presetOverride
  const baseHue = Math.random() * 360

  const PRESETS: Record<PalettePreset, { lRange: [number, number]; cRange: [number, number] }> = {
    vibrant: { lRange: [0.50, 0.70], cRange: [0.18, 0.26] },
    muted:   { lRange: [0.55, 0.72], cRange: [0.06, 0.13] },
    pastel:  { lRange: [0.78, 0.92], cRange: [0.05, 0.11] },
    deep:    { lRange: [0.28, 0.50], cRange: [0.15, 0.24] },
  }

  const { lRange, cRange } = PRESETS[preset]
  const hues = harmonyHues(harmonyType, baseHue, count)

  // Randomise the direction of the lightness gradient (light→dark or dark→light)
  const [lStart, lEnd] = Math.random() > 0.5 ? lRange : [lRange[1], lRange[0]]
  // One shared chroma for the palette so colours feel like a family
  const baseChroma = cRange[0] + Math.random() * (cRange[1] - cRange[0])

  return hues.map((h, i) => {
    const t = count > 1 ? i / (count - 1) : 0.5
    const l = Math.max(0, Math.min(1, lStart + (lEnd - lStart) * t + (Math.random() - 0.5) * 0.04))
    const c = Math.max(0, baseChroma + (Math.random() - 0.5) * 0.02)
    return convertTo({ space: 'oklch', l, c, h }, space)
  })
}

export function parseInput(raw: string, space: ColorSpace): ColorValue | null {
  const s = raw.trim()

  if (space === 'hex') {
    if (/^#?[0-9a-fA-F]{3}$/.test(s) || /^#?[0-9a-fA-F]{6}$/.test(s)) {
      return { space: 'hex', value: s.startsWith('#') ? s : '#' + s }
    }
    return null
  }

  if (space === 'rgb') {
    const m = s.match(/^rgb\(?\s*(\d+)\s+(\d+)\s+(\d+)\s*\)?$/)
      || s.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/)
    if (m) {
      return { space: 'rgb', r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) }
    }
    return null
  }

  if (space === 'hsl') {
    const m = s.match(/^hsl\(?\s*([\d.]+)\s+([\d.]+)%?\s+([\d.]+)%?\s*\)?$/)
      || s.match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/)
    if (m) {
      return { space: 'hsl', h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) }
    }
    return null
  }

  if (space === 'oklch') {
    const m = s.match(/^oklch\(?\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)?$/)
      || s.match(/^([\d.]+)\s+([\d.]+)\s+([\d.]+)$/)
    if (m) {
      return { space: 'oklch', l: Number(m[1]), c: Number(m[2]), h: Number(m[3]) }
    }
    return null
  }

  return null
}

export function isOutOfSRGBGamut(v: OklchColor): boolean {
  const [r, g, b] = oklchToLinearSRGB(v.l, v.c, v.h)
  return r < -0.001 || r > 1.001 || g < -0.001 || g > 1.001 || b < -0.001 || b > 1.001
}

export function makeColorEntry(value: ColorValue, locked = false) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2)
  return { id, value, locked }
}
