'use client'

import { useCallback } from 'react'
import type { ColorEntry } from '../types/color'

export interface StoredItem<T> {
  id: string
  name: string | null
  controls: T
  createdAt: number
  version: number
}

// Migrate old string[] palette/gradient records to ColorEntry[]
function migrateControls(raw: unknown): ColorEntry[] {
  if (!Array.isArray(raw)) return []

  if (typeof raw[0] === 'string') {
    // Old format: string[] of hex values
    return (raw as string[]).map(hex => ({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      value: { space: 'hex' as const, value: hex.startsWith('#') ? hex : '#' + hex },
      locked: false,
    }))
  }

  // Already ColorEntry[] or close enough
  return raw as ColorEntry[]
}

export function useGeneratorStorage<T>(storageKey: string, version: number) {
  const save = useCallback((controls: T, name: string | null) => {
    const prev = loadAll()
    const id = crypto?.randomUUID?.() ?? Date.now().toString(36)
    const item: StoredItem<T> = {
      id,
      name,
      controls,
      createdAt: Date.now(),
      version,
    }
    localStorage.setItem(storageKey, JSON.stringify([...prev, item]))
  }, [storageKey, version]) // eslint-disable-line react-hooks/exhaustive-deps

  function loadAll(): StoredItem<T>[] {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.map((item: Record<string, unknown>) => ({
        ...item,
        version: (item.version as number) ?? 0,
        controls: item.controls !== undefined ? item.controls : migrateControls(item['colors'] as unknown),
      })) as StoredItem<T>[]
    } catch {
      return []
    }
  }

  const remove = useCallback((id: string) => {
    const updated = loadAll().filter(item => item.id !== id)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }, [storageKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { save, loadAll, remove }
}
