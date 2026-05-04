'use client'

import { useState, useEffect, useRef } from 'react'

type Props = {
  serviceName: string
  onRun: (apiKey: string) => void
  onClose: () => void
}

export default function ApiKeyModal({ serviceName, onRun, onClose }: Props) {
  const [apiKey, setApiKey] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!apiKey.trim()) return
    onRun(apiKey.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl border border-[hsl(var(--card-border))] bg-card p-6 shadow-card">
        <h2 className="text-base font-semibold text-foreground mb-1">{serviceName}</h2>
        <p className="text-xs text-foreground-muted mb-4">Enter API key to trigger backup</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="X-API-Key"
            className="w-full rounded-lg border border-[hsl(var(--card-border))] bg-[hsl(var(--muted))] px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[hsl(var(--card-border))] px-3 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="flex-1 rounded-lg bg-[hsl(var(--primary))] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Run Backup
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
