import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { Cloud, ArrowRight, BarChart3, MapPin, Shield, Zap } from 'lucide-react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WeatherBoard',
  description:
    'Track real-time weather, 5-day forecasts, and historical data for cities worldwide. Sign up free.',
}

const features = [
  {
    icon: Cloud,
    title: 'Real-Time Weather',
    description: 'Get instant weather updates for any city worldwide with live data from OpenWeatherMap.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: BarChart3,
    title: '5-Day Forecasts',
    description: 'Visualize temperature trends with beautiful Recharts-powered interactive graphs.',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    icon: MapPin,
    title: 'Saved Locations',
    description: 'Save your favourite cities and quickly switch between them with one tap.',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Secure Auth',
    description: 'Protected routes and JWT sessions powered by NextAuth.js keep your data safe.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Redis Caching',
    description: 'Blazing-fast responses — weather data is cached via Upstash Redis for 10 minutes.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Weather History',
    description: 'Browse and filter historical weather records sorted by most recent, with full pagination.',
    gradient: 'from-pink-500 to-rose-500',
  },
]

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (session) redirect('/dashboard')

  return (
    <main className="min-h-screen hero-mesh">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-navy-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">WeatherBoard</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-all shadow-glow hover:shadow-glow-lg hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-cyan-500/5 blur-[120px]" />
          <div className="absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-blue-600/8 blur-3xl" />
          <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-indigo-600/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            Live weather data powered by OpenWeatherMap
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up">
            Your Personal{' '}
            <span className="gradient-text">Weather Hub</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:100ms]">
            Search any city, track real-time conditions, explore 5-day forecasts with beautiful charts, and save
            your favourite locations — all in one sleek dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:200ms]">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base hover:opacity-95 hover:scale-105 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 text-white font-semibold text-base hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative mx-auto mt-20 max-w-5xl animate-slide-up [animation-delay:300ms]">
          {/* Main Card */}
          <div className="relative flex flex-col md:flex-row items-stretch gap-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 sm:p-10 shadow-[0_30px_100px_rgba(6,182,212,0.15)] overflow-hidden">

            {/* Glowing background blobs */}
            <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-[80px] pointer-events-none" />

            {/* Left: Main Weather */}
            <div className="relative w-full md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-10">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </div>
                <span className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Live Weather</span>
              </div>

              <div>
                <h3 className="text-6xl sm:text-7xl font-black text-white tracking-tight mb-2">London</h3>
                <p className="text-2xl text-slate-400 font-medium mb-10">United Kingdom 🇬🇧</p>

                <div className="flex items-center gap-8">
                  <span className="text-8xl sm:text-9xl font-bold text-white tracking-tighter drop-shadow-2xl">24°</span>
                  <div className="flex flex-col items-center">
                    <span className="text-7xl sm:text-8xl animate-float drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">🌤️</span>
                    <span className="text-base font-semibold text-cyan-300 mt-3 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">Partly Cloudy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider for desktop */}
            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Right: Stats & Mini Cards */}
            <div className="relative w-full md:w-1/2 flex flex-col justify-center gap-5">
              {/* Stat row */}
              <div className="grid grid-cols-2 gap-5">
                <div className="flex items-center gap-4 rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors shadow-inner">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center text-2xl shadow-glass border border-blue-500/20">💧</div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-0.5">Humidity</p>
                    <p className="text-xl font-bold text-white">72%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors shadow-inner">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-400/20 to-teal-600/20 flex items-center justify-center text-2xl shadow-glass border border-green-500/20">💨</div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-0.5">Wind</p>
                    <p className="text-xl font-bold text-white">15 km/h</p>
                  </div>
                </div>
              </div>

              {/* Other cities */}
              <div className="mt-2 flex flex-col gap-4">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] shadow-inner">
                  <div className="flex items-center gap-5">
                    <span className="text-4xl drop-shadow-md">⛅</span>
                    <div>
                      <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Paris</p>
                      <p className="text-sm text-slate-400">France 🇫🇷</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-white tracking-tight">18°</span>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all hover:scale-[1.02] shadow-inner">
                  <div className="flex items-center gap-5">
                    <span className="text-4xl drop-shadow-md">☀️</span>
                    <div>
                      <p className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">Dubai</p>
                      <p className="text-sm text-slate-400">UAE 🇦🇪</p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-white tracking-tight">31°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to track the weather
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built with Next.js 14, TypeScript, Prisma, Redis and OpenWeatherMap — production-ready from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, gradient }, i) => (
              <div
                key={title}
                className="group relative rounded-3xl border border-white/8 bg-white/4 p-6 hover:border-white/16 hover:bg-white/7 transition-all duration-300 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, rgba(6,182,212,0.15), transparent)` }}
                />
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to check the weather?</h2>
          <p className="text-slate-400 mb-8">Create a free account and start exploring real-time weather data.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 hover:scale-105 transition-all shadow-glow"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/8 py-8 px-4 text-center text-sm text-slate-600">
        <p>© {new Date().getFullYear()} WeatherBoard. Powered by OpenWeatherMap.</p>
      </footer>
    </main>
  )
}
