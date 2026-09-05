import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import { Package, Grid, MousePointerClick, Zap, Plus, ArrowRight, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    redirect('/admin/login')
  }

  let totalProducts = 0
  let activeProducts = 0
  let featuredProducts = 0
  let totalCategories = 0
  let totalClicks = 0
  let popularProducts: any[] = []
  let recentProducts: any[] = []

  try {
    const results = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.category.count(),
      prisma.click.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { clicks: { _count: 'desc' } },
        include: {
          category: { select: { name: true } },
          _count: { select: { clicks: true } },
        },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: { select: { name: true } } },
      }),
    ])

    totalProducts = results[0]
    activeProducts = results[1]
    featuredProducts = results[2]
    totalCategories = results[3]
    totalClicks = results[4]
    popularProducts = results[5] || []
    recentProducts = results[6] || []
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Manage Amazon affiliate products, categories & track referral clicks.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Products</span>
            <span className="text-3xl font-black text-slate-900">{totalProducts}</span>
            <span className="text-[11px] text-slate-500 block mt-1">{activeProducts} Active</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Featured Finds</span>
            <span className="text-3xl font-black text-slate-900">{featuredProducts}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Highlighted on Homepage</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Categories</span>
            <span className="text-3xl font-black text-slate-900">{totalCategories}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Organized Sections</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Grid className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Amazon Outbound Clicks</span>
            <span className="text-3xl font-black text-slate-900">{totalClicks}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Affiliate Referrals</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics & Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Clicked Products (CTR Analytics) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Top Clicked Products (Click Analytics)
              </h2>
              <p className="text-xs text-slate-500">Products generating the highest outbound Amazon traffic</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right rounded-r-xl">Amazon Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {popularProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-slate-900 truncate max-w-xs">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{p.category?.name || 'N/A'}</td>
                    <td className="p-3 text-right">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold">
                        {p._count?.clicks || 0} clicks
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">Recently Added Products</h2>
              <p className="text-xs text-slate-500">Latest additions to your storefront</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Title</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 truncate max-w-xs block">{p.title}</span>
                    </td>
                    <td className="p-3 text-slate-700 font-bold">{p.price ? `$${p.price.toFixed(2)}` : 'N/A'}</td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
