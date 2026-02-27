"use client"

import { palettes } from "@/data/palettes"
import Palette from "@/components/palette/palette"
import PageTitle from "@/components/page-title/page-title"
import { buildAnalyseHref } from "@/utils/brandKitUtils"

export default function PalettesPage() {
  return (
    <div className="mx-5 space-y-12">
      <PageTitle title="Palettes" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {palettes.map((palette, index) => (
          <Palette
            key={index}
            colours={palette.colours}
            name={palette.name}
            analyseHref={buildAnalyseHref(palette.colours, palette.name)}
          />
        ))}
      </div>
    </div>
  )
}
