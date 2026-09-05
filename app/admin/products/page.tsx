import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAdminFromCookie } from '@/lib/auth'
import { Plus, Edit, ExternalLink, Zap, Star, CheckCircle, XCircle } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'

export default async function AdminProductsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  let products: any[] = []

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        _count: { select: { clicks: true } },
      },
    })
  } catch (error) {
    console.error('Error fetching products for admin products page:', error)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage storefront items, affiliate links & Amazon compliance.</p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div>
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-amber-600 truncate max-w-xs block"
                        >
                          {p.title}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] block">
                          /product/{p.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.category?.name || 'N/A'}</td>
                  <td className="p-4 font-bold text-slate-900">
                    {p.price !== null && p.price !== undefined ? `$${p.price.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {p.isFeatured && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Featured
                        </span>
                      )}
                      {p.isDeal && (
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Deal
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{p._count?.clicks || 0}</td>
                  <td className="p-4">
                    {p.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3 h-3 text-slate-400" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={p.amazonAffiliateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Test Amazon Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton productId={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
