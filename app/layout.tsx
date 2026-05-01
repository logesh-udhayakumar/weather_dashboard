import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'WeatherBoard',
    template: '%s | WeatherBoard',
  },
  description:
    'A production-ready weather dashboard with real-time weather data, 5-day forecasts, and historical weather records. Search cities, save favorites, and visualize weather trends.',
  keywords: ['weather', 'dashboard', 'forecast', 'real-time weather', 'weather app'],
  authors: [{ name: 'WeatherBoard' }],
  openGraph: {
    title: 'WeatherBoard — Real-Time Weather Dashboard',
    description: 'Track real-time weather, forecasts, and historical data for any city worldwide.',
    type: 'website',
  },
}

import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-navy-950 text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SessionProvider session={null}>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'rgba(15,23,42,0.95)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  backdropFilter: 'blur(20px)',
                  fontSize: '14px',
                  padding: '12px 16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                },
                success: {
                  iconTheme: { primary: '#06b6d4', secondary: '#0f172a' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
                },
              }}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
