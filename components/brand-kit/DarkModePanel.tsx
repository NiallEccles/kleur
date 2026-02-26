'use client'

import { useMemo } from 'react'
import { generateDarkVariant } from '@/utils/brandKitUtils'
import ComponentPreview from './ComponentPreview'

interface DarkModePanelProps {
  colours: string[]
}

export default function DarkModePanel({ colours }: DarkModePanelProps) {
  const darkColours = useMemo(
    () => colours.map(generateDarkVariant),
    [colours]
  )

  return (
    <div className="space-y-6">
      {/* Swatch pair comparison */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Original → Dark variant</p>
        <div className="flex gap-4 flex-wrap">
          {colours.map((hex, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: hex }}
                title={hex}
              />
              <div className="w-0.5 h-3 bg-border rounded-full mx-auto" />
              <div
                className="w-8 h-8 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: darkColours[i] }}
                title={darkColours[i]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side component preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium">Light mode</p>
          <ComponentPreview colours={colours} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium">Dark mode variant</p>
          <ComponentPreview colours={darkColours} />
        </div>
      </div>
    </div>
  )
}
