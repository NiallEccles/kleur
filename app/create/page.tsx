"use client"

import PageTitle from "@/components/page-title/page-title"
import Tile from "@/components/tile/tile"

export default function CreatePage() {
  const actionItems = [
    {
      name: "Palette",
      route: "/create/palette",
    },
    {
      name: "Gradient",
      route: "/create/gradient",
    },
    {
      name: "Radial Gradient",
      route: "/create/radial-gradient",
    },
  ]

  return (
    <div className="mx-auto">
      <PageTitle title="Create" />
      <div className="grid grid-flow-row-dense grid-cols-2 grid-rows-2 gap-4">
        {actionItems.map((item, index) => (
          <Tile key={index} label={item.name} route={item.route} />
        ))}
      </div>
    </div>
  )
}
