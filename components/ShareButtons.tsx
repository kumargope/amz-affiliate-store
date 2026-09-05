'use client'

import React, { useState } from 'react'
import {
  Share2,
  Check,
  Copy,
  MessageSquare,
  Send,
  Facebook,
  Twitter,
  Pin,
} from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url?: string
  imageUrl?: string
  variant?: 'inline' | 'compact' | 'floating'
}

export default function ShareButtons({
  title,
  url,
  imageUrl,
  variant = 'inline',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = `Check out this top pick on AmzFinds: "${title}" 🔥`

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Native Web Share API if supported
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // Ignore user cancel
      }
    } else {
      handleCopy()
    }
  }

  // Social Links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  const smsUrl = `sms:?&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    shareUrl
  )}&media=${encodeURIComponent(imageUrl || '')}&description=${encodeURIComponent(shareText)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleNativeShare}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Share with friends"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
        <a
          href={smsUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          title="Share via iMessage / SMS"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </a>
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          title="Pin to Pinterest"
        >
          <Pin className="w-3.5 h-3.5" />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          title="Share on WhatsApp"
        >
          <Send className="w-3.5 h-3.5" />
        </a>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-amber-500" />
          Share with Friends & Family
        </span>
        {copied && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" /> Copied link!
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
        {/* SMS / iMessage */}
        <a
          href={smsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>SMS / iMessage</span>
        </a>

        {/* Pinterest */}
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-sm"
        >
          <Pin className="w-3.5 h-3.5 fill-white" />
          <span>Pinterest</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-sm"
        >
          <Twitter className="w-3.5 h-3.5 fill-white" />
          <span>X / Twitter</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-all col-span-2 sm:col-span-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  )
}
