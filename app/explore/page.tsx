"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeftRight, Briefcase } from "lucide-react"
import PageTitle from "@/components/page-title/page-title"
import PaletteCard from "@/components/palette/palette"
import GradientCard from "@/components/gradient/gradient"
import { palettes } from "@/data/palettes"
import { gradients } from "@/data/gradients"
import { buildAnalyseHref } from "@/utils/brandKitUtils"

function SectionHeader({ title, href }: { title: string; href?: string }) {
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

// ---------------------------------------------------------------------------
// Animated generator previews (CSS keyframes only — no animation library)
// ---------------------------------------------------------------------------

function PalettePreview() {
  const colors = ["#06283D", "#1363DF", "#47B5FF", "#9DF3C4", "#E80F88"]
  return (
    <div className="flex gap-1.5 w-full">
      {colors.map((c, i) => (
        <div
          key={c}
          className="h-10 flex-1 rounded"
          style={{
            backgroundColor: c,
            animation: `kleur-swatch-pop 2s ease-in-out ${i * 0.18}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

function GradientPreview() {
  return (
    <div
      className="w-full h-10 rounded"
      style={{
        background: "linear-gradient(90deg, #30cfd0, #330867, #ff0844, #ffb199, #30cfd0)",
        backgroundSize: "300% 100%",
        animation: "kleur-gradient-shift 4s linear infinite",
      }}
    />
  )
}

function MeshPreview() {
  return (
    <div className="relative w-full h-10 rounded overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 50%, #3b82f6 0%, transparent 60%), " +
            "radial-gradient(circle at 70% 50%, #ec4899 0%, transparent 60%), " +
            "radial-gradient(circle at 50% 10%, #10b981 0%, transparent 50%)",
          filter: "blur(6px)",
          transform: "scale(1.25)",
          animation: "kleur-mesh-float 3.5s ease-in-out infinite alternate",
        }}
      />
    </div>
  )
}

function RadialPreview() {
  return (
    <div
      className="w-full h-10 rounded"
      style={{
        background: "radial-gradient(circle, #F76E11 0%, #FF9F45 40%, #FFBC80 100%)",
        animation: "kleur-radial-pulse 2.5s ease-in-out infinite",
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const GENERATORS = [
  {
    title: "Palette",
    description: "Build a custom colour palette from scratch with harmonious combinations",
    href: "/create/palette",
    preview: <PalettePreview />,
  },
  {
    title: "Linear Gradient",
    description: "Design smooth linear gradients with full angle and colour stop control",
    href: "/create/gradient",
    preview: <GradientPreview />,
  },
  {
    title: "Mesh Gradient",
    description: "Create organic, multi-colour mesh gradients with draggable control points",
    href: "/create/mesh-gradient",
    preview: <MeshPreview />,
  },
  {
    title: "Radial Gradient",
    description: "Generate vibrant radial gradients that radiate from a central focal point",
    href: "/create/radial-gradient",
    preview: <RadialPreview />,
  },
]

const TOOLS = [
  {
    title: "Brand Kit",
    description:
      "Analyse your palette — shade scales, dark mode, WCAG accessibility, and component previews",
    href: "/brand-kit",
    icon: Briefcase,
  },
  {
    title: "Convert",
    description: "Convert colours instantly between HEX, RGB, HSL, and OKLCH",
    href: "/convert",
    icon: ArrowLeftRight,
  },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ExplorePage() {
  // Deterministic daily palette — advances every 24 h
  const dayIndex = useMemo(
    () => Math.floor(Date.now() / 86_400_000) % palettes.length,
    []
  )
  const paletteOfTheDay = palettes[dayIndex]
  const featuredPalettes = palettes.filter((_, i) => i !== dayIndex).slice(0, 3)
  const featuredGradients = gradients.slice(0, 3)

  return (
    <>
      {/* Scoped keyframe animations */}
      <style>{`
        @keyframes kleur-swatch-pop {
          from { opacity: 0.7; transform: scaleY(0.88); }
          to   { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes kleur-gradient-shift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes kleur-mesh-float {
          from { transform: scale(1.25) translate(-8%, -4%); }
          to   { transform: scale(1.25) translate(8%, 4%); }
        }
        @keyframes kleur-radial-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
      `}</style>

      <div className="mx-5 space-y-12">
        <PageTitle title="Explore" />

        {/* ── Palette of the Day ── */}
        <section className="space-y-4">
          <SectionHeader title="Palette of the Day" />
          <div className="max-w-xs">
            <PaletteCard
              colours={paletteOfTheDay.colours}
              name={paletteOfTheDay.name || "Today's Pick"}
              analyseHref={buildAnalyseHref(paletteOfTheDay.colours, paletteOfTheDay.name)}
            />
          </div>
        </section>

        {/* ── Trending Palettes ── */}
        <section className="space-y-4">
          <SectionHeader title="Trending Palettes" href="/palettes" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPalettes.map((palette, i) => (
              <PaletteCard
                key={i}
                colours={palette.colours}
                name={palette.name}
                analyseHref={buildAnalyseHref(palette.colours, palette.name)}
              />
            ))}
          </div>
        </section>

        {/* ── Trending Gradients ── */}
        <section className="space-y-4">
          <SectionHeader title="Trending Gradients" href="/gradients" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGradients.map((gradient, i) => (
              <GradientCard key={i} colours={gradient.colours} name={gradient.name} />
            ))}
          </div>
        </section>

        {/* ── Generators ── */}
        <section className="space-y-4">
          <SectionHeader title="Generators" href="/create" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GENERATORS.map((gen) => (
              <Link
                key={gen.href}
                href={gen.href}
                className="group flex flex-col gap-3 p-4 rounded-xl border border-border hover:border-foreground/25 hover:bg-accent/40 transition-all"
              >
                <div className="rounded-md overflow-hidden">{gen.preview}</div>
                <div>
                  <p className="font-semibold text-sm">{gen.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {gen.description}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Tools ── */}
        <section className="space-y-4">
          <SectionHeader title="Tools" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOOLS.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-4 p-4 rounded-xl border border-border hover:border-foreground/25 hover:bg-accent/40 transition-all"
              >
                <div className="p-2 rounded-lg bg-muted shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
