'use client'

import React, { useState } from 'react'
import { GripVertical, Lock, LockOpen, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HexColorPicker } from 'react-colorful'
import { Slider } from '@/components/ui/slider'
import type { ColorEntry, ColorSpace, ColorValue } from '@/types/color'
import { toHex, toCss, convertTo, parseInput, isOutOfSRGBGamut } from '@/utils/colorUtils'

interface ColorSwatchProps {
  entry: ColorEntry
  index: number
  total: number
  displaySpace: ColorSpace
  onUpdate: (id: string, value: ColorValue) => void
  onRemove: (id: string) => void
  onToggleLock: (id: string) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  // drag events passed from parent
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (index: number) => void
}

function OklchSliders({
  value,
  onChange,
}: {
  value: ColorValue
  onChange: (v: ColorValue) => void
}) {
  const v = value.space === 'oklch' ? value : ({ space: 'oklch', l: 0.5, c: 0.15, h: 0 } as const)
  return (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between text-xs">
        <span>L</span><span>{v.space === 'oklch' ? v.l.toFixed(2) : ''}</span>
      </div>
      <Slider
        value={[v.space === 'oklch' ? v.l : 0.5]}
        min={0} max={1} step={0.01}
        onValueChange={([l]) => onChange({ ...v, space: 'oklch', l })}
      />
      <div className="flex justify-between text-xs">
        <span>C</span><span>{v.space === 'oklch' ? v.c.toFixed(3) : ''}</span>
      </div>
      <Slider
        value={[v.space === 'oklch' ? v.c : 0.15]}
        min={0} max={0.4} step={0.001}
        onValueChange={([c]) => onChange({ ...v, space: 'oklch', c })}
      />
      <div className="flex justify-between text-xs">
        <span>H</span><span>{v.space === 'oklch' ? Math.round(v.h) : ''}</span>
      </div>
      <Slider
        value={[v.space === 'oklch' ? v.h : 0]}
        min={0} max={360} step={1}
        onValueChange={([h]) => onChange({ ...v, space: 'oklch', h })}
      />
    </div>
  )
}

export default function ColorSwatch({
  entry,
  index,
  total,
  displaySpace,
  onUpdate,
  onRemove,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}: ColorSwatchProps) {
  const [inputText, setInputText] = useState('')
  const [inputFocused, setInputFocused] = useState(false)

  const hex = toHex(entry.value)
  const displayText = toCss(entry.value)
  const outOfGamut = entry.value.space === 'oklch' && isOutOfSRGBGamut(entry.value)

  function handlePickerChange(newHex: string) {
    const converted = convertTo({ space: 'hex', value: newHex }, displaySpace)
    onUpdate(entry.id, converted)
  }

  function handleInputChange(raw: string) {
    setInputText(raw)
    const parsed = parseInput(raw, displaySpace)
    if (parsed) onUpdate(entry.id, parsed)
  }

  function handleInputBlur() {
    setInputFocused(false)
    setInputText('')
  }

  function handleInputFocus() {
    setInputFocused(true)
    setInputText(displayText)
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(e, index) }}
      onDrop={() => onDrop(index)}
      className="flex items-center gap-2 rounded-md border bg-card p-2 group"
      aria-label={`Color ${index + 1}: ${displayText}`}
    >
      {/* Drag handle */}
      <GripVertical
        className="h-4 w-4 text-muted-foreground cursor-grab shrink-0"
        aria-hidden
      />

      {/* Colour circle — opens picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-8 h-8 rounded-full border-2 border-white shadow shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{ backgroundColor: hex }}
            aria-label={`Edit color ${displayText}`}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 space-y-2" align="start">
          <HexColorPicker color={hex} onChange={handlePickerChange} />
          {displaySpace === 'oklch' && (
            <OklchSliders value={entry.value} onChange={(v) => onUpdate(entry.id, v)} />
          )}
          {outOfGamut && (
            <p className="text-xs text-amber-500">⚠ Out of sRGB gamut — clamped</p>
          )}
        </PopoverContent>
      </Popover>

      {/* Text input */}
      <Input
        className="h-7 text-xs font-mono flex-1 min-w-0"
        value={inputFocused ? inputText : displayText}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        aria-label={`Color value in ${displaySpace}`}
      />

      {/* Accessible move buttons (visible on focus) */}
      <div className="sr-only focus-within:not-sr-only flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          aria-label="Move colour up"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          aria-label="Move colour down"
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Lock */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0"
        onClick={() => onToggleLock(entry.id)}
        aria-label={entry.locked ? 'Unlock colour' : 'Lock colour'}
      >
        {entry.locked
          ? <Lock className="h-3 w-3 text-primary" />
          : <LockOpen className="h-3 w-3 text-muted-foreground" />}
      </Button>

      {/* Remove */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 shrink-0"
        onClick={() => onRemove(entry.id)}
        aria-label="Remove colour"
      >
        <Trash2 className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  )
}
