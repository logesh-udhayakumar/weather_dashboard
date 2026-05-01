'use client'

import { Droplets, Wind } from 'lucide-react'
import type { FormattedForecast } from '@/types/weather'

interface ForecastCardProps {
  forecast: FormattedForecast
  index?: number
}

export default function ForecastCard({ forecast, index = 0 }: ForecastCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-4 flex flex-col items-center gap-3 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 group animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Decorative blob */}
      <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Day label */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{forecast.day}</p>

      {/* Weather icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={forecast.iconUrl}
        alt={forecast.description}
        width={56}
        height={56}
        className="drop-shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-300"
      />

      {/* Description */}
      <p className="text-xs text-slate-400 capitalize text-center leading-tight">{forecast.description}</p>

      {/* Temp range */}
      <div className="flex items-center gap-1 text-sm font-bold">
        <span className="text-white">{forecast.tempMax}°</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400">{forecast.tempMin}°</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 w-full justify-center">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Droplets className="h-3 w-3 text-blue-400" />
          <span>{forecast.humidity}%</span>
        </div>
        {forecast.pop > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className="text-cyan-400">💧</span>
            <span>{forecast.pop}%</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Wind className="h-3 w-3 text-green-400" />
          <span>{forecast.windSpeed}</span>
        </div>
      </div>
    </div>
  )
}
