import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminFromCookie } from '@/lib/auth'
import {
  LayoutDashboard,
  Package,
  Grid,
  Settings,
  LogOut,
  ShoppingBag,
  ExternalLink,
  BarChart2,
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminFromCookie()

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">AmzAdmin</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-amber-500" />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Grid className="w-4 h-4 text-amber-500" />
              <span>Categories</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-amber-500" />
              <span>Site Settings</span>
            </Link>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800/60"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {admin && (
            <div className="flex items-center justify-between pt-2 px-1">
              <div className="text-[11px] truncate max-w-[140px]">
                <p className="font-bold text-white truncate">{admin.email}</p>
                <p className="text-slate-500">Administrator</p>
              </div>

              <form action="/api/admin/logout" method="POST">
                <button
                  type="submit"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  )
}
