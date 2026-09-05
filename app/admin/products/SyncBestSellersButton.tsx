'use client'

import React, { useState } from 'react'
import { Sparkles, Check, RefreshCw } from 'lucide-react'

export default function SyncBestSellersButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSync = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/admin/products/sync-bestsellers', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to sync USA best sellers')
        setLoading(false)
        return
      }

      setMessage(data.message)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch {
      setError('An error occurred during auto-sync')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {message && (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          {message}
        </span>
      )}

      {error && (
        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          {error}
        </span>
      )}

      <button
        type="button"
        onClick={handleSync}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
      >
        <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        <span>{loading ? 'Auto-Importing USA Best Sellers...' : '⚡ Auto-Import USA Best Sellers'}</span>
      </button>
    </div>
  )
}
