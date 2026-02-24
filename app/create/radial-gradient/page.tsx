"use client"

import NewRadialGradient from "@/components/new-radial-gradient/new-radial-gradient"
import PageTitle from "@/components/page-title/page-title"

export default function CreateRadialGradientPage() {
  return (
    <div className="mx-auto">
      <PageTitle title="Create Radial Gradient" />
      <NewRadialGradient />
    </div>
  )
}
