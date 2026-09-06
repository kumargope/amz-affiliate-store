'use client'

import React, { useState } from 'react'
import { Sparkles, Gift, Zap } from 'lucide-react'

interface RewardSecretDealsBoxProps {
  query: string
}

export default function RewardSecretDealsBox({ query }: RewardSecretDealsBoxProps) {
  const [isExploding, setIsExploding] = useState(false)
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; vx: number; vy: number; emoji: string; size: number }[]
  >([])

  const displayQuery = query.trim().toUpperCase()

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

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 5 + Math.random() * 14
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 20 + Math.floor(Math.random() * 22),
      })
    }

    setParticles(newParticles)

    const targetUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=amzfinds063-20`

    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
      setIsExploding(false)
      setParticles([])
    }, 600)
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-6 sm:p-10 text-slate-950 shadow-2xl border-4 border-amber-300 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Background Decorative Glow Bubbles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Big Gift Box Icon & Big Bold Bada Heading */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-2xl border-2 border-amber-400/50 transform hover:scale-110 hover:rotate-6 transition-all">
            <Gift className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-950/90 text-amber-400 rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-md">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Secret VIP Reward Box</span>
            </div>

            {/* BADA BADA SIZE ME RESULT DISPLAY */}
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight uppercase">
              🎯 YOUR RESULT FOR &quot;{displayQuery}&quot;
            </h2>

            <p className="text-xs sm:text-base font-extrabold text-slate-900/90 mt-1 max-w-xl">
              Click below to reveal exclusive secret deals, extra reward discounts, and top USA price drops for &quot;{displayQuery}&quot;!
            </p>
          </div>
        </div>

        {/* Right Side: Big Animated BOOM Reward Button */}
        <a
          href={`https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=amzfinds063-20`}
          onClick={handleReveal}
          className={`inline-flex items-center justify-center gap-3 px-8 py-5 bg-slate-950 hover:bg-slate-900 active:scale-95 text-amber-400 font-black text-base rounded-2xl shadow-2xl transition-all cursor-pointer shrink-0 border-2 border-amber-400/60 uppercase tracking-wide ${
            isExploding ? 'scale-110 ring-4 ring-amber-200 animate-pulse' : 'hover:scale-105'
          }`}
        >
          <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          <span>{isExploding ? '💥 BOOM! Opening Secret Deals...' : `⚡ REVEAL DEALS FOR "${displayQuery}" NOW`}</span>
        </a>
      </div>

      {/* BOOM Particle Explosion Overlay */}
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
                transform: `translate(${p.vx * 22}px, ${p.vy * 22}px) scale(1.6)`,
                opacity: 0.95,
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
