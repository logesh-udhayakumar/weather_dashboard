import Link from 'next/link'
import { Cloud, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen hero-mesh flex items-center justify-center px-4 text-center">
      <div className="relative max-w-md animate-slide-up">
        {/* Glowing background blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow mb-8">
            <Cloud className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-8xl font-black text-white tracking-tighter mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Lost in the clouds?</h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to a different altitude.
          </p>

          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Safety
          </Link>
        </div>
      </div>
    </div>
  )
}
