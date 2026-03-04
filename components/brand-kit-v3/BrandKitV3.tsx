'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import PageTitle from '@/components/page-title/page-title'
import { Button } from '@/components/ui/button'
import { makeColorEntry, toHex } from '@/utils/colorUtils'
import { useColorEntries } from '@/customHooks/useColorEntries'
import BrandShades from './brand-shades'

const LS_KEY = 'brand-kit-v3'
const INITIAL_HEX = '#1FAB89'

export default function BrandKitV3() {
  const initialEntry = makeColorEntry({ space: 'hex', value: INITIAL_HEX })

  const { entries, displaySpace, addEntry, removeEntry, updateEntry, setEntries } =
    useColorEntries([initialEntry], 'hex')

  const [names, setNames] = useState<Record<string, string>>({ [initialEntry.id]: 'Primary' })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const saved: { hex: string; name: string }[] = JSON.parse(raw)
        if (Array.isArray(saved) && saved.length > 0) {
          const restoredEntries = saved.map(item =>
            makeColorEntry({ space: 'hex', value: item.hex })
          )
          const restoredNames: Record<string, string> = {}
          restoredEntries.forEach((entry, i) => {
            restoredNames[entry.id] = saved[i].name ?? ''
          })
          setEntries(restoredEntries)
          setNames(restoredNames)
        }
      }
    } catch {}
    setLoaded(true)
  }, [setEntries])

  useEffect(() => {
    if (!loaded) return
    const data = entries.map(e => ({
      hex: toHex(e.value),
      name: names[e.id] ?? '',
    }))
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  }, [entries, names, loaded])

  function handleAdd() {
    const newEntry = makeColorEntry({ space: 'hex', value: '#6366f1' })
    setEntries(prev => [...prev, newEntry])
    setNames(prev => ({ ...prev, [newEntry.id]: '' }))
  }

  function handleRemove(id: string) {
    removeEntry(id)
    setNames(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function handleNameChange(id: string, name: string) {
    setNames(prev => ({ ...prev, [id]: name }))
  }

  function handleHexChange(id: string, hex: string) {
    updateEntry(id, { space: 'hex', value: hex })
  }

  return (
    <div className="mx-5 space-y-8 pb-12">
      <div className='flex flex-row justify-between items-baseline'>
        <PageTitle title="Brand Kit" />
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add colour
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entries.map(entry => (
          <BrandShades
            key={entry.id}
            hex={toHex(entry.value)}
            displaySpace={displaySpace}
            name={names[entry.id] ?? ''}
            layout="vertical"
            onNameChange={name => handleNameChange(entry.id, name)}
            onHexChange={hex => handleHexChange(entry.id, hex)}
            onRemove={entries.length > 1 ? () => handleRemove(entry.id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
