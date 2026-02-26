'use client'

import { useEffect, useState } from "react"
import { Pencil, Trash2, Check, X } from "lucide-react"
import Mesh from "@/components/mesh/mesh"
import { toHex } from "@/utils/colorUtils"
import type { MeshColorEntry } from "@/types/color"

const STORAGE_KEY = "meshGradients"

type OldColorPoint = { id: string; color: string; x: number; y: number; blurRadius: number }
type ColorPoint = { id: string; color: string; x: number; y: number; blurRadius: number }
type StoredItem = { name: string; controls: OldColorPoint[] | MeshColorEntry[]; [key: string]: unknown }

function normaliseControls(controls: OldColorPoint[] | MeshColorEntry[]): ColorPoint[] {
  if (!controls || controls.length === 0) return []
  const first = controls[0] as Record<string, unknown>
  if ('color' in first) return controls as ColorPoint[]
  return (controls as MeshColorEntry[]).map(e => ({
    id: e.id,
    color: toHex(e.value),
    x: e.x,
    y: e.y,
    blurRadius: e.blurRadius,
  }))
}

export default function LocalMeshes() {
  const [items, setItems] = useState<StoredItem[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [pendingName, setPendingName] = useState('')

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try { setItems(JSON.parse(stored)) } catch { setItems([]) }
    }
  }, [])

  function persist(updated: StoredItem[]) {
    setItems(updated)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function handleDelete(index: number) {
    persist(items.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  function startEdit(index: number) {
    setEditingIndex(index)
    setPendingName(items[index].name ?? '')
  }

  function commitRename() {
    if (editingIndex === null) return
    const updated = items.map((item, i) =>
      i === editingIndex ? { ...item, name: pendingName.trim() || item.name } : item
    )
    persist(updated)
    setEditingIndex(null)
  }

  function cancelEdit() {
    setEditingIndex(null)
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold px-1">My Mesh Gradients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((mesh, i) => {
          const isEditing = editingIndex === i
          return (
            <div key={i}>
              <Mesh
                controls={normaliseControls(mesh.controls as OldColorPoint[] | MeshColorEntry[])}
                name={mesh.name}
              />
              <div className="flex items-center gap-1 mt-1 px-0.5">
                {isEditing ? (
                  <>
                    <input
                      autoFocus
                      value={pendingName}
                      onChange={e => setPendingName(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitRename()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                      className="flex-1 text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <button onClick={commitRename} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Confirm rename">
                      <Check className="h-3 w-3" />
                    </button>
                    <button onClick={cancelEdit} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Cancel rename">
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex gap-1 ml-auto">
                    <button onClick={() => startEdit(i)} className="p-1 text-muted-foreground hover:text-foreground rounded" aria-label="Rename mesh gradient">
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleDelete(i)} className="p-1 text-muted-foreground hover:text-destructive rounded" aria-label="Delete mesh gradient">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
