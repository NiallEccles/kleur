"use client"

import PageTitle from "@/components/page-title/page-title"
import ColourCombinations from "@/components/colour-combinations/colour-combinations"

export default function ColoursPage() {
  return (
    <div className="mx-auto">
      <PageTitle title="Colours" />
      <ColourCombinations />
    </div>
  )
}
