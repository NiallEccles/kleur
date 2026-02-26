'use client'

import { useMemo, useState } from 'react'
import { makeColorEntry } from '@/utils/colorUtils'
import { useWcagContrast } from '@/customHooks/useWcagContrast'
import { useCvdSimulation } from '@/customHooks/useCvdSimulation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import A11yPanel from '@/components/generator/A11yPanel'
import ComponentPreview from './ComponentPreview'
import ShadesPanel from './ShadesPanel'
import DarkModePanel from './DarkModePanel'

interface BrandKitTabsProps {
  colours: string[]
  name: string
}

export default function BrandKitTabs({ colours, name }: BrandKitTabsProps) {
  const { cvdType, setCvdType } = useCvdSimulation()

  const entries = useMemo(
    () => colours.map(hex => makeColorEntry({ space: 'hex', value: hex })),
    [colours]
  )

  const pairs = useWcagContrast(entries)

  return (
    <div className="space-y-4">
      {/* Palette strip */}
      <div className="flex items-center gap-2 flex-wrap">
        {colours.map((hex, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border border-border shadow-sm"
            style={{ backgroundColor: hex }}
            title={hex}
          />
        ))}
        <span className="text-sm font-medium ml-1">{name}</span>
      </div>

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="shades">Shades</TabsTrigger>
          <TabsTrigger value="a11y">A11y</TabsTrigger>
          <TabsTrigger value="darkmode">Dark Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-4">
          <ComponentPreview colours={colours} />
        </TabsContent>

        <TabsContent value="shades" className="mt-4">
          <ShadesPanel colours={colours} />
        </TabsContent>

        <TabsContent value="a11y" className="mt-4">
          <A11yPanel
            entries={entries}
            pairs={pairs}
            cvdType={cvdType}
            onCvdChange={setCvdType}
          />
        </TabsContent>

        <TabsContent value="darkmode" className="mt-4">
          <DarkModePanel colours={colours} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
