import {
  toHex,
  toCss,
  convertTo,
  relativeLuminance,
  contrastRatio,
  wcagResult,
  simulateCvd,
  generateRandom,
  parseInput,
  isOutOfSRGBGamut,
  toLinearSRGB,
} from './colorUtils'
import type { HexColor, RgbColor, HslColor, OklchColor } from '../types/color'

// ---------------------------------------------------------------------------
// toHex
// ---------------------------------------------------------------------------

describe('toHex', () => {
  it('returns hex value as-is', () => {
    const v: HexColor = { space: 'hex', value: '#ff0000' }
    expect(toHex(v)).toBe('#ff0000')
  })

  it('converts rgb to hex', () => {
    const v: RgbColor = { space: 'rgb', r: 255, g: 0, b: 0 }
    expect(toHex(v)).toBe('#ff0000')
  })

  it('converts hsl pure red to hex', () => {
    const v: HslColor = { space: 'hsl', h: 0, s: 100, l: 50 }
    expect(toHex(v)).toBe('#ff0000')
  })

  it('converts black oklch to hex', () => {
    const v: OklchColor = { space: 'oklch', l: 0, c: 0, h: 0 }
    expect(toHex(v)).toBe('#000000')
  })

  it('converts white oklch (L=1, C=0) to near-white hex', () => {
    const v: OklchColor = { space: 'oklch', l: 1, c: 0, h: 0 }
    const hex = toHex(v)
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    expect(r).toBeGreaterThanOrEqual(253)
    expect(g).toBeGreaterThanOrEqual(253)
    expect(b).toBeGreaterThanOrEqual(253)
  })
})

// ---------------------------------------------------------------------------
// toCss
// ---------------------------------------------------------------------------

describe('toCss', () => {
  it('hex stays as hex string', () => {
    expect(toCss({ space: 'hex', value: '#aabbcc' })).toBe('#aabbcc')
  })

  it('rgb formats correctly', () => {
    expect(toCss({ space: 'rgb', r: 10, g: 20, b: 30 })).toBe('rgb(10 20 30)')
  })

  it('hsl formats correctly', () => {
    expect(toCss({ space: 'hsl', h: 180, s: 50, l: 60 })).toBe('hsl(180 50% 60%)')
  })

  it('oklch formats correctly', () => {
    const css = toCss({ space: 'oklch', l: 0.55, c: 0.15, h: 270 })
    expect(css).toMatch(/^oklch\(/)
  })
})

// ---------------------------------------------------------------------------
// convertTo
// ---------------------------------------------------------------------------

describe('convertTo', () => {
  it('returns same object when space matches', () => {
    const v: HexColor = { space: 'hex', value: '#123456' }
    expect(convertTo(v, 'hex')).toBe(v)
  })

  it('hex → rgb round-trip is close', () => {
    const hex: HexColor = { space: 'hex', value: '#804dcc' }
    const rgb = convertTo(hex, 'rgb') as RgbColor
    expect(rgb.space).toBe('rgb')
    expect(rgb.r).toBeCloseTo(128, 0)
    expect(rgb.g).toBeCloseTo(77, 0)
    expect(rgb.b).toBeCloseTo(204, 0)
  })

  it('hex → hsl → hex round-trip', () => {
    const hex: HexColor = { space: 'hex', value: '#ff8000' }
    const hsl = convertTo(hex, 'hsl') as HslColor
    const back = convertTo(hsl, 'hex') as HexColor
    expect(back.value).toBe('#ff8000')
  })

  it('hex → oklch → hex round-trip (approximately)', () => {
    const hex: HexColor = { space: 'hex', value: '#804dcc' }
    const oklch = convertTo(hex, 'oklch') as OklchColor
    const back = convertTo(oklch, 'hex') as HexColor
    // allow ±3 per channel due to floating-point rounding
    const [r1, g1, b1] = [0x80, 0x4d, 0xcc]
    const [r2, g2, b2] = [
      parseInt(back.value.slice(1, 3), 16),
      parseInt(back.value.slice(3, 5), 16),
      parseInt(back.value.slice(5, 7), 16),
    ]
    expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(3)
    expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(3)
    expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(3)
  })
})

// ---------------------------------------------------------------------------
// WCAG
// ---------------------------------------------------------------------------

describe('relativeLuminance', () => {
  it('black = 0', () => {
    expect(relativeLuminance({ space: 'hex', value: '#000000' })).toBeCloseTo(0)
  })
  it('white = 1', () => {
    expect(relativeLuminance({ space: 'hex', value: '#ffffff' })).toBeCloseTo(1)
  })
})

describe('contrastRatio', () => {
  it('black on white = 21', () => {
    const black: HexColor = { space: 'hex', value: '#000000' }
    const white: HexColor = { space: 'hex', value: '#ffffff' }
    expect(contrastRatio(black, white)).toBeCloseTo(21, 0)
  })

  it('same colour = 1', () => {
    const red: HexColor = { space: 'hex', value: '#ff0000' }
    expect(contrastRatio(red, red)).toBeCloseTo(1, 1)
  })
})

describe('wcagResult', () => {
  it('black/white passes AA, AAA, largeAA, largeAAA', () => {
    const r = wcagResult({ space: 'hex', value: '#000000' }, { space: 'hex', value: '#ffffff' })
    expect(r.aa).toBe(true)
    expect(r.aaa).toBe(true)
    expect(r.largeAA).toBe(true)
    expect(r.largeAAA).toBe(true)
  })

  it('similar colours fail AA', () => {
    const r = wcagResult({ space: 'hex', value: '#aaaaaa' }, { space: 'hex', value: '#bbbbbb' })
    expect(r.aa).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// CVD simulation
// ---------------------------------------------------------------------------

describe('simulateCvd', () => {
  it('none returns same value', () => {
    const v: HexColor = { space: 'hex', value: '#ff0000' }
    expect(simulateCvd(v, 'none')).toBe(v)
  })

  it('deuteranopia returns a HexColor', () => {
    const v: HexColor = { space: 'hex', value: '#ff0000' }
    const result = simulateCvd(v, 'deuteranopia')
    expect(result.space).toBe('hex')
  })

  it('protanopia shifts red', () => {
    const red: HexColor = { space: 'hex', value: '#ff0000' }
    const simulated = simulateCvd(red, 'protanopia') as HexColor
    // protanopia makes red appear darker/desaturated — not the same as red
    expect(simulated.value).not.toBe('#ff0000')
  })
})

// ---------------------------------------------------------------------------
// generateRandom
// ---------------------------------------------------------------------------

describe('generateRandom', () => {
  it('returns a value in the requested space', () => {
    expect(generateRandom('hex').space).toBe('hex')
    expect(generateRandom('rgb').space).toBe('rgb')
    expect(generateRandom('hsl').space).toBe('hsl')
    expect(generateRandom('oklch').space).toBe('oklch')
  })
})

// ---------------------------------------------------------------------------
// parseInput
// ---------------------------------------------------------------------------

describe('parseInput', () => {
  it('parses hex', () => {
    const r = parseInput('#abc123', 'hex')
    expect(r).toEqual({ space: 'hex', value: '#abc123' })
  })

  it('parses hex without hash', () => {
    const r = parseInput('aabbcc', 'hex')
    expect(r).toEqual({ space: 'hex', value: '#aabbcc' })
  })

  it('parses rgb space-separated', () => {
    const r = parseInput('rgb(10 20 30)', 'rgb')
    expect(r).toEqual({ space: 'rgb', r: 10, g: 20, b: 30 })
  })

  it('parses hsl', () => {
    const r = parseInput('hsl(180 50% 60%)', 'hsl')
    expect(r).toEqual({ space: 'hsl', h: 180, s: 50, l: 60 })
  })

  it('returns null for invalid input', () => {
    expect(parseInput('not-a-color', 'hex')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// isOutOfSRGBGamut
// ---------------------------------------------------------------------------

describe('isOutOfSRGBGamut', () => {
  it('black is in gamut', () => {
    expect(isOutOfSRGBGamut({ space: 'oklch', l: 0, c: 0, h: 0 })).toBe(false)
  })

  it('mid-grey is in gamut', () => {
    expect(isOutOfSRGBGamut({ space: 'oklch', l: 0.5, c: 0, h: 0 })).toBe(false)
  })

  it('extreme chroma may be out of gamut', () => {
    // Very high chroma is likely out of sRGB gamut
    const result = isOutOfSRGBGamut({ space: 'oklch', l: 0.5, c: 0.4, h: 150 })
    expect(typeof result).toBe('boolean')
  })
})
