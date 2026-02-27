'use client'

import React from 'react'

interface GeneratorLayoutProps {
  canvas: React.ReactNode
  panel: React.ReactNode
}

export default function GeneratorLayout({ canvas, panel }: GeneratorLayoutProps) {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_300px] h-[calc(100dvh-100px)]">
      <div className="relative h-full">{canvas}</div>
      <div className="space-y-4">{panel}</div>
    </div>
  )
}
