"use client"

import Link from "next/link"
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
import { buildAnalyseHref } from "@/utils/brandKitUtils"

function SectionHeader({ title, href }) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="text-xl font-bold">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          See all →
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <div className="mx-auto space-y-12">
      <Hero />

      {/* Featured Palettes */}
      <section className="mx-5 space-y-12">
        <SectionHeader title="Featured Palettes" href={PAGES.PALETTES} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {palettes.slice(0, 3).map((palette, i) => (
            <Palette
              key={i}
              colours={palette.colours}
              name={palette.name}
              analyseHref={buildAnalyseHref(palette.colours, palette.name)}
            />
          ))}
          <Skeleton route={PAGES.NEW.PALETTE} />
        </div>
      </section>

      {/* Featured Gradients */}
      <section className="mx-5 space-y-12">
        <SectionHeader title="Featured Gradients" href={PAGES.GRADIENTS} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gradients.slice(0, 3).map((gradient, i) => (
            <Gradient key={i} colours={gradient.colours} name={gradient.name} />
          ))}
          <Skeleton route={PAGES.NEW.GRADIENT} />
        </div>
      </section>

      {/* Saved items */}
      <LocalPalettes />
      <LocalGradients />
      <LocalMeshes />
    </div>
  )
}
