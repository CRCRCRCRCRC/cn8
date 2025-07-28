import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '台灣防衛情勢感知系統',
  description: '即時蒐集多源情報、量化威脅並產生 AI 綜合分析報告',
  keywords: ['台灣', '防衛', '情勢', '分析', 'AI'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>
          <div className="matrix-bg" id="matrix-bg"></div>
          {children}
        </Providers>
      </body>
    </html>
  )
}