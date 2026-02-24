"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Gradient from "@/components/gradient/gradient"

function GradientContent() {
  const searchParams = useSearchParams()
  const colours = searchParams.get("p")?.split(",").map((c) => `#${c}`) ?? []
  const name = searchParams.get("name") ?? undefined

  return (
    <div className="flex justify-center">
      <div>
        <Gradient colours={colours} />
        <div className="px-8">
          <span className="tag">{name}</span>
        </div>
      </div>
    </div>
  )
}

export default function GradientPage() {
  return (
    <div className="mx-auto">
      <Suspense>
        <GradientContent />
      </Suspense>
    </div>
  )
}
