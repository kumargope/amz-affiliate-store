import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BuyNowButton from '@/components/BuyNowButton'
import ProductCard from '@/components/ProductCard'
import AffiliateDisclosure from '@/components/AffiliateDisclosure'
import ShareButtons from '@/components/ShareButtons'
import AdsterraBanner from '@/components/AdsterraBanner'
import { Star, CheckCircle2, XCircle, Tag, ShieldCheck, ArrowLeft, Zap } from 'lucide-react'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    })

    if (!product) {
      return { title: 'Product Not Found' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const title = product.seoTitle || `${product.title} - Amazon Affiliate Review & Deals`
    const description = product.seoDescription || product.shortDescription

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/product/${product.slug}`,
        images: [{ url: product.imageUrl, alt: product.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [product.imageUrl],
      },
    }
  } catch {
    return { title: 'Amazon Product | AmzFinds' }
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  let product: any = null
  let relatedProducts: any[] = []

  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug, isActive: true },
      include: { category: true },
    })

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        take: 4,
        include: { category: { select: { name: true, slug: true } } },
      })
    }
  } catch (error) {
    console.error('Error in ProductDetailPage:', error)
  }

  if (!product) {
    notFound()
  }

  // Parse JSON lists safely
  let features: string[] = []
  let pros: string[] = []
  let cons: string[] = []

  try {
    features = JSON.parse(product.features)
  } catch {
    features = product.features ? product.features.split('\n').filter(Boolean) : []
  }

  try {
    pros = product.pros ? JSON.parse(product.pros) : []
  } catch {
    pros = product.pros ? product.pros.split('\n').filter(Boolean) : []
  }

  try {
    cons = product.cons ? JSON.parse(product.cons) : []
  } catch {
    cons = product.cons ? product.cons.split('\n').filter(Boolean) : []
  }

  const currencySymbol = product.currency === 'USD' ? '$' : '$'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // JSON-LD Schema.org structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.imageUrl],
    description: product.shortDescription,
    category: product.category.name,
    offers: product.price
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: product.currency,
          lowPrice: product.price,
          highPrice: product.originalPrice || product.price,
          offerCount: 1,
          seller: {
            '@type': 'Organization',
            name: 'Amazon',
          },
        }
      : undefined,
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 lg:pb-16">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-amber-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-amber-600">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Image Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                {product.isDeal && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Special Deal
                  </span>
                )}
              </div>
              <AffiliateDisclosure variant="card" />
            </div>

            {/* Product Info Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <Link
                  href={`/category/${product.category.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3"
                >
                  <Tag className="w-3.5 h-3.5" />
                  {product.category.name}
                </Link>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-4">
                  {product.title}
                </h1>

                {/* Rating & Review Count */}
                {product.rating !== null && product.rating !== undefined && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                    {product.reviewCount && (
                      <span className="text-xs text-slate-500 font-medium">
                        Based on {product.reviewCount.toLocaleString()} Amazon customer ratings
                      </span>
                    )}
                  </div>
                )}

                {/* Short Summary */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                  {product.shortDescription}
                </p>

                {/* Price Display */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-0.5">
                      Current Price on Amazon
                    </span>
                    {product.price !== null && product.price !== undefined ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-slate-900">
                          {currencySymbol}{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-slate-400 line-through">
                            {currencySymbol}{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-600 font-semibold">
                        View current price directly on Amazon
                      </span>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Fulfilled by Amazon</span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="mb-6 space-y-3">
                  <BuyNowButton
                    productId={product.id}
                    affiliateUrl={product.amazonAffiliateUrl}
                    label="Buy on Amazon"
                    size="lg"
                    fullWidth
                  />
                  <p className="text-[11px] text-center text-slate-400">
                    Official Amazon Affiliate Link • Secure Checkout & Delivery by Amazon
                  </p>
                  <ShareButtons title={product.title} imageUrl={product.imageUrl} />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Features & Pros/Cons */}
          <div className="mt-12 pt-12 border-t border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-6">Product Overview & Key Features</h2>

            <p className="text-slate-700 text-sm leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </p>

            {/* Key Features Bullet List */}
            {features.length > 0 && (
              <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                <h3 className="font-bold text-slate-900 text-sm mb-4">Highlights & Specs</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pros and Cons */}
            {(pros.length > 0 || cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros */}
                {pros.length > 0 && (
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/80">
                    <h3 className="font-bold text-emerald-900 text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      What We Like (Pros)
                    </h3>
                    <ul className="space-y-2.5 text-xs text-emerald-950">
                      {pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-bold text-emerald-600">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {cons.length > 0 && (
                  <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/80">
                    <h3 className="font-bold text-rose-900 text-sm mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      Things to Consider (Cons)
                    </h3>
                    <ul className="space-y-2.5 text-xs text-rose-950">
                      {cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-bold text-rose-600">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Adsterra Sponsor Banner */}
        <AdsterraBanner />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Similar Products You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} {...rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 lg:hidden shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
          <span className="text-lg font-black text-slate-900">
            {product.price ? `${currencySymbol}${product.price.toFixed(2)}` : 'Check Amazon'}
          </span>
        </div>
        <BuyNowButton
          productId={product.id}
          affiliateUrl={product.amazonAffiliateUrl}
          label="Buy on Amazon"
          size="md"
        />
      </div>
    </div>
  )
}
