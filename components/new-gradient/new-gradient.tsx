'use client'

import { useState } from 'react'
import { Plus, Shuffle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/public/constants'
import GeneratorLayout from '@/components/generator/GeneratorLayout'
import GeneratorPanel from '@/components/generator/GeneratorPanel'
import ColorEntryList from '@/components/generator/ColorEntryList'
import ExportPanel from '@/components/generator/ExportPanel'
import A11yPanel from '@/components/generator/A11yPanel'
import { useColorEntries } from '@/customHooks/useColorEntries'
import { useGeneratorStorage } from '@/customHooks/useGeneratorStorage'
import { useWcagContrast } from '@/customHooks/useWcagContrast'
import { useCvdSimulation } from '@/customHooks/useCvdSimulation'
import { makeColorEntry, toHex, toCss } from '@/utils/colorUtils'
import type { ColorEntry, ColorSpace } from '@/types/color'

const INITIAL_COLORS = ['#E23E57', '#88304E', '#522546', '#311D3F'].map(hex =>
  makeColorEntry({ space: 'hex', value: hex })
)

const COLOR_SPACES: { value: ColorSpace; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'oklch', label: 'OKLCH' },
]

function gradientCss(entries: ColorEntry[], angle: number): string {
  const stops = entries.map(e => toHex(e.value)).join(', ')
  return `linear-gradient(${angle}deg, ${stops})`
}

function gradientCssExport(entries: ColorEntry[], angle: number): string {
  const stops = entries.map(e => toCss(e.value)).join(', ')
  return `:root {\n  --gradient: linear-gradient(${angle}deg, ${stops});\n}`
}

export default function NewGradient() {
  const {
    entries, displaySpace, addEntry, removeEntry, updateEntry,
    moveEntry, toggleLock, randomiseUnlocked, changeDisplaySpace,
  } = useColorEntries(INITIAL_COLORS, 'hex')

  const [name, setName] = useState('')
  const [angle, setAngle] = useState(135)
  const router = useRouter()
  const { save } = useGeneratorStorage('gradients', 1)
  const pairs = useWcagContrast(entries)
  const { cvdType, setCvdType } = useCvdSimulation()

  function handleSave() {
    save(entries, name || null)
    router.push(PAGES.HOME)
  }

  function drawPng(): HTMLCanvasElement {
    const offscreen = document.createElement('canvas')
    offscreen.width = 600
    offscreen.height = 200
    const ctx = offscreen.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 600, 0)
    entries.forEach((e, i) => {
      grad.addColorStop(i / (entries.length - 1 || 1), toHex(e.value))
    })
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 600, 200)
    return offscreen
  }

  const gradStyle = { background: gradientCss(entries, angle) }

  const canvas = (
    <div
      className="w-full rounded-lg border"
      style={{ height: '200px', ...gradStyle }}
    />
  )

  const colorsTab = (
    <>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => addEntry()} className="flex-1">
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
        <Button size="sm" variant="outline" onClick={() => randomiseUnlocked()} className="flex-1">
          <Shuffle className="h-3 w-3 mr-1" /> Randomise
        </Button>
      </div>
      <ColorEntryList
        entries={entries}
        displaySpace={displaySpace}
        onUpdate={updateEntry}
        onRemove={removeEntry}
        onToggleLock={toggleLock}
        onMove={moveEntry}
      />
    </>
  )

  const settingsTab = (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Colour space</p>
        <div className="flex flex-wrap gap-1">
          {COLOR_SPACES.map(s => (
            <Button
              key={s.value}
              size="sm"
              variant={displaySpace === s.value ? 'default' : 'outline'}
              onClick={() => changeDisplaySpace(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Angle</span>
          <span className="text-muted-foreground">{angle}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Gradient name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  )

  const shareHref = `/gradient?p=${entries.map(e => toHex(e.value).replace('#', '')).join(',')}&name=${encodeURIComponent(name)}`

  const exportTab = (
    <ExportPanel
      entries={entries}
      drawPng={drawPng}
      showTailwind={false}
      cssOverride={gradientCssExport(entries, angle)}
      shareHref={shareHref}
    />
  )

  const a11yTab = (
    <A11yPanel
      entries={entries}
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
