'use client'

import React, { useState } from 'react'
import { Plus, Grid, Trash2, Edit2, Tag } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  order: number
  _count?: { products: number }
}

interface CategoryManagerProps {
  initialCategories: Category[]
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('Laptop')
  const [order, setOrder] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, icon, order }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create category')
        setLoading(false)
        return
      }

      window.location.reload()
    } catch {
      setError('An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Manager</h1>
        <p className="text-xs text-slate-500 mt-1">Organize products into clean, SEO-friendly storefront categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Add New Category
            </h2>

            {error && <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl">{error}</div>}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="electronics (auto-generated if blank)"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lucide Icon Key</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none"
              >
                <option value="Laptop">Laptop (Electronics)</option>
                <option value="Home">Home (Home & Kitchen)</option>
                <option value="Sparkles">Sparkles (Beauty)</option>
                <option value="Shirt">Shirt (Fashion)</option>
                <option value="Dumbbell">Dumbbell (Fitness)</option>
                <option value="Gamepad2">Gamepad2 (Toys & Games)</option>
                <option value="Dog">Dog (Pet Supplies)</option>
                <option value="Wrench">Wrench (Tools)</option>
                <option value="Briefcase">Briefcase (Office)</option>
                <option value="Compass">Compass (Lifestyle)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Display Order Position</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category summary for SEO and header previews..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center gap-2 mb-4">
              <Grid className="w-4 h-4 text-amber-500" />
              Existing Categories ({categories.length})
            </h2>

            <div className="space-y-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                      {c.order}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">/category/{c.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                      {c._count?.products || 0} products
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
