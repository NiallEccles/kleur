export type ColorSpace = 'hex' | 'rgb' | 'hsl' | 'oklch'

export type HexColor   = { space: 'hex';   value: string }
export type RgbColor   = { space: 'rgb';   r: number; g: number; b: number }
export type HslColor   = { space: 'hsl';   h: number; s: number; l: number }
export type OklchColor = { space: 'oklch'; l: number; c: number; h: number }

export type ColorValue = HexColor | RgbColor | HslColor | OklchColor

export type ColorEntry = {
  id: string
  value: ColorValue
  locked: boolean
}

export type MeshColorEntry = ColorEntry & {
  x: number
  y: number
  blurRadius: number
}

export type CvdType = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'

export type WcagResult = {
  ratio: number
  aa: boolean
  aaa: boolean
  largeAA: boolean
  largeAAA: boolean
}
