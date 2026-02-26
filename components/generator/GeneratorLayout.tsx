'use client'

import React from 'react'

interface GeneratorLayoutProps {
  canvas: React.ReactNode
  panel: React.ReactNode
}

export default function GeneratorLayout({ canvas, panel }: GeneratorLayoutProps) {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_300px]">
      <div className="relative">{canvas}</div>
      <div className="space-y-4">{panel}</div>
    </div>
  )
}
