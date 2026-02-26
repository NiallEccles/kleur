'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GeneratorPanelProps {
  colorsTab: React.ReactNode
  settingsTab: React.ReactNode
  exportTab: React.ReactNode
  a11yTab: React.ReactNode
}

export default function GeneratorPanel({
  colorsTab,
  settingsTab,
  exportTab,
  a11yTab,
}: GeneratorPanelProps) {
  return (
    <Tabs defaultValue="colors">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
        <TabsTrigger value="a11y">A11y</TabsTrigger>
      </TabsList>
      <TabsContent value="colors" className="space-y-3 pt-4">
        {colorsTab}
      </TabsContent>
      <TabsContent value="settings" className="space-y-4 pt-4">
        {settingsTab}
      </TabsContent>
      <TabsContent value="export" className="space-y-4 pt-4">
        {exportTab}
      </TabsContent>
      <TabsContent value="a11y" className="space-y-4 pt-4">
        {a11yTab}
      </TabsContent>
    </Tabs>
  )
}
