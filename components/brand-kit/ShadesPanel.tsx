'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { generateShades } from '@/utils/brandKitUtils'

interface ShadesPanelProps {
  colours: string[]
}

export default function ShadesPanel({ colours }: ShadesPanelProps) {
  const [copied, setCopied] = useState('')

  function copy(hex: string) {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="space-y-6">
      {colours.map((hex, i) => {
        const shades = generateShades(hex)
        return (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm border border-border" style={{ backgroundColor: hex }} />
              <span className="text-xs font-mono text-muted-foreground">{hex}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {shades.map(stop => (
                <button
                  key={stop.label}
                  onClick={() => copy(stop.hex)}
                  className="flex flex-col items-center gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  title={`${stop.label}: ${stop.hex}`}
                >
                  <div
                    className="w-9 h-9 rounded-md border border-border/40 flex items-center justify-center"
                    style={{ backgroundColor: stop.hex }}
                  >
                    {copied === stop.hex && (
                      <Check
                        className="h-3 w-3"
                        style={{ color: stop.l > 0.55 ? '#1a1a1a' : '#ffffff' }}
                      />
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-mono">{stop.label}</span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
