"use client"

import { useState, useCallback } from "react"
import { HexColorPicker } from "react-colorful"
import { Copy, Check } from "lucide-react"
import PageTitle from "@/components/page-title/page-title"
import { Button } from "@/components/ui/button"
import { convertTo, toHex, toCss, parseInput } from "@/utils/colorUtils"
import type { ColorSpace, ColorValue } from "@/types/color"
import { cn } from "@/lib/utils"

const FORMATS: { space: ColorSpace; label: string }[] = [
  { space: "hex",   label: "HEX" },
  { space: "rgb",   label: "RGB" },
  { space: "hsl",   label: "HSL" },
  { space: "oklch", label: "OKLCH" },
]

const DEFAULT_COLOR: ColorValue = { space: "hex", value: "#3b82f6" }

function placeholder(space: ColorSpace): string {
  switch (space) {
    case "hex":   return "#3b82f6"
    case "rgb":   return "rgb(59 130 246)"
    case "hsl":   return "hsl(217 91% 60%)"
    case "oklch": return "oklch(0.546 0.237 262.9)"
  }
}

export default function ConvertPage() {
  const [inputFormat, setInputFormat] = useState<ColorSpace>("hex")
  const [inputText, setInputText]     = useState<string>(toCss(DEFAULT_COLOR))
  const [color, setColor]             = useState<ColorValue>(DEFAULT_COLOR)
  const [copied, setCopied]           = useState<string | null>(null)

  const hexValue = toHex(color)

  const applyColor = useCallback((next: ColorValue) => {
    setColor(next)
    setInputText(toCss(convertTo(next, inputFormat)))
  }, [inputFormat])

  const handleFormatChange = useCallback((space: ColorSpace) => {
    setInputFormat(space)
    setInputText(toCss(convertTo(color, space)))
  }, [color])

  const handleInputChange = useCallback((raw: string) => {
    setInputText(raw)
    const parsed = parseInput(raw, inputFormat)
    if (parsed) setColor(parsed)
  }, [inputFormat])

  const handlePickerChange = useCallback((hex: string) => {
    applyColor({ space: "hex", value: hex })
  }, [applyColor])

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  return (
    <div className="mx-5 space-y-12">
      <PageTitle title="Convert" />

      <div className="flex flex-col gap-8 px-5">
        {/* Swatch + picker */}
        <div className="flex gap-6 items-start">
          <div
            className="w-24 h-24 rounded-xl shrink-0 border border-black/10 dark:border-white/10"
            style={{ background: hexValue }}
          />
          <HexColorPicker
            color={hexValue}
            onChange={handlePickerChange}
            style={{ width: "100%", height: "96px" }}
          />
        </div>

        {/* Format selector */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Input format</p>
          <div className="flex gap-2 flex-wrap">
            {FORMATS.map(({ space, label }) => (
              <Button
                key={space}
                variant={inputFormat === space ? "default" : "outline"}
                size="sm"
                onClick={() => handleFormatChange(space)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="color-input" className="text-sm font-medium text-muted-foreground">
            Enter colour value
          </label>
          <input
            id="color-input"
            type="text"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder(inputFormat)}
            className="border rounded-lg px-3 py-2 font-mono text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        {/* Conversions */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Conversions</p>
          {FORMATS.map(({ space, label }) => {
            const css = toCss(convertTo(color, space))
            const isActive = inputFormat === space
            return (
              <div
                key={space}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2",
                  isActive
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-muted/30"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-muted-foreground w-10 shrink-0">
                    {label}
                  </span>
                  <span className="font-mono text-sm truncate">{css}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => handleCopy(css, space)}
                  aria-label={`Copy ${label} value`}
                >
                  {copied === space
                    ? <Check className="h-3.5 w-3.5 text-green-500" />
                    : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
