'use client'

import { useState } from 'react'
import { Copy, Check, RotateCw } from 'lucide-react'

type GradientProps = {
  colours: string[]
  name?: string
}

export default function Gradient({ colours, name }: GradientProps) {
  const [degrees, setDegrees] = useState(180)
  const [copied, setCopied] = useState(false)

  const gradientCss = `linear-gradient(${degrees}deg, ${colours.join(', ')})`

  function copy() {
    navigator.clipboard.writeText(`background: ${gradientCss};`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border shadow-sm">
      {/* Gradient preview */}
      <div
        className="relative h-36 w-full"
        style={{ background: gradientCss }}
      >
        <button
          onClick={copy}
          className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-md bg-black/30 hover:bg-black/50 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Copy CSS gradient"
        >
          {copied
            ? <Check className="h-3.5 w-3.5" />
            : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Colour stop bar */}
      <div className="flex h-1.5">
        {colours.map((c, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      {/* Name + angle */}
      <div className="px-3 py-2.5 bg-card space-y-2">
        {name && <p className="text-sm font-medium truncate">{name}</p>}
        <div className="flex items-center gap-2">
          <RotateCw className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden />
          <input
            type="range"
            min={0}
            max={360}
            value={degrees}
            onChange={e => setDegrees(Number(e.target.value))}
            className="flex-1 h-1.5 accent-foreground"
            aria-label="Gradient angle"
          />
          <span className="text-xs text-muted-foreground w-9 text-right tabular-nums">{degrees}°</span>
        </div>
      </div>
    </div>
  )
}
