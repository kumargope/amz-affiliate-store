'use client'

import React, { useState } from 'react'
import { Sparkles, Trophy, ExternalLink, X, Send, Pin, MessageSquare } from 'lucide-react'
import BuyNowButton from './BuyNowButton'

interface DealProduct {
  id: string
  title: string
  slug: string
  imageUrl: string
  price?: number | null
  amazonAffiliateUrl: string
}

interface LuckyDealSpinnerProps {
  products: DealProduct[]
}

export default function LuckyDealSpinner({ products }: LuckyDealSpinnerProps) {
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<DealProduct | null>(null)
  const [rotation, setRotation] = useState(0)

  if (!products || products.length === 0) return null

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setWinner(null)

    // Random selection
    const randomIndex = Math.floor(Math.random() * products.length)
    const selectedProduct = products[randomIndex]

    // Rotate 5 full turns + target slice
    const newRotation = rotation + 1800 + randomIndex * (360 / products.length)
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setWinner(selectedProduct)
    }, 3000)
  }

  const shareWinnerUrl = winner ? `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${winner.slug}` : ''
  const shareText = winner ? `I just unlocked a secret Amazon deal on AmzFinds: "${winner.title}" 🔥` : ''

  const smsUrl = `sms:?&body=${encodeURIComponent(`${shareText} ${shareWinnerUrl}`)}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareWinnerUrl}`)}`
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareWinnerUrl)}&media=${encodeURIComponent(winner?.imageUrl || '')}&description=${encodeURIComponent(shareText)}`

  return (
    <section className="py-12 bg-slate-900 text-white border-y border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Promo Copy */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Gamified Deal Drop</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Spin to Reveal Today&apos;s <span className="text-amber-400">Secret Hot Deal</span>
            </h2>

            <p className="text-slate-300 text-sm max-w-md mx-auto lg:mx-0 leading-relaxed">
              Feeling lucky? Spin our daily wheel to unlock a hand-picked top-rated Amazon deal, then share your win with friends!
            </p>

            <div>
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50"
              >
                <Trophy className="w-5 h-5" />
                <span>{spinning ? 'Spinning Wheel...' : 'Spin the Deal Wheel!'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Wheel */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              {/* Pointer */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />

              {/* Wheel Container */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-400/80 bg-slate-800 shadow-2xl overflow-hidden relative transition-all duration-[3000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-full h-full relative flex items-center justify-center">
                  {products.slice(0, 6).map((p, idx) => (
                    <div
                      key={p.id}
                      className="absolute w-full h-full text-center pt-4"
                      style={{ transform: `rotate(${(360 / Math.min(6, products.length)) * idx}deg)` }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded shadow">
                        Deal #{idx + 1}
                      </span>
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-inner z-10">
                    AMZ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 text-center">
            <button
              onClick={() => setWinner(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 font-black">
              <Trophy className="w-6 h-6" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
              You Unlocked A Special Deal!
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-3">{winner.title}</h3>

            <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden mb-4 border border-slate-100">
              <img src={winner.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>

            {winner.price && (
              <div className="text-2xl font-black text-slate-900 mb-4">
                ${winner.price.toFixed(2)}
              </div>
            )}

            <div className="space-y-3">
              <BuyNowButton
                productId={winner.id}
                affiliateUrl={winner.amazonAffiliateUrl}
                label="Claim Deal on Amazon"
                size="lg"
                fullWidth
              />

              {/* Share deal win */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Share Your Lucky Deal Win
                </span>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={smsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" /> iMessage
                  </a>
                  <a
                    href={pinterestUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <Pin className="w-4 h-4" /> Pinterest
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
