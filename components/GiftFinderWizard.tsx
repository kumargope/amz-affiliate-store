'use client'

import React, { useState } from 'react'
import ProductCard, { ProductCardProps } from './ProductCard'
import ShareButtons from './ShareButtons'
import { Gift, Sparkles, Heart, Users, Calendar, DollarSign, RotateCcw, Send } from 'lucide-react'

interface GiftFinderWizardProps {
  products: ProductCardProps[]
}

export default function GiftFinderWizard({ products }: GiftFinderWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [recipient, setRecipient] = useState<string>('')
  const [occasion, setOccasion] = useState<string>('')
  const [budget, setBudget] = useState<string>('')

  const recipientOptions = [
    { id: 'him', label: 'For Him (Partner, Dad, Brother)', icon: '👔' },
    { id: 'her', label: 'For Her (Partner, Mom, Sister)', icon: '✨' },
    { id: 'tech', label: 'Techie & Gamer', icon: '🎧' },
    { id: 'kids', label: 'Kids & Teens', icon: '🎮' },
    { id: 'anyone', label: 'Friends & Coworkers', icon: '🎁' },
  ]

  const occasionOptions = [
    { id: 'holiday', label: 'Christmas & Holiday Season 🎄' },
    { id: 'blackfriday', label: 'Black Friday / Cyber Monday Deals ⚡' },
    { id: 'birthday', label: 'Birthday Celebration 🎂' },
    { id: 'anniversary', label: 'Anniversary & Romantic 💕' },
    { id: 'housewarming', label: 'Housewarming & Home 🏡' },
    { id: 'justbecause', label: 'Just Because / Everyday Appreciation 🌟' },
  ]

  const budgetOptions = [
    { id: 'under50', label: 'Budget Friendly (Under $50)' },
    { id: '50to150', label: 'Popular Range ($50 - $150)' },
    { id: 'over150', label: 'Premium & Luxury (Over $150)' },
    { id: 'any', label: 'Any Price Range' },
  ]

  // Filter logic based on selections
  const filteredProducts = products.filter((p) => {
    if (!p.price) return true

    if (budget === 'under50' && p.price > 50) return false
    if (budget === '50to150' && (p.price < 50 || p.price > 150)) return false
    if (budget === 'over150' && p.price < 150) return false

    return true
  })

  const resetQuiz = () => {
    setStep(1)
    setRecipient('')
    setOccasion('')
    setBudget('')
  }

  const selectedRecipientLabel = recipientOptions.find((r) => r.id === recipient)?.label || 'Everyone'
  const selectedOccasionLabel = occasionOptions.find((o) => o.id === occasion)?.label || 'Special Occasions'

  return (
    <div className="space-y-8">
      {/* Wizard Header Progress */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold mb-4">
          <Gift className="w-4 h-4" />
          <span>Interactive US Gift Recommendation Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Find the Perfect Gift in 30 Seconds
        </h1>
        <p className="text-slate-600 text-sm max-w-lg mx-auto mb-8">
          Answer 3 quick questions to discover top-rated Amazon US gifts, then share your curated list with friends & family!
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 text-xs font-bold">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === 1 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span>1. Recipient</span>
          </div>
          <span className="text-slate-300">→</span>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === 2 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span>2. Occasion</span>
          </div>
          <span className="text-slate-300">→</span>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              step === 3 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span>3. Budget</span>
          </div>
        </div>
      </div>

      {/* Step 1: Recipient Selection */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Who are you shopping for?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipientOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setRecipient(opt.id)
                  setStep(2)
                }}
                className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center gap-3 ${
                  recipient === opt.id
                    ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Occasion Selection */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            What is the occasion?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {occasionOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setOccasion(opt.id)
                  setStep(3)
                }}
                className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                  occasion === opt.id
                    ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              ← Back to Recipient
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Budget Selection */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center justify-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            Select your budget range in USD
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {budgetOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBudget(opt.id)}
                className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all ${
                  budget === opt.id
                    ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              ← Back to Occasion
            </button>
          </div>
        </div>
      )}

      {/* Results & Viral Share Section */}
      {recipient && occasion && budget && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Results Summary & Share Bar */}
          <div className="bg-amber-50 border border-amber-200/80 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Your Curated US Gift Collection
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Top Gift Ideas {selectedRecipientLabel !== 'Everyone' ? `for ${selectedRecipientLabel}` : ''} ({selectedOccasionLabel})
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Found {filteredProducts.length} hand-picked Amazon US products matching your criteria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Quiz</span>
              </button>
            </div>
          </div>

          {/* Social Viral Share Module */}
          <div className="max-w-7xl mx-auto">
            <ShareButtons
              title={`Curated Gift List for ${selectedRecipientLabel} (${selectedOccasionLabel})`}
            />
          </div>

          {/* Product Results Grid */}
          <div className="max-w-7xl mx-auto">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2">No exact match for this budget range</h3>
                <p className="text-slate-500 text-xs mb-6">Try selecting &quot;Any Price Range&quot; or resetting the quiz.</p>
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Start Quiz Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
