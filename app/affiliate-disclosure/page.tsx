import React from 'react'
import { Metadata } from 'next'
import { Info, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | AmzFinds',
  description: 'Amazon Associate affiliate program disclosure and compliance information.',
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-slate-900">Amazon Associate Affiliate Disclosure</h1>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 font-medium">
            &quot;As an Amazon Associate, we earn from qualifying purchases.&quot;
          </div>

          <p>
            <strong>AmzFinds</strong> is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for website owners to earn advertising fees by advertising and linking to Amazon.com and affiliated sites.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">What Does This Mean for You?</h2>
          <p>
            When you click on a product link or button labeled &quot;Buy Now&quot; or &quot;Buy on Amazon&quot; on our website, you will be redirected directly to the official Amazon product listing page.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>No extra cost to you:</strong> The price you pay on Amazon is exactly the same whether you use our link or search Amazon directly.</li>
            <li><strong>Purchases on Amazon:</strong> We do not process payments, collect address details, ship items, or handle returns. Everything is handled securely by Amazon.</li>
            <li><strong>Transparent recommendations:</strong> We only feature products we believe provide real value and high customer satisfaction.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 pt-2">Product Information & Pricing</h2>
          <p>
            Product prices, availability, and ratings are accurate as of the date/time indicated and are subject to change. Any price or availability information displayed on Amazon.com at the time of purchase will apply to the purchase of the product.
          </p>
        </div>
      </div>
    </div>
  )
}
