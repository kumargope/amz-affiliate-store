'use client'

import React, { useState } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, FileSpreadsheet, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CsvImportModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      setCsvText(text || '')
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!csvText.trim()) {
      setError('Please upload a CSV file or paste CSV text first.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/admin/products/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent: csvText }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to import CSV')
      }

      setResult(data)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during CSV import.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Bulk Import CSV</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Bulk Import Products via CSV</h2>
                <p className="text-xs text-slate-500">
                  Upload an Amazon product CSV file to automatically import products into your storefront.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {result && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>CSV Import Successful!</span>
                </div>
                <p>
                  Successfully created <strong>{result.importedCount}</strong> new products and updated{' '}
                  <strong>{result.updatedCount}</strong> existing products!
                </p>
                {result.errors && result.errors.length > 0 && (
                  <div className="text-amber-700 mt-2 text-[11px]">
                    <strong>Skipped rows with errors:</strong>
                    <ul className="list-disc pl-4 mt-1">
                      {result.errors.map((e: string, idx: number) => (
                        <li key={idx}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {/* File Upload Box */}
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors relative">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  {fileName ? `File Selected: ${fileName}` : 'Click or Drag & Drop CSV File Here'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports Amazon CSV lists with ASINs, Title, Category, Links & Images.</p>
              </div>

              {/* CSV Raw Text Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Or Paste CSV Raw Text:</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {csvText ? `${csvText.split('\n').filter(Boolean).length - 1} rows detected` : ''}
                  </span>
                </label>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="No,Product Title,Category,Description,Amazon Affiliate Search URL..."
                  rows={6}
                  className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading || !csvText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing CSV...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Import Products Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
