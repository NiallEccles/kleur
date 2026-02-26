"use client"

import { gradients } from "@/data/gradients"
import Gradient from "@/components/gradient/gradient"
import PageTitle from "@/components/page-title/page-title"

export default function GradientsPage() {
  return (
    <div className="mx-auto space-y-6">
      <PageTitle title="Gradients" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {gradients.map((gradient, index) => (
          <Gradient key={index} colours={gradient.colours} name={gradient.name} />
        ))}
      </div>
    </div>
  )
}
