'use client'

import { useMemo } from 'react'
import type { ColorEntry, WcagResult } from '../types/color'
import { wcagResult } from '../utils/colorUtils'

export interface WcagPair {
  a: ColorEntry
  b: ColorEntry
  result: WcagResult
}

export function useWcagContrast(entries: ColorEntry[]): WcagPair[] {
  return useMemo(() => {
    const pairs: WcagPair[] = []
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        pairs.push({
          a: entries[i],
          b: entries[j],
          result: wcagResult(entries[i].value, entries[j].value),
        })
      }
    }
    return pairs
  }, [entries])
}
