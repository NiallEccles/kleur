'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { generateShades } from '@/utils/brandKitUtils'
import { convertTo, toCss, parseInput, toHex as toHexUtil } from '@/utils/colorUtils'
import type { ColorSpace } from '@/types/color'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ShadeScaleProps {
  hex: string
  displaySpace?: ColorSpace
  name?: string
  layout?: 'horizontal' | 'vertical'
  onNameChange?: (name: string) => void
  onHexChange?: (hex: string) => void
  onRemove?: () => void
}

export default function ShadeScale({
  hex,
  displaySpace = 'hex',
  name = '',
  layout = 'vertical',
  onNameChange,
  onHexChange,
  onRemove,
}: ShadeScaleProps) {
  const [copied, setCopied] = useState('')
  const [pickerHex, setPickerHex] = useState(hex.startsWith('#') ? hex : `#${hex}`)
  const [colorInputText, setColorInputText] = useState('')
  const [colorInputFocused, setColorInputFocused] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const normalHex = hex.startsWith('#') ? hex : `#${hex}`
  const shades = generateShades(hex)

  function handleCopy(stopHex: string) {
    const formatted = toCss(convertTo({ space: 'hex', value: stopHex }, displaySpace))
    navigator.clipboard.writeText(formatted)
    setCopied(stopHex)
    setTimeout(() => setCopied(''), 1500)
  }

  useEffect(() => {
    if (editingName) nameInputRef.current?.focus()
  }, [editingName])

  function handlePickerChange(newHex: string) {
    setPickerHex(newHex)
    onHexChange?.(newHex)
  }

  function handleColorTextInput(raw: string) {
    setColorInputText(raw)
    for (const space of ['hex', 'rgb', 'hsl', 'oklch'] as ColorSpace[]) {
      const parsed = parseInput(raw, space)
      if (parsed) {
        const resolved = toHexUtil(parsed)
        setPickerHex(resolved)
        onHexChange?.(resolved)
        return
      }
    }
  }

  const containerStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  }

  const shadeStyles = {
    horizontal: 'h-24 items-center pb-2',
    vertical: 'w-full h-12 p-5',
  }

  const isFirstStyles = {
    horizontal: 'rounded-l-md',
    vertical: 'rounded-t-md',
  }

  const isLastStyles = {
    horizontal: 'rounded-r-md',
    vertical: 'rounded-b-md',
  }

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Header: name input + color picker + remove */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-7 h-7 rounded-md border border-border flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: normalHex }}
              title="Change base colour"
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 space-y-2" align="start">
            <HexColorPicker color={pickerHex} onChange={handlePickerChange} />
            <Input
              className="h-7 text-xs font-mono"
              value={colorInputFocused ? colorInputText : pickerHex}
              onChange={e => handleColorTextInput(e.target.value)}
              onFocus={() => { setColorInputFocused(true); setColorInputText(pickerHex) }}
              onBlur={() => setColorInputFocused(false)}
              placeholder="hex, rgb(), hsl(), oklch()"
            />
          </PopoverContent>
        </Popover>

        {editingName ? (
          <Input
            ref={nameInputRef}
            value={name}
            onChange={e => onNameChange?.(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingName(false) }}
            placeholder="Colour name"
            className="h-7 text-sm font-semibold"
          />
        ) : (
          <span className="flex-1 text-sm font-semibold truncate min-w-0">
            {name || <span className="text-muted-foreground italic">Unnamed</span>}
          </span>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0 text-muted-foreground"
          onClick={() => setEditingName(e => !e)}
          title="Edit name"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            title="Remove colour"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Shade scale */}
      <div className={['flex w-full', containerStyles[layout]].join(' ')}>
        {shades.map((stop, i) => {
          const isFirst = i === 0
          const isLast = i === shades.length - 1
          const textColor = stop.l > 0.55 ? '#1a1a1a' : '#ffffff'
          const formatted = toCss(convertTo({ space: 'hex', value: stop.hex }, displaySpace))
          return (
            <button
              key={stop.label}
              onClick={() => handleCopy(stop.hex)}
              title={`${stop.label}: ${formatted}`}
              className={[
                shadeStyles[layout],
                'flex-1 flex flex-col justify-end font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-ring relative overflow-hidden',
                isFirst ? isFirstStyles[layout] : '',
                isLast ? isLastStyles[layout] : '',
              ].join(' ')}
              style={{ backgroundColor: stop.hex }}
            >
              {copied === stop.hex && (
                <Check
                  className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ color: textColor }}
                />
              )}
              <span
                className="text-xs font-mono leading-tight"
                style={{ color: textColor }}
              >
                {stop.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
