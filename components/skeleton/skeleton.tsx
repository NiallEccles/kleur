import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function Skeleton({ route }: { route: string }) {
  return (
    <Link href={route} className="block w-full h-full min-h-[180px]">
      <div className="flex flex-col items-center justify-center gap-2 w-full h-full min-h-[180px] rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors">
        <Plus className="h-5 w-5" />
        <span className="text-sm font-medium">Create your own</span>
      </div>
    </Link>
  )
}
