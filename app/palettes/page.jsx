"use client"

import { palettes } from "@/data/palettes"
import Palette from "@/components/palette/palette"
import PageTitle from "@/components/page-title/page-title"

export default function PalettesPage() {
  return (
    <div className="mx-auto">
      <PageTitle title="Palettes" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {palettes.map((palette, index) => (
          <div key={index} className="flex mx-auto">
            <Palette key={index} colours={palette.colours} name={palette.name} />
          </div>
        ))}
      </div>
    </div>
  )
}
