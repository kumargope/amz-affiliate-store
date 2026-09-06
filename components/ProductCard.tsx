import React from 'react'
import Link from 'next/link'
import { Star, Tag, Zap, Clock, ShieldCheck, Flame } from 'lucide-react'
import BuyNowButton from './BuyNowButton'
import ShareButtons from './ShareButtons'

export interface ProductCardProps {
  id: string
  title: string
  slug: string
  shortDescription: string
  imageUrl: string
  amazonAffiliateUrl: string
  price?: number | null
  originalPrice?: number | null
  currency?: string
  rating?: number | null
  reviewCount?: number | null
  isFeatured?: boolean
  isDeal?: boolean
  category?: {
    name: string
    slug: string
  }
}

export default function ProductCard({
  id,
  title,
  slug,
  shortDescription,
  imageUrl,
  amazonAffiliateUrl,
  price,
  originalPrice,
  currency = 'USD',
  rating,
  reviewCount,
  isFeatured,
  isDeal,
  category,
}: ProductCardProps) {
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
  
  const discountPercent =
    isDeal && price && originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden h-full relative hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </Link>

        {/* High-Converting Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isDeal && (
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">
              <Zap className="w-3 h-3 fill-white" />
              {discountPercent ? `${discountPercent}% OFF` : 'DEAL'}
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-slate-950/90 text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow backdrop-blur-md">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
            #1 USA Best Seller
          </span>
        </div>

        {/* Prime USA Verified Tag */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-emerald-950/90 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md shadow backdrop-blur-md">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Prime Verified
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & Live Countdown Urgency */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {category ? (
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider"
              >
                <Tag className="w-3 h-3" />
                {category.name}
              </Link>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">Amazon Choice</span>
            )}

            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-red-500" />
              Limited Stock
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-amber-600 transition-colors leading-snug">
            <Link href={`/product/${slug}`}>{title}</Link>
          </h3>

          {/* Short Description */}
          <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        {/* Rating, Price & Actions */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 pt-3 border-t border-slate-100">
            {/* Rating */}
            {rating !== null && rating !== undefined ? (
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-black text-slate-900">{rating.toFixed(1)}</span>
                {reviewCount ? (
                  <span className="text-slate-400 text-[11px]">({reviewCount.toLocaleString()})</span>
                ) : null}
              </div>
            ) : (
              <span className="text-xs text-slate-400">Rating N/A</span>
            )}

            {/* Price */}
            {price !== null && price !== undefined ? (
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="font-black text-slate-950 text-xl tracking-tight">
                    {currencySymbol}{price.toFixed(2)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      {currencySymbol}{originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 font-medium">Check Amazon</span>
            )}
          </div>

          {/* Quick Viral Share */}
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Share</span>
            <ShareButtons title={title} imageUrl={imageUrl} variant="compact" />
          </div>

          {/* High-Converting Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/product/${slug}`}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              View Details
            </Link>
            <BuyNowButton
              productId={id}
              affiliateUrl={amazonAffiliateUrl}
              size="sm"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  )
}
