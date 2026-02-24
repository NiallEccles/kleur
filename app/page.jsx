"use client"

import Palette from "@/components/palette/palette"
import Gradient from "@/components/gradient/gradient"
import { gradients } from "@/data/gradients"
import { palettes } from "@/data/palettes"
import Skeleton from "@/components/skeleton/skeleton"
import { PAGES } from "/public/constants"
import Hero from "@/components/hero/hero"
import LocalGradients from "@/components/local-gradients/local-gradients"
import LocalPalettes from "@/components/local-palettes/local-gradients"
import LocalMeshes from "@/components/local-meshes/local-meshes"

export default function Home() {
  return (
    <div className="mx-auto">
      <Hero />
      <h2 className="text-2xl font-bold ml-5">Featured Palettes</h2>
      <div className="flex flex-wrap w-full justify-between mx-auto">
        {palettes.map((palette, index) =>
          index < 3 ? (
            <div key={index}>
              <Palette key={index} colours={palette.colours} name={palette.name} />
            </div>
          ) : (
            ""
          )
        )}
        <div>
          <Skeleton route={PAGES.NEW.PALETTE} />
        </div>
      </div>
      <br />
      <h2 className="text-2xl font-bold ml-5">Featured Gradients</h2>
      <div className="flex flex-wrap w-full justify-between mx-auto">
        {gradients.map((gradient, index) =>
          index < 3 ? (
            <div key={index}>
              <Gradient key={index} colours={gradient.colours} name={gradient.name} />
            </div>
          ) : (
            ""
          )
        )}
        <div>
          <Skeleton route={PAGES.NEW.GRADIENT} />
        </div>
      </div>
      <br />
      <LocalPalettes />
      <br />
      <LocalGradients />
      <br />
      <LocalMeshes />
    </div>
  )
}
