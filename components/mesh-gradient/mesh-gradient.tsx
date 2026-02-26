'use client'

import React, { useState, useRef } from 'react'
import { Plus, Shuffle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HexColorPicker } from 'react-colorful'
import { Trash2 } from 'lucide-react'
import { PAGES } from '@/public/constants'
import GeneratorLayout from '@/components/generator/GeneratorLayout'
import GeneratorPanel from '@/components/generator/GeneratorPanel'
import ExportPanel from '@/components/generator/ExportPanel'
import A11yPanel from '@/components/generator/A11yPanel'
import { useGeneratorStorage } from '@/customHooks/useGeneratorStorage'
import { useWcagContrast } from '@/customHooks/useWcagContrast'
import { useCvdSimulation } from '@/customHooks/useCvdSimulation'
import { makeColorEntry, toHex } from '@/utils/colorUtils'
import type { MeshColorEntry, ColorEntry, ColorSpace } from '@/types/color'

// Mesh colour entries extend ColorEntry with x, y, blurRadius
type MeshEntry = MeshColorEntry

function makeMesh(hex: string, x: number, y: number, blurRadius = 100): MeshEntry {
  const base = makeColorEntry({ space: 'hex' as const, value: hex })
  return { ...base, x, y, blurRadius }
}

const INITIAL_ENTRIES: MeshEntry[] = [
  makeMesh('#ff5757', 25, 25),
  makeMesh('#7c4dff', 75, 75),
]

const COLOR_SPACES: { value: ColorSpace; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'oklch', label: 'OKLCH' },
]

export default function MeshGradientGenerator() {
  const [colorPoints, setColorPoints] = useState<MeshEntry[]>(INITIAL_ENTRIES)
  const [activePoint, setActivePoint] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(100)
  const [name, setName] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { save } = useGeneratorStorage<MeshEntry[]>('meshGradients', 1)
  const { cvdType, setCvdType } = useCvdSimulation()

  // Derive plain ColorEntry[] for WCAG (positions don't affect contrast)
  const colorEntries: ColorEntry[] = colorPoints.map(p => ({
    id: p.id, value: p.value, locked: p.locked,
  }))
  const pairs = useWcagContrast(colorEntries)

  function addColorPoint() {
    const newPoint = makeMesh(
      '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
      Math.random() * 80 + 10,
      Math.random() * 80 + 10,
    )
    setColorPoints(prev => [...prev, newPoint])
  }

  function removeColorPoint(id: string) {
    if (colorPoints.length <= 2) return
    setColorPoints(prev => prev.filter(p => p.id !== id))
    if (activePoint === id) setActivePoint(null)
  }

  function updateColor(id: string, hex: string) {
    setColorPoints(prev =>
      prev.map(p => p.id === id ? { ...p, value: { space: 'hex', value: hex } } : p)
    )
  }

  function updateBlur(id: string, blurRadius: number) {
    setColorPoints(prev =>
      prev.map(p => p.id === id ? { ...p, blurRadius } : p)
    )
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!activePoint || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setColorPoints(prev => prev.map(p => p.id === activePoint ? { ...p, x, y } : p))
  }

  function randomiseAll() {
    setColorPoints(prev => prev.map(p =>
      p.locked ? p : {
        ...p,
        value: {
          space: 'hex',
          value: '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'),
        }
      }
    ))
  }

  function handleSave() {
    save(colorPoints, name || null)
    router.push(PAGES.HOME)
  }

  function meshBackground(points: MeshEntry[]) {
    return points
      .map(p => `radial-gradient(circle at ${p.x}% ${p.y}%, ${toHex(p.value)} 0%, transparent ${p.blurRadius}%)`)
      .join(', ')
  }

  function drawPng(): HTMLCanvasElement {
    const offscreen = document.createElement('canvas')
    offscreen.width = 800
    offscreen.height = 450
    const ctx = offscreen.getContext('2d')!
    colorPoints.forEach(p => {
      const grad = ctx.createRadialGradient(
        (p.x / 100) * 800, (p.y / 100) * 450, 0,
        (p.x / 100) * 800, (p.y / 100) * 450,
        (p.blurRadius / 100) * Math.max(800, 450)
      )
      grad.addColorStop(0, toHex(p.value))
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 800, 450)
    })
    return offscreen
  }

  const canvas = (
    <div
      ref={canvasRef}
      className="relative w-full aspect-video rounded-lg border overflow-hidden"
      style={{ background: meshBackground(colorPoints), opacity: opacity / 100 }}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setActivePoint(null)}
      onMouseLeave={() => setActivePoint(null)}
    >
      {colorPoints.map(point => (
        <div
          key={point.id}
          className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md cursor-move -translate-x-1/2 -translate-y-1/2"
          style={{
            backgroundColor: toHex(point.value),
            left: `${point.x}%`,
            top: `${point.y}%`,
            outline: activePoint === point.id ? '2px solid white' : undefined,
          }}
          onMouseDown={() => setActivePoint(point.id)}
        />
      ))}
    </div>
  )

  const colorsTab = (
    <>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={addColorPoint} className="flex-1">
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
        <Button size="sm" variant="outline" onClick={randomiseAll} className="flex-1">
          <Shuffle className="h-3 w-3 mr-1" /> Randomise
        </Button>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {colorPoints.map(point => (
          <div key={point.id} className="flex items-center gap-2 rounded-md border bg-card p-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="w-8 h-8 rounded-full border-2 border-white shadow shrink-0"
                  style={{ backgroundColor: toHex(point.value) }}
                  aria-label={`Edit color ${toHex(point.value)}`}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <HexColorPicker
                  color={toHex(point.value)}
                  onChange={(hex) => updateColor(point.id, hex)}
                />
              </PopoverContent>
            </Popover>
            <div className="flex-1 space-y-1 min-w-0">
              <p className="text-xs font-mono">{toHex(point.value)}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0">Blur</span>
                <Slider
                  value={[point.blurRadius]}
                  min={10} max={200} step={1}
                  onValueChange={([v]) => updateBlur(point.id, v)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">{point.blurRadius}%</span>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0"
              onClick={() => removeColorPoint(point.id)}
              disabled={colorPoints.length <= 2}
              aria-label="Remove colour"
            >
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </>
  )

  const settingsTab = (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Opacity</span>
          <span className="text-muted-foreground">{opacity}%</span>
        </div>
        <Slider
          value={[opacity]}
          min={20} max={100} step={1}
          onValueChange={([v]) => setOpacity(v)}
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Mesh gradient name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  )

  const meshCssExport = `:root {\n  --mesh: ${meshBackground(colorPoints)};\n}`

  const exportTab = (
    <ExportPanel entries={colorEntries} drawPng={drawPng} showTailwind={false} cssOverride={meshCssExport} />
  )

  const a11yTab = (
    <A11yPanel
      entries={colorEntries}
      pairs={pairs}
      cvdType={cvdType}
      onCvdChange={setCvdType}
    />
  )

  return (
    <GeneratorLayout
      canvas={canvas}
      panel={
        <GeneratorPanel
          colorsTab={colorsTab}
          settingsTab={settingsTab}
          exportTab={exportTab}
          a11yTab={a11yTab}
        />
      }
    />
  )
}
