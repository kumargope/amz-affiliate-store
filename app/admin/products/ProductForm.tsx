'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface ProductFormProps {
  initialData?: any
  categories: Category[]
  isEdit?: boolean
}

export default function ProductForm({ initialData, categories, isEdit = false }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategoriesList(data.categories)
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || data.categories[0].id,
          }))
        }
      })
      .catch((err) => console.error('Failed to fetch categories dynamically:', err))
  }, [])

  const parseArrayField = (field: any) => {
    if (!field) return ''
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field)
        if (Array.isArray(parsed)) return parsed.join('\n')
      } catch {
        return field
      }
    }
    if (Array.isArray(field)) return field.join('\n')
    return String(field)
  }

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    amazonAffiliateUrl: initialData?.amazonAffiliateUrl || '',
    imageUrl: initialData?.imageUrl || '',
    shortDescription: initialData?.shortDescription || '',
    description: initialData?.description || '',
    price: initialData?.price !== undefined && initialData?.price !== null ? String(initialData.price) : '',
    originalPrice: initialData?.originalPrice !== undefined && initialData?.originalPrice !== null ? String(initialData.originalPrice) : '',
    currency: initialData?.currency || 'USD',
    rating: initialData?.rating !== undefined && initialData?.rating !== null ? String(initialData.rating) : '',
    reviewCount: initialData?.reviewCount !== undefined && initialData?.reviewCount !== null ? String(initialData.reviewCount) : '',
    features: parseArrayField(initialData?.features),
    pros: parseArrayField(initialData?.pros),
    cons: parseArrayField(initialData?.cons),
    isFeatured: initialData?.isFeatured ?? false,
    isDeal: initialData?.isDeal ?? false,
    isActive: initialData?.isActive ?? true,
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      ...formData,
      features: formData.features.split('\n').map((s) => s.trim()).filter(Boolean),
      pros: formData.pros.split('\n').map((s) => s.trim()).filter(Boolean),
      cons: formData.cons.split('\n').map((s) => s.trim()).filter(Boolean),
    }

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to save product')
        setLoading(false)
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('An unexpected network error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {isEdit ? 'Edit Amazon Product' : 'Add New Amazon Affiliate Product'}
            </h1>
            <p className="text-xs text-slate-500">
              Ensure affiliate links include your Associate tag and info is authentic.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Product...' : isEdit ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* Main Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Product Overview & Affiliate Link
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Sony WH-1000XM5 Wireless Noise-Canceling Headphones"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-if-empty"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Select Category --</option>
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categoriesList.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    Loading categories or no categories found.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amazon Affiliate URL (Destination for Buy Now) *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={formData.amazonAffiliateUrl}
                  onChange={(e) => setFormData({ ...formData, amazonAffiliateUrl: e.target.value })}
                  placeholder="https://www.amazon.com/dp/ASIN?tag=yourtag-20"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Paste raw Amazon URL or affiliate link. Store tag will auto-append if missing.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Image URL *</label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or approved image URL"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (Cards) *</label>
              <textarea
                required
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief 1-2 sentence overview for product card previews..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Detailed Description *</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive overview of the product features, usage scenarios, and quality review..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Features, Pros & Cons */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Features, Pros & Cons Breakdown
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Key Features (Enter one bullet point per line)
              </label>
              <textarea
                rows={4}
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Feature 1: 30-hour battery life&#10;Feature 2: Active noise cancellation&#10;Feature 3: Multipoint connection"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">Pros (What we like - 1 per line)</label>
                <textarea
                  rows={3}
                  value={formData.pros}
                  onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                  placeholder="Top-tier ANC quality&#10;Lightweight comfortable fit"
                  className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-800 mb-1">Cons (Things to consider - 1 per line)</label>
                <textarea
                  rows={3}
                  value={formData.cons}
                  onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                  placeholder="Higher price point&#10;Does not fold flat"
                  className="w-full px-4 py-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Badges & SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing & Ratings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Pricing & Rating Data
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (Optional/Permitted)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="398.00"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (For verified deals)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="499.00"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="4.6"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Count</label>
                <input
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData({ ...formData, reviewCount: e.target.value })}
                  placeholder="12450"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Visibility & Badges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Badges & Status
            </h2>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Active (Visible on Storefront)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Featured (Show on Homepage)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDeal}
                onChange={(e) => setFormData({ ...formData, isDeal: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Deal (Show on Deals Page)</span>
            </label>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              SEO Custom Meta
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom SEO Title</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="Product Title - Review & Best Deals"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Custom Meta Description</label>
              <textarea
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Meta description snippet for search engines..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
