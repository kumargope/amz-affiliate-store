'use client'

import React, { useState } from 'react'
import { Sparkles, Gift, Flame, Zap, Award } from 'lucide-react'

interface RewardSecretDealsBoxProps {
  query: string
}

export default function RewardSecretDealsBox({ query }: RewardSecretDealsBoxProps) {
  const [isExploding, setIsExploding] = useState(false)
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; vx: number; vy: number; emoji: string; size: number }[]
  >([])

  const handleReveal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (isExploding) return

    setIsExploding(true)

    // Emojis for the BOOM explosion
    const emojis = ['🎁', '⚡', '✨', '⭐', '💥', '🔥', '💰', '🎉', '💎']
    const newParticles: { id: number; x: number; y: number; vx: number; vy: number; emoji: string; size: number }[] = []

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 4 + Math.random() * 12
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Slight upward bias
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 18 + Math.floor(Math.random() * 20),
      })
    }

    setParticles(newParticles)

    const targetUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=amzfinds063-20`

    // Open link after 500ms explosion effect
    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
      setIsExploding(false)
      setParticles([])
    }, 600)
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-slate-950 shadow-xl border-2 border-amber-300/80 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Background Decorative Glow Bubbles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Mystery Gift / Reward Icon + Text */}
        <div className="flex items-start gap-4 text-center md:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-lg border border-amber-400/40 transform hover:rotate-6 transition-transform">
            <Gift className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950/90 text-amber-400 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Secret VIP Reward Box</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              🎁 Unlock Exclusive Secret Deals & Extra Discounts for &quot;{query}&quot;!
            </h2>

            <p className="text-xs sm:text-sm font-bold text-slate-900/90 mt-1 max-w-xl">
              Get instant access to limited-time price drops, verified seller coupons, and extra reward savings matching your search!
            </p>
          </div>
        </div>

        {/* Right Side: Animated BOOM Reward Button */}
        <a
          href={`https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=amzfinds063-20`}
          onClick={handleReveal}
          className={`inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-950 hover:bg-slate-900 active:scale-95 text-amber-400 font-black text-sm rounded-2xl shadow-2xl transition-all cursor-pointer shrink-0 border-2 border-amber-400/50 ${
            isExploding ? 'scale-110 ring-4 ring-amber-300 animate-pulse' : 'hover:scale-105'
          }`}
        >
          <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>{isExploding ? '💥 BOOM! Opening Secret Deals...' : '⚡ Reveal All Secret Deals Now'}</span>
        </a>
      </div>

      {/* BOOM Particle Canvas / Overlay */}
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute animate-ping font-extrabold select-none"
              style={{
                left: `${p.x + p.vx * 15}px`,
                top: `${p.y + p.vy * 15}px`,
                fontSize: `${p.size}px`,
                transition: 'all 0.5s ease-out',
                transform: `translate(${p.vx * 20}px, ${p.vy * 20}px) scale(1.5)`,
                opacity: 0.9,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
