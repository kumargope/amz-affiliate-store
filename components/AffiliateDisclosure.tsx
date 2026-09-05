import React from 'react'
import { Info } from 'lucide-react'

interface AffiliateDisclosureProps {
  variant?: 'banner' | 'card' | 'inline'
}

export default function AffiliateDisclosure({ variant = 'banner' }: AffiliateDisclosureProps) {
  if (variant === 'inline') {
    return (
      <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
        <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>As an Amazon Associate, we earn from qualifying purchases.</span>
      </p>
    )
  }

  if (variant === 'card') {
    return (
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900/90 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-0.5">Amazon Associate Disclosure</p>
          <p>
            We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Product prices and availability are accurate as of the date/time indicated and are subject to change.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs text-center border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          Disclosure
        </span>
        <span>
          As an Amazon Associate, we earn from qualifying purchases. All purchases are completed securely on Amazon.
        </span>
      </div>
    </div>
  )
}
