"use client"

import { Layers, Palette, Zap } from "lucide-react"
import ToolCard from "@/components/tool-card/tool-card"

export default function ExplorePage() {
  const generatorTools = [
    {
      title: "Palette Generator",
      description: "Create stunning color palettes from scratch, images, or keywords",
      icon: Palette,
      href: "/create/palette",
      badge: "AI Powered",
      isPopular: true,
      preview: (
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          <div className="w-8 h-8 bg-purple-500 rounded"></div>
          <div className="w-8 h-8 bg-emerald-500 rounded"></div>
          <div className="w-8 h-8 bg-orange-500 rounded"></div>
          <div className="w-8 h-8 bg-pink-500 rounded"></div>
        </div>
      ),
    },
    {
      title: "Gradient Builder",
      description: "Create beautiful CSS gradients with live preview and export",
      icon: Layers,
      href: "/create/gradient",
      isNew: true,
      preview: <div className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded"></div>,
    },
    {
      title: "Mesh Gradient Builder",
      description: "Generate complementary, triadic, analogous, and split-complementary colors",
      icon: Zap,
      href: "/create/mesh-gradient",
      preview: (
        <div className="relative w-full h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded opacity-80"></div>
          <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded flex items-center justify-center">
            <span className="text-xs font-medium">Harmony Preview</span>
          </div>
        </div>
      ),
    },
  ]
  return (
    <div className="mx-auto">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mt-6 mb-12 text-center">Colour Tools for Every Need</h1>
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-2xl font-semibold">Generators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatorTools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
