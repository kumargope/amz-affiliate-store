'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, Flame, Sparkles, Grid } from 'lucide-react'

interface NavbarProps {
  categories?: { name: string; slug: string }[]
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="/logo.png"
              alt="AmzFinds Logo"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            />
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search hand-picked Amazon products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-amber-600 transition-colors py-2">
                <Grid className="w-4 h-4 text-slate-500" />
                <span>Categories</span>
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 py-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link href="/category/electronics" className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl">Electronics</Link>
                      <Link href="/category/home-kitchen" className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl">Home &amp; Kitchen</Link>
                      <Link href="/category/beauty" className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl">Beauty &amp; Personal Care</Link>
                      <Link href="/category/fashion" className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl">Fashion &amp; Apparel</Link>
                      <Link href="/category/fitness" className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl">Fitness &amp; Sports</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/deals" className="flex items-center gap-1.5 hover:text-amber-600 transition-colors">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Deals</span>
            </Link>

            <Link href="/gift-finder" className="flex items-center gap-1.5 hover:text-amber-600 transition-colors text-amber-600 font-bold">
              <span>Gift Finder 🎁</span>
            </Link>

            <Link href="/search?sort=popular" className="flex items-center gap-1.5 hover:text-amber-600 transition-colors">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Trending</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search hand-picked Amazon products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/90 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-amber-600"
          >
            Home
          </Link>
          <Link
            href="/deals"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-800 hover:text-amber-600"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Deals &amp; Discounts</span>
          </Link>
          <Link
            href="/search?sort=popular"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-800 hover:text-amber-600"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Trending Products</span>
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 text-xs bg-slate-50 font-medium text-slate-700 rounded-lg hover:bg-amber-50 hover:text-amber-700"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
