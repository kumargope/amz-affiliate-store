'use client'

import React, { useState } from 'react'
import { Save, Settings, ShieldCheck, Key, Check } from 'lucide-react'

interface SettingsManagerProps {
  initialSettings: Record<string, string>
}

export default function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState({
    siteName: initialSettings.siteName || 'AmzFinds',
    siteTagline: initialSettings.siteTagline || 'Hand-picked products, useful recommendations, and great finds',
    amazonAssociateTag: initialSettings.amazonAssociateTag || 'amzfinds-20',
    affiliateDisclosure: initialSettings.affiliateDisclosure || 'As an Amazon Associate, we earn from qualifying purchases.',
    logoUrl: initialSettings.logoUrl || '',
    paApiKey: initialSettings.paApiKey || '',
    paApiSecret: initialSettings.paApiSecret || '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!res.ok) {
        setError('Failed to update settings')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Site Settings & Amazon Credentials</h1>
        <p className="text-xs text-slate-500 mt-1">Configure global Associate tags, legal disclosures, and PA-API settings.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amazon Associates Tag */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            Amazon Associates Tracking Tag
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Associate Tracking Tag *</label>
            <input
              type="text"
              required
              value={settings.amazonAssociateTag}
              onChange={(e) => setSettings({ ...settings, amazonAssociateTag: e.target.value })}
              placeholder="yourstore-20"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-md"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              This tag is automatically appended to product Buy Now links for commission attribution.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Global Affiliate Disclosure Text</label>
            <textarea
              rows={3}
              value={settings.affiliateDisclosure}
              onChange={(e) => setSettings({ ...settings, affiliateDisclosure: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Amazon Product Advertising API (PA-API v5) Config Interface */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            Amazon Product Advertising API (PA-API v5) Configuration
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            If you have approved Amazon Product Advertising API credentials, enter them below to enable automatic real-time price & title sync.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PA-API Access Key</label>
              <input
                type="password"
                value={settings.paApiKey}
                onChange={(e) => setSettings({ ...settings, paApiKey: e.target.value })}
                placeholder="AKIAIOSFODNN7EXAMPLE"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PA-API Secret Key</label>
              <input
                type="password"
                value={settings.paApiSecret}
                onChange={(e) => setSettings({ ...settings, paApiSecret: e.target.value })}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Storefront Branding */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            Storefront Identity & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Storefront Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Storefront Tagline</label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  )
}
