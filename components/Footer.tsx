import React from 'react'
import Link from 'next/link'
import { ShoppingBag, ShieldCheck, ExternalLink, Heart } from 'lucide-react'
import AffiliateDisclosure from './AffiliateDisclosure'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">AmzFinds</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your destination for hand-picked, high-rated Amazon products. We curate the best finds so you don&apos;t have to spend hours searching.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Safe Amazon Affiliate Store</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-amber-400 transition-colors">Featured Deals</Link>
              </li>
              <li>
                <Link href="/gift-finder" className="hover:text-amber-400 transition-colors font-bold text-amber-400">Gift Finder Wizard 🎁</Link>
              </li>
              <li>
                <Link href="/search?sort=popular" className="hover:text-amber-400 transition-colors">Trending Products</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-amber-400 transition-colors">Search Storefront</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/electronics" className="hover:text-amber-400 transition-colors">Electronics & Tech</Link>
              </li>
              <li>
                <Link href="/category/home-kitchen" className="hover:text-amber-400 transition-colors">Home & Kitchen</Link>
              </li>
              <li>
                <Link href="/category/beauty" className="hover:text-amber-400 transition-colors">Beauty & Personal Care</Link>
              </li>
              <li>
                <Link href="/category/fitness" className="hover:text-amber-400 transition-colors">Fitness & Sports</Link>
              </li>
              <li>
                <Link href="/category/office" className="hover:text-amber-400 transition-colors">Office & Workspace</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Amazon Disclosure */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Legal & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-amber-400 transition-colors">Affiliate Disclosure</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Box */}
        <div className="py-6 border-b border-slate-800">
          <AffiliateDisclosure variant="card" />
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AmzFinds. All rights reserved. Purchases are completed securely on Amazon.com.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for Amazon shoppers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
