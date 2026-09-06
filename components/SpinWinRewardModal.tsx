'use client'

import React, { useState } from 'react'
import { Sparkles, Gift, Zap, X, Trophy } from 'lucide-react'

export default function SpinWinRewardModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonPrize, setWonPrize] = useState<string | null>(null)

  const prizes = [
    '🎁 40% OFF Secret Coupon',
    '⚡ Free Express Prime Deal',
    '🔥 25% OFF USA Best Seller',
    '🎉 50% OFF Flash Coupon',
    '⭐ Exclusive VIP Deal',
    '💰 $30 Instant Reward Off',
  ]

  const handleSpin = () => {
    if (isSpinning || wonPrize) return
    setIsSpinning(true)

    // Spin 5-8 full rotations + random segment
    const randomDegrees = 1800 + Math.floor(Math.random() * 360)
    setRotation(randomDegrees)

    setTimeout(() => {
      setIsSpinning(false)
      const prizeIndex = Math.floor(Math.random() * prizes.length)
      setWonPrize(prizes[prizeIndex])
    }, 3500)
  }

  const handleClaim = () => {
    window.open('https://www.amazon.com/s?k=today+deals&tag=amzfinds063-20', '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Bottom Right Trigger Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-5 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs rounded-full shadow-2xl border-2 border-amber-400 active:scale-95 transition-all cursor-pointer animate-bounce"
        >
          <Gift className="w-5 h-5 text-amber-400 animate-spin" />
          <span>Spin &amp; Win Secret Coupon 🎁</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        </button>
      </div>

      {/* Spin & Win Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-400 rounded-full text-[11px] font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP Fortune Wheel</span>
            </div>

            <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tight">
              🎁 Spin &amp; Win Secret Reward!
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1 mb-6">
              Spin the wheel to unlock exclusive secret Amazon discount coupons &amp; USA flash deals!
            </p>

            {/* Wheel Canvas Container */}
            <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
              {/* Pointer */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-red-500 filter drop-shadow-md" />

              {/* Rotating Wheel */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl relative overflow-hidden transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Segments */}
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center font-black text-[11px] text-slate-950 text-center p-4">
                  <div className="grid grid-cols-2 gap-3 transform -rotate-45">
                    {prizes.map((p, idx) => (
                      <span key={idx} className="p-1 bg-slate-950/20 rounded-lg">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Pin */}
              <div className="absolute w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 font-black shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            {/* Winner Box or Spin Button */}
            {wonPrize ? (
              <div className="space-y-4 animate-in zoom-in-90 duration-300">
                <div className="p-4 bg-amber-500/20 border-2 border-amber-400 rounded-2xl text-amber-300 font-black text-lg">
                  🎉 YOU WON: {wonPrize}!
                </div>
                <button
                  onClick={handleClaim}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>CLAIM YOUR DISCOUNT ON AMAZON NOW</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-slate-950 animate-bounce" />
                <span>{isSpinning ? 'SPINNING WHEEL...' : 'SPIN WHEEL FOR FREE NOW'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
