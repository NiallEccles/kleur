"use client"

import { gradients } from "@/data/gradients"
import Gradient from "@/components/gradient/gradient"
import PageTitle from "@/components/page-title/page-title"

export default function GradientsPage() {
  return (
    <div className="mx-auto">
      <PageTitle title="Gradients" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {gradients.map((palette, index) => (
          <div key={index} className="mx-auto">
            <Gradient key={index} colours={palette.colours} name={palette.name} />
          </div>
        ))}
      </div>
    </div>
  )
}
