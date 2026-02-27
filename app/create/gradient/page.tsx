"use client"

import NewGradient from "@/components/new-gradient/new-gradient"
import PageTitle from "@/components/page-title/page-title"

export default function CreateGradientPage() {
  return (
    <div className="mx-5 space-y-12">
      <PageTitle title="Create Gradient" />
      <NewGradient />
    </div>
  )
}
