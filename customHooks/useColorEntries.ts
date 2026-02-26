'use client'

import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import type { ColorEntry, ColorSpace, ColorValue } from '../types/color'
import { generateRandom, generateHarmonyPalette, convertTo, makeColorEntry } from '../utils/colorUtils'
import type { HarmonyType, PalettePreset } from '../utils/colorUtils'

export interface UseColorEntriesReturn {
  entries: ColorEntry[]
  displaySpace: ColorSpace
  addEntry: (value?: ColorValue) => void
  removeEntry: (id: string) => void
  updateEntry: (id: string, value: ColorValue) => void
  moveEntry: (fromIndex: number, toIndex: number) => void
  toggleLock: (id: string) => void
  randomiseUnlocked: (harmony?: HarmonyType | 'random', preset?: PalettePreset | 'random') => void
  changeDisplaySpace: (space: ColorSpace) => void
  setEntries: Dispatch<SetStateAction<ColorEntry[]>>
}

export function useColorEntries(
  initial: ColorEntry[],
  initialSpace: ColorSpace = 'hex'
): UseColorEntriesReturn {
  const [entries, setEntries] = useState<ColorEntry[]>(initial)
  const [displaySpace, setDisplaySpace] = useState<ColorSpace>(initialSpace)

  const addEntry = useCallback((value?: ColorValue) => {
    const v = value ?? generateRandom(displaySpace)
    setEntries(prev => [...prev, makeColorEntry(v)])
  }, [displaySpace])

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const updateEntry = useCallback((id: string, value: ColorValue) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, value } : e))
  }, [])

  const moveEntry = useCallback((fromIndex: number, toIndex: number) => {
    setEntries(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }, [])

  const toggleLock = useCallback((id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, locked: !e.locked } : e))
  }, [])

  const randomiseUnlocked = useCallback((
    harmony?: HarmonyType | 'random',
    preset?: PalettePreset | 'random',
  ) => {
    setEntries(prev => {
      const colors = generateHarmonyPalette(prev.length, displaySpace, harmony, preset)
      return prev.map((e, i) => e.locked ? e : { ...e, value: colors[i] })
    })
  }, [displaySpace])

  const changeDisplaySpace = useCallback((space: ColorSpace) => {
    setEntries(prev => prev.map(e => ({ ...e, value: convertTo(e.value, space) })))
    setDisplaySpace(space)
  }, [])

  return {
    entries,
    displaySpace,
    addEntry,
    removeEntry,
    updateEntry,
    moveEntry,
    toggleLock,
    randomiseUnlocked,
    changeDisplaySpace,
    setEntries,
  }
}
