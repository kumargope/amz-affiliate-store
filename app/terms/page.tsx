import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | AmzFinds',
  description: 'Terms of service for using AmzFinds Amazon product discovery storefront.',
}

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>

          <p>
            Welcome to AmzFinds. By accessing or using our storefront, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">1. Nature of Service</h2>
          <p>
            AmzFinds operates strictly as an affiliate product curation and discovery directory. We do not sell products directly, hold inventory, handle shipping, or process financial payments.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">2. External Amazon Transactions</h2>
          <p>
            All transactions initiated via our affiliate links take place on Amazon.com under Amazon&apos;s independent terms of service, privacy notice, and return policies. AmzFinds is not responsible for order fulfillment, delivery delays, or product defects.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">3. Accuracy of Information</h2>
          <p>
            While we strive to keep product titles, images, and descriptions accurate and updated, pricing and availability on Amazon change frequently. Final prices and product specs are governed by Amazon.com at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
