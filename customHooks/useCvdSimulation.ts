'use client'

import { useState, useCallback } from 'react'
import type { CvdType, ColorValue } from '../types/color'
import { simulateCvd } from '../utils/colorUtils'

export function useCvdSimulation() {
  const [cvdType, setCvdType] = useState<CvdType>('none')

  const simulate = useCallback((value: ColorValue): ColorValue => {
    return simulateCvd(value, cvdType)
  }, [cvdType])

  return { cvdType, setCvdType, simulate }
}
