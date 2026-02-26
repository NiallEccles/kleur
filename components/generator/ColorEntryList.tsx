'use client'

import React, { useState } from 'react'
import type { ColorEntry, ColorSpace, ColorValue } from '@/types/color'
import ColorSwatch from './ColorSwatch'

interface ColorEntryListProps {
  entries: ColorEntry[]
  displaySpace: ColorSpace
  onUpdate: (id: string, value: ColorValue) => void
  onRemove: (id: string) => void
  onToggleLock: (id: string) => void
  onMove: (fromIndex: number, toIndex: number) => void
}

export default function ColorEntryList({
  entries,
  displaySpace,
  onUpdate,
  onRemove,
  onToggleLock,
  onMove,
}: ColorEntryListProps) {
  const [dragFrom, setDragFrom] = useState<number | null>(null)

  function handleDragStart(index: number) {
    setDragFrom(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
  }

  function handleDrop(toIndex: number) {
    if (dragFrom !== null && dragFrom !== toIndex) {
      onMove(dragFrom, toIndex)
    }
    setDragFrom(null)
  }

  return (
    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
      {entries.map((entry, index) => (
        <ColorSwatch
          key={entry.id}
          entry={entry}
          index={index}
          total={entries.length}
          displaySpace={displaySpace}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onToggleLock={onToggleLock}
          onMoveUp={(i) => onMove(i, i - 1)}
          onMoveDown={(i) => onMove(i, i + 1)}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
