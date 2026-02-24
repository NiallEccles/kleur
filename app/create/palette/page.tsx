"use client"

import NewPalette from "@/components/new-palette/new-palette"
import PageTitle from "@/components/page-title/page-title"

export default function CreatePalettePage() {
  return (
    <div className="mx-auto">
      <PageTitle title="Create Palette" />
      <NewPalette />
    </div>
  )
}
