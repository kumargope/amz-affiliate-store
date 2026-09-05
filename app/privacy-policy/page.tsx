import React from 'react'
import { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | AmzFinds',
  description: 'Privacy policy for AmzFinds Amazon affiliate product discovery storefront.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          </div>

          <p className="text-xs text-slate-400">Last updated: September 2026</p>

          <p>
            At <strong>AmzFinds</strong>, accessible from our storefront URL, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AmzFinds and how we use it.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">No Customer Account Data Collected</h2>
          <p>
            We do NOT require customer registration, signups, logins, passwords, home addresses, phone numbers, or payment card details. We do not store or process payment transactions on our servers.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">Amazon Affiliate Links & Cookies</h2>
          <p>
            When you click on an outbound Amazon affiliate link (&quot;Buy Now&quot;), Amazon uses cookies to track referral traffic and attribute qualifying purchases. Please review Amazon&apos;s Privacy Notice on Amazon.com for full details on how Amazon handles user data during checkout.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">Log Files & Anonymous Click Analytics</h2>
          <p>
            We collect non-personally identifiable log information such as product click counts (e.g., total clicks on a specific product card) strictly to evaluate popular product recommendations in our store dashboard. No personal identifiers or IP address records are attached to user profiles.
          </p>

          <h2 className="text-lg font-bold text-slate-900 pt-2">Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us via our Contact Page.
          </p>
        </div>
      </div>
    </div>
  )
}
