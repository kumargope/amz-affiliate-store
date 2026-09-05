import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Amazon Product Discovery Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Discover Products <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Worth Buying</span>
        </h1>

        {/* Subheading */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Hand-picked products, useful recommendations, and great finds — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/deals"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-all duration-200"
          >
            <span>View Today&apos;s Deals</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t border-slate-800/80 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Curated Quality Selection</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Direct Official Amazon Links</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Secure Amazon Checkout</span>
          </div>
        </div>
      </div>
    </section>
  )
}
