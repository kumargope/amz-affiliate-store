'use client'

import React from 'react'
import { ExternalLink, ShoppingBag } from 'lucide-react'

interface BuyNowButtonProps {
  productId: string
  affiliateUrl: string
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function BuyNowButton({
  productId,
  affiliateUrl,
  label = 'Buy Now',
  className = '',
  size = 'md',
  fullWidth = false,
}: BuyNowButtonProps) {
  const handleClick = () => {
    // Non-blocking fire-and-forget click analytics tracking
    try {
      fetch('/api/click-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      }).catch(() => {})
    } catch {
      // Ignore click tracking failure so user experience is never blocked
    }
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-base font-bold gap-2.5 shadow-lg shadow-amber-500/20',
  }

  return (
    <a
      href={affiliateUrl}
      target="_blank"
      rel="nofollow sponsored noopener"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
        sizeClasses[size]
      } ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <ShoppingBag className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{label}</span>
      <ExternalLink className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
    </a>
  )
}
