"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Palette from "@/components/palette/palette"

function PaletteContent() {
  const searchParams = useSearchParams()
  const colours = searchParams.get("p")?.split(",").map((c) => `#${c}`) ?? []
  const name = searchParams.get("name") ?? undefined

  return (
    <div className="flex justify-center">
      <div>
        <Palette colours={colours} name={name ?? ""} />
        <div className="px-8 font-semibold">
          <span className="tag">{name}</span>
        </div>
      </div>
    </div>
  )
}

export default function PalettePage() {
  return (
    <div className="mx-auto">
      <Suspense>
        <PaletteContent />
      </Suspense>
    </div>
  )
}
