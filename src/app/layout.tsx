import type { Metadata } from 'next'
import Script from 'next/script'
import '../styles/globals.css'
import PageTransition from '@/components/PageTransition'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Trivoo',
  description: 'Sua próxima aventura esportiva está a um swipe',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap"
        />

        {/* Favicon */}
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg"
        />

        {/* Phosphor Icons */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.2/src/regular/style.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.2/src/fill/style.css"
        />

        {/* Swiper CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />

        {/* Swiper JS */}
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-raleway">
        <Toaster
          position="bottom-right"
          containerStyle={{ zIndex: 100 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}

