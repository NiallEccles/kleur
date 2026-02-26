'use client'

import { assignRoles } from '@/utils/brandKitUtils'

interface ComponentPreviewProps {
  colours: string[]
}

export default function ComponentPreview({ colours }: ComponentPreviewProps) {
  const roles = assignRoles(colours)

  return (
    <div
      className="rounded-xl overflow-hidden border border-border shadow-sm"
      style={{ backgroundColor: roles.surface, color: roles.surfaceFg }}
    >
      {/* Nav bar */}
      <nav
        style={{ backgroundColor: roles.primary, color: roles.primaryFg }}
        className="flex items-center justify-between px-4 py-3"
      >
        <span className="font-bold text-sm">Acme Co.</span>
        <div className="flex gap-4 text-sm">
          <span>Home</span>
          <span>Products</span>
          <span>About</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-6 py-8 space-y-4">
        <h1 className="text-2xl font-bold" style={{ color: roles.surfaceFg }}>
          Build something great
        </h1>
        <p className="text-sm" style={{ color: roles.surfaceFg, opacity: 0.7 }}>
          The fastest way to ship your next project. Start building today.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: roles.primary, color: roles.primaryFg }}
          >
            Get started
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold border"
            style={{ borderColor: roles.primary, color: roles.primary, backgroundColor: 'transparent' }}
          >
            Learn more
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="px-6 pb-6">
        <div
          className="rounded-lg border p-4 space-y-3"
          style={{ backgroundColor: roles.surface, borderColor: roles.muted + '44' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm" style={{ color: roles.surfaceFg }}>
                Featured plan
              </p>
              <p className="text-xs" style={{ color: roles.surfaceFg, opacity: 0.6 }}>
                Everything you need to get started
              </p>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: roles.accent, color: roles.accentFg }}
            >
              Popular
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-1 rounded-md font-medium"
              style={{ backgroundColor: roles.muted, color: roles.mutedFg }}
            >
              Free tier
            </span>
            <span
              className="text-xs px-2 py-1 rounded-md font-medium"
              style={{ backgroundColor: roles.accent + '22', color: roles.accent }}
            >
              Pro
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
