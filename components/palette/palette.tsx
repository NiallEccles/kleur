'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'
import { relativeLuminance } from '@/utils/colorUtils'

function textColorFor(hex: string): string {
  try {
    const lum = relativeLuminance({ space: 'hex', value: hex })
    return lum > 0.35 ? '#1a1a1a' : '#ffffff'
  } catch {
    return '#1a1a1a'
  }
}

export default function Palette({ colours, name, analyseHref }: { colours: string[]; name: string; analyseHref?: string }) {
  const [copied, setCopied] = useState('')

  function copy(colour: string) {
    navigator.clipboard.writeText(colour)
    setCopied(colour)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-border shadow-sm">
      {colours.map((colour, i) => {
        const fg = textColorFor(colour)
        const isCopied = copied === colour
        return (
          <button
            key={i}
            className="group w-full flex items-center justify-between px-3 py-3.5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            style={{ backgroundColor: colour }}
            onClick={() => copy(colour)}
            aria-label={`Copy ${colour}`}
          >
            <span className="font-mono text-xs" style={{ color: fg }}>
              {colour.toLowerCase()}
            </span>
            <span style={{ color: fg }} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {isCopied
                ? <Check className="h-3.5 w-3.5" />
                : <Copy className="h-3.5 w-3.5" />}
            </span>
          </button>
        )
      })}
      {(name || analyseHref) && (
        <div className="px-3 py-2.5 bg-card border-t border-border flex items-center justify-between">
          {name && <p className="text-sm font-medium truncate">{name}</p>}
          {analyseHref && (
            <Link href={analyseHref} className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-auto">
              Analyse →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
