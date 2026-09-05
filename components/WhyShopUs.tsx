import React from 'react'
import { Sparkles, ShieldCheck, ExternalLink, Zap } from 'lucide-react'

export default function WhyShopUs() {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Hand-Curated Recommendations',
      description: 'We filter through thousands of products to feature only items with high ratings, verified reviews, and real value.',
    },
    {
      icon: Zap,
      title: 'Easy Product Discovery',
      description: 'Find exactly what you need quickly with clean categories, honest pros & cons, and clear feature breakdowns.',
    },
    {
      icon: ExternalLink,
      title: 'Direct Purchasing on Amazon',
      description: 'Click any product to open the official Amazon product page directly, ensuring transparent prices and accurate listings.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Amazon Checkout',
      description: 'All orders, payments, shipping, and customer service are processed directly by Amazon with standard buyer protection.',
    },
  ]

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
            Why Shop Through Us?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We simplify your Amazon shopping experience by cutting out noise and surfacing the products truly worth buying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{b.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{b.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
