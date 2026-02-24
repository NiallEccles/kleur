"use client"

import MeshGradientGenerator from "@/components/mesh-gradient/mesh-gradient"
import PageTitle from "@/components/page-title/page-title"

export default function CreateMeshGradientPage() {
  return (
    <div className="mx-auto">
      <PageTitle title="Mesh Gradient" />
      <MeshGradientGenerator />
    </div>
  )
}
