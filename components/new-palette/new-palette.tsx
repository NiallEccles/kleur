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
import { makeColorEntry, toHex } from '@/utils/colorUtils'
import type { ColorSpace } from '@/types/color'
import type { HarmonyType, PalettePreset } from '@/utils/colorUtils'

const INITIAL_COLORS = ['#1FAB89', '#62D2A2', '#9DF3C4', '#D7FBE8'].map(hex =>
  makeColorEntry({ space: 'hex', value: hex })
)

const COLOR_SPACES: { value: ColorSpace; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'oklch', label: 'OKLCH' },
]

const HARMONY_OPTIONS: { value: HarmonyType | 'random'; label: string }[] = [
  { value: 'random',             label: 'Random' },
  { value: 'analogous',          label: 'Analogous' },
  { value: 'complementary',      label: 'Complementary' },
  { value: 'triadic',            label: 'Triadic' },
  { value: 'split-complementary', label: 'Split' },
  { value: 'golden',             label: 'Golden' },
]

const PRESET_OPTIONS: { value: PalettePreset | 'random'; label: string }[] = [
  { value: 'random',  label: 'Random' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'muted',   label: 'Muted' },
  { value: 'pastel',  label: 'Pastel' },
  { value: 'deep',    label: 'Deep' },
]

export default function NewPalette() {
  const {
    entries, displaySpace, addEntry, removeEntry, updateEntry,
    moveEntry, toggleLock, randomiseUnlocked, changeDisplaySpace,
  } = useColorEntries(INITIAL_COLORS, 'hex')

  const [name, setName] = useState('')
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType | 'random'>('random')
  const [selectedPreset, setSelectedPreset]   = useState<PalettePreset | 'random'>('random')
  const router = useRouter()
  const { save } = useGeneratorStorage('palettes', 1)
  const pairs = useWcagContrast(entries)
  const { cvdType, setCvdType } = useCvdSimulation()

  function handleSave() {
    save(entries, name || null)
    router.push(PAGES.HOME)
  }

  function drawPng(): HTMLCanvasElement {
    const offscreen = document.createElement('canvas')
    const w = 80
    offscreen.width = w * entries.length
    offscreen.height = 200
    const ctx = offscreen.getContext('2d')!
    entries.forEach((e, i) => {
      ctx.fillStyle = toHex(e.value)
      ctx.fillRect(i * w, 0, w, 200)
    })
    return offscreen
  }

  const canvas = (
    <div className="w-full rounded-lg overflow-hidden border" style={{ height: '200px' }}>
      <div className="flex h-full">
        {entries.map(e => (
          <div
            key={e.id}
            className="flex-1"
            style={{ backgroundColor: toHex(e.value) }}
            title={toHex(e.value)}
          />
        ))}
      </div>
    </div>
  )

  const colorsTab = (
    <>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => addEntry()} className="flex-1">
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
        <Button size="sm" variant="outline" onClick={() => randomiseUnlocked(selectedHarmony, selectedPreset)} className="flex-1">
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
        <p className="text-sm font-medium mb-2">Harmony</p>
        <div className="flex flex-wrap gap-1">
          {HARMONY_OPTIONS.map(o => (
            <Button
              key={o.value}
              size="sm"
              variant={selectedHarmony === o.value ? 'default' : 'outline'}
              onClick={() => setSelectedHarmony(o.value)}
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Preset</p>
        <div className="flex flex-wrap gap-1">
          {PRESET_OPTIONS.map(o => (
            <Button
              key={o.value}
              size="sm"
              variant={selectedPreset === o.value ? 'default' : 'outline'}
              onClick={() => setSelectedPreset(o.value)}
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>
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
      <div className="flex gap-2">
        <Input
          placeholder="Palette name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  )

  const shareHref = `/palette?p=${entries.map(e => toHex(e.value).replace('#', '')).join(',')}&name=${encodeURIComponent(name)}`

  const exportTab = (
    <ExportPanel entries={entries} drawPng={drawPng} showTailwind shareHref={shareHref} />
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
