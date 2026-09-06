'use client'

import React from 'react'

interface AdsterraBannerProps {
  adKey?: string
  width?: number
  height?: number
  format?: string
  scriptUrl?: string
  className?: string
}

export default function AdsterraBanner({
  adKey = process.env.NEXT_PUBLIC_ADSTERRA_KEY || '876bacd56a86dde84b20bdf59efbba52',
  width = 300,
  height = 250,
  format = 'iframe',
  scriptUrl = 'https://www.highrevenueformat.com/876bacd56a86dde84b20bdf59efbba52/invoke.js',
  className = '',
}: AdsterraBannerProps) {
  const currentKey = adKey || '876bacd56a86dde84b20bdf59efbba52'
  const currentScriptUrl = scriptUrl || `https://www.highrevenueformat.com/${currentKey}/invoke.js`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${currentKey}',
            'format' : '${format}',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="${currentScriptUrl}"></script>
      </body>
    </html>
  `

  return (
    <div className={`flex flex-col items-center justify-center my-6 overflow-hidden max-w-full ${className}`}>
      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
        <span>Sponsor Advertisement</span>
      </div>
      <iframe
        srcDoc={htmlContent}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        title="Advertisement"
        scrolling="no"
      />
    </div>
  )
}
