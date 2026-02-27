"use client"

import MeshGradientGenerator from "@/components/mesh-gradient/mesh-gradient"
import PageTitle from "@/components/page-title/page-title"

export default function CreateMeshGradientPage() {
  return (
    <div className="mx-5 my-25 space-y-12">
      <PageTitle title="Mesh Gradient" />
      <MeshGradientGenerator />
    </div>
  )
}
