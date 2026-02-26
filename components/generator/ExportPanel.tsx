'use client'

import React, { useState } from 'react'
import { Copy, Check, Download, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ColorEntry } from '@/types/color'
import { toCss } from '@/utils/colorUtils'
import { downloadText, downloadPng, copyToClipboard } from '@/utils/exportUtils'

type ExportFormat = 'css' | 'tailwind' | 'json'

interface ExportPanelProps {
  entries: ColorEntry[]
  /** Optional: provide a draw function for PNG export */
  drawPng?: () => HTMLCanvasElement | null
  /** If false, hide Tailwind option */
  showTailwind?: boolean
  /** Override the CSS export output (e.g. for gradients/mesh) */
  cssOverride?: string
  /** If provided, shows a Share button that copies this URL to clipboard */
  shareHref?: string
}

function buildCss(entries: ColorEntry[]): string {
  return entries.map((e, i) => `  --color-${i + 1}: ${toCss(e.value)};`).join('\n')
    .replace(/^/, ':root {\n') + '\n}'
}

function buildTailwind(entries: ColorEntry[]): string {
  const colors = entries
    .map((e, i) => `      "color-${i + 1}": "${toCss(e.value)}"`)
    .join(',\n')
  return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors}\n      }\n    }\n  }\n}`
}

function buildJson(entries: ColorEntry[]): string {
  return JSON.stringify(entries, null, 2)
}

export default function ExportPanel({ entries, drawPng, showTailwind = true, cssOverride, shareHref }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('css')
  const [copied, setCopied] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)

  const content =
    format === 'css' ? (cssOverride ?? buildCss(entries)) :
    format === 'tailwind' ? buildTailwind(entries) :
    buildJson(entries)

  async function handleCopy() {
    await copyToClipboard(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleDownloadText() {
    const ext = format === 'json' ? 'json' : format === 'tailwind' ? 'js' : 'css'
    downloadText(content, `kleur-export.${ext}`)
  }

  function handleDownloadPng() {
    const canvas = drawPng?.()
    if (canvas) downloadPng(canvas, 'kleur-export.png')
  }

  async function handleShare() {
    if (!shareHref) return
    const url = window.location.origin + shareHref
    await copyToClipboard(url)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 1500)
  }

  const formats: { id: ExportFormat; label: string }[] = [
    { id: 'css', label: 'CSS' },
    ...(showTailwind ? [{ id: 'tailwind' as ExportFormat, label: 'Tailwind' }] : []),
    { id: 'json', label: 'JSON' },
  ]

  return (
    <div className="space-y-3">
      {/* Format selector */}
      <div className="flex gap-1">
        {formats.map(f => (
          <Button
            key={f.id}
            size="sm"
            variant={format === f.id ? 'default' : 'outline'}
            onClick={() => setFormat(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Preview */}
      <pre className="text-xs bg-muted rounded p-3 overflow-x-auto max-h-48 whitespace-pre-wrap break-all">
        {content}
      </pre>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleCopy} className="flex-1">
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadText} className="flex-1">
          <Download className="h-3 w-3 mr-1" /> Download
        </Button>
        {drawPng && (
          <Button size="sm" variant="outline" onClick={handleDownloadPng}>
            PNG
          </Button>
        )}
      </div>

      {/* Share */}
      {shareHref && (
        <Button size="sm" variant="outline" onClick={handleShare} className="w-full">
          {copiedShare ? <Check className="h-3 w-3 mr-1" /> : <Link className="h-3 w-3 mr-1" />}
          {copiedShare ? 'Link copied!' : 'Copy share link'}
        </Button>
      )}
    </div>
  )
}
