'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Save, RefreshCw, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
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
import { extractDominantColors } from '@/utils/imageUtils'
import type { ColorSpace } from '@/types/color'

const DEFAULT_COUNT = 5
const MIN_COUNT = 3
const MAX_COUNT = 10

const COLOR_SPACES: { value: ColorSpace; label: string }[] = [
  { value: 'hex', label: 'HEX' },
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'oklch', label: 'OKLCH' },
]

export default function ImagePalette() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [colorCount, setColorCount] = useState(DEFAULT_COUNT)
  const [name, setName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const imageDataRef = useRef<ImageData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const {
    entries, displaySpace, addEntry, removeEntry, updateEntry,
    moveEntry, toggleLock, changeDisplaySpace, setEntries,
  } = useColorEntries([], 'hex')

  const { save } = useGeneratorStorage('palettes', 1)
  const pairs = useWcagContrast(entries)
  const { cvdType, setCvdType } = useCvdSimulation()

  function runExtraction(imageData: ImageData, k: number) {
    const colors = extractDominantColors(imageData, k)
    setEntries(colors.map(c => makeColorEntry(c)))
  }

  function loadFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(url)

    const img = new Image()
    img.onload = () => {
      const offscreen = document.createElement('canvas')
      offscreen.width = img.naturalWidth
      offscreen.height = img.naturalHeight
      const ctx = offscreen.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height)
      imageDataRef.current = imageData
      runExtraction(imageData, colorCount)
    }
    img.src = url
  }

  // Re-extract when colorCount changes and an image is loaded
  useEffect(() => {
    if (imageDataRef.current) {
      runExtraction(imageDataRef.current, colorCount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorCount])

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
    e.target.value = ''
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorCount])

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
    <div className="space-y-4">
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full rounded-lg object-cover border"
            style={{ height: '240px' }}
          />
          <div className="w-full rounded-lg overflow-hidden border" style={{ height: '60px' }}>
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
          <label
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            htmlFor="image-upload-replace"
          >
            <Upload className="h-4 w-4" />
            Replace image
            <input
              id="image-upload-replace"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileInput}
            />
          </label>
        </>
      ) : (
        <label
          htmlFor="image-upload"
          className={`flex flex-col items-center justify-center gap-3 w-full rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          style={{ height: '320px' }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <span className="text-sm text-muted-foreground text-center">
            Drop an image or click to browse
          </span>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileInput}
          />
        </label>
      )}
    </div>
  )

  const colorsTab = (
    <>
      <Button size="sm" variant="outline" onClick={() => addEntry()} className="w-full">
        <Plus className="h-3 w-3 mr-1" /> Add color
      </Button>
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
        <p className="text-sm font-medium mb-2">Colors to extract: {colorCount}</p>
        <Slider
          min={MIN_COUNT}
          max={MAX_COUNT}
          step={1}
          value={[colorCount]}
          onValueChange={([v]) => setColorCount(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{MIN_COUNT}</span>
          <span>{MAX_COUNT}</span>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        disabled={!imageDataRef.current}
        onClick={() => imageDataRef.current && runExtraction(imageDataRef.current, colorCount)}
      >
        <RefreshCw className="h-3 w-3 mr-1" /> Re-extract
      </Button>
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
        <Button onClick={handleSave} disabled={entries.length === 0}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  )

  const exportTab = (
    <ExportPanel entries={entries} drawPng={drawPng} showTailwind />
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
