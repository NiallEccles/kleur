'use client'

import React from 'react'
import type { CvdType, ColorEntry } from '@/types/color'
import type { WcagPair } from '@/customHooks/useWcagContrast'
import { toHex, simulateCvd } from '@/utils/colorUtils'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface A11yPanelProps {
  entries: ColorEntry[]
  pairs: WcagPair[]
  cvdType: CvdType
  onCvdChange: (type: CvdType) => void
}

const CVD_OPTIONS: { id: CvdType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'deuteranopia', label: 'Deuter.' },
  { id: 'protanopia', label: 'Protan.' },
  { id: 'tritanopia', label: 'Tritan.' },
]

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1 py-0.5 text-[10px] font-semibold',
        pass ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
             : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      )}
    >
      {label}
    </span>
  )
}

export default function A11yPanel({ entries, pairs, cvdType, onCvdChange }: A11yPanelProps) {
  return (
    <div className="space-y-4">
      {/* CVD selector */}
      <div>
        <p className="text-xs font-medium mb-2">Colour vision deficiency</p>
        <div className="flex gap-1 flex-wrap">
          {CVD_OPTIONS.map(opt => (
            <Button
              key={opt.id}
              size="sm"
              variant={cvdType === opt.id ? 'default' : 'outline'}
              onClick={() => onCvdChange(opt.id)}
              className="text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* CVD preview swatches */}
      {cvdType !== 'none' && entries.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2">Simulated colours</p>
          <div className="flex gap-1 flex-wrap">
            {entries.map(e => {
              const sim = simulateCvd(e.value, cvdType)
              return (
                <div key={e.id} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-7 h-7 rounded border"
                    style={{ backgroundColor: toHex(e.value) }}
                    title="Original"
                  />
                  <div
                    className="w-7 h-7 rounded border"
                    style={{ backgroundColor: toHex(sim) }}
                    title={`Simulated ${cvdType}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* WCAG contrast pairs */}
      <div>
        <p className="text-xs font-medium mb-2">WCAG contrast ({pairs.length} pairs)</p>
        {pairs.length === 0 && (
          <p className="text-xs text-muted-foreground">Add at least 2 colours to see contrast ratios.</p>
        )}
        <div className="space-y-2">
          {pairs.map(({ a, b, result }) => (
            <div key={`${a.id}-${b.id}`} className="flex items-center gap-2 text-xs">
              {/* Colour chips */}
              <div className="flex gap-0.5 shrink-0">
                <div
                  className="w-4 h-4 rounded-sm border"
                  style={{ backgroundColor: toHex(a.value) }}
                />
                <div
                  className="w-4 h-4 rounded-sm border"
                  style={{ backgroundColor: toHex(b.value) }}
                />
              </div>
              {/* Ratio */}
              <span className="font-mono shrink-0 w-10 text-right">{result.ratio.toFixed(2)}:1</span>
              {/* Badges */}
              <div className="flex gap-1 flex-wrap">
                <Badge pass={result.aa} label="AA" />
                <Badge pass={result.aaa} label="AAA" />
                <Badge pass={result.largeAA} label="Lg AA" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
