import { convertTo, toHex, relativeLuminance } from './colorUtils'
import type { OklchColor } from '../types/color'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ShadeStop = { label: string; hex: string; l: number }

export type BrandRoles = {
  primary: string; primaryFg: string
  accent: string;  accentFg: string
  surface: string; surfaceFg: string
  muted: string;   mutedFg: string
}

// ---------------------------------------------------------------------------
// Shade generation
// ---------------------------------------------------------------------------

const LABELS    = ['50','100','200','300','400','500','600','700','800','900','950']
const L_TARGETS = [0.97, 0.93, 0.86, 0.76, 0.65, 0.54, 0.44, 0.36, 0.27, 0.18, 0.13]
const C_TAPER   = [0.15, 0.30, 0.55, 0.80, 0.95, 1.00, 0.95, 0.85, 0.70, 0.45, 0.25]

export function generateShades(hex: string): ShadeStop[] {
  const source = convertTo({ space: 'hex', value: hex }, 'oklch') as OklchColor
  return LABELS.map((label, i) => {
    const stop: OklchColor = { space: 'oklch', l: L_TARGETS[i], c: source.c * C_TAPER[i], h: source.h }
    return { label, hex: toHex(stop), l: L_TARGETS[i] }
  })
}

// ---------------------------------------------------------------------------
// Dark variant
// ---------------------------------------------------------------------------

export function generateDarkVariant(hex: string): string {
  const source = convertTo({ space: 'hex', value: hex }, 'oklch') as OklchColor
  const invertedL = Math.max(0.10, Math.min(0.95, 1 - source.l))
  const adjustedC = source.c * 0.85
  const dark: OklchColor = { space: 'oklch', l: invertedL, c: adjustedC, h: source.h }
  return toHex(dark)
}

// ---------------------------------------------------------------------------
// Auto foreground
// ---------------------------------------------------------------------------

function autoFg(hex: string): string {
  try {
    const lum = relativeLuminance({ space: 'hex', value: hex })
    return lum > 0.35 ? '#1a1a1a' : '#ffffff'
  } catch {
    return '#1a1a1a'
  }
}

// ---------------------------------------------------------------------------
// Role assignment
// ---------------------------------------------------------------------------

export function assignRoles(colours: string[]): BrandRoles {
  if (colours.length === 0) {
    return {
      primary: '#000000', primaryFg: '#ffffff',
      accent:  '#888888', accentFg:  '#ffffff',
      surface: '#ffffff', surfaceFg: '#1a1a1a',
      muted:   '#333333', mutedFg:   '#ffffff',
    }
  }

  type Entry = { hex: string; chroma: number; luminance: number }
  const entries: Entry[] = colours.map(hex => {
    const oklch = convertTo({ space: 'hex', value: hex }, 'oklch') as OklchColor
    return { hex, chroma: oklch.c, luminance: relativeLuminance({ space: 'hex', value: hex }) }
  })

  const byChroma    = [...entries].sort((a, b) => b.chroma - a.chroma)
  const byLuminance = [...entries].sort((a, b) => b.luminance - a.luminance)

  const primary = byChroma[0].hex
  const accent  = (byChroma[1] ?? byChroma[0]).hex
  const surface = byLuminance[0].hex
  const muted   = byLuminance[byLuminance.length - 1].hex

  return {
    primary, primaryFg: autoFg(primary),
    accent,  accentFg:  autoFg(accent),
    surface, surfaceFg: autoFg(surface),
    muted,   mutedFg:   autoFg(muted),
  }
}

// ---------------------------------------------------------------------------
// Build analyse href from colours + name
// ---------------------------------------------------------------------------

export function buildAnalyseHref(colours: string[], name: string): string {
  const p = colours.map(c => c.replace('#', '')).join(',')
  return `/brand-kit?p=${p}&name=${encodeURIComponent(name)}`
}
