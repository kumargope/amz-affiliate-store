import React from 'react'
import { Metadata } from 'next'
import { ShoppingBag, ShieldCheck, Heart, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | AmzFinds',
  description: 'Learn about AmzFinds, our product curation mission, and our Amazon Associate partnership.',
}

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">About AmzFinds</h1>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Independent Amazon Product Discovery Storefront</p>
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed">
            Welcome to <strong>AmzFinds</strong>. We are a dedicated product discovery platform designed to help shoppers discover high-quality, highly rated, and genuine value products available on Amazon.
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Our Mission</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            Amazon hosts millions of items, making it challenging to find products that actually deliver on their promises. Our team manually reviews, researches, and curates products across Electronics, Home & Kitchen, Beauty, Fashion, Fitness, and more.
          </p>

          <h2 className="text-xl font-bold text-slate-900 pt-4">How Our Site Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-500" />
                Hand-Picked Selection
              </h3>
              <p className="text-slate-600">We feature products with strong ratings, verified customer feedback, and real utility.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                No Customer Accounts Needed
              </h3>
              <p className="text-slate-600">You don&apos;t need to register or provide payment info on our website. Everything stays fast and private.</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 pt-4">Amazon Associates Partnership</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            AmzFinds is a participant in the Amazon Services LLC Associates Program. When you click on a product link on our website, you are redirected to the official Amazon product page. All checkouts, payments, order tracking, shipping, and returns are handled safely by Amazon.
          </p>
        </div>
      </div>
    </div>
  )
}
