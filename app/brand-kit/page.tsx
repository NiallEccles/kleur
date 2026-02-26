'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageTitle from '@/components/page-title/page-title'
import BrandKitTabs from '@/components/brand-kit/BrandKitTabs'

const DEFAULT_COLOURS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
const DEFAULT_NAME    = 'Sample Palette'

function BrandKitContent() {
  const searchParams = useSearchParams()
  const raw = searchParams.get('p')?.split(',').map(c => `#${c}`) ?? []
  const colours = raw.length > 0 ? raw : DEFAULT_COLOURS
  const name    = searchParams.get('name') ?? (raw.length > 0 ? 'Untitled' : DEFAULT_NAME)

  return <BrandKitTabs colours={colours} name={name} />
}

export default function BrandKitPage() {
  return (
    <div className="mx-auto space-y-6">
      <PageTitle title="Brand Kit" />
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading…</div>}>
        <BrandKitContent />
      </Suspense>
    </div>
  )
}
