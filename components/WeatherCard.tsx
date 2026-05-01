'use client'

import { useState } from 'react'
import { Droplets, Wind, Thermometer, Eye, Gauge, Sunrise, Sunset, MapPin, Star } from 'lucide-react'
import type { FormattedCurrentWeather } from '@/types/weather'

interface WeatherCardProps {
  weather: FormattedCurrentWeather
  onSave?: () => void
  isSaved?: boolean
}

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32)
}

function formatTime(isoString: string, timezone: number) {
  const utcMs = new Date(isoString).getTime()
  const localMs = utcMs + timezone * 1000
  const d = new Date(localMs)
  return d.toUTCString().slice(17, 22)
}

export default function WeatherCard({ weather, onSave, isSaved = false }: WeatherCardProps) {
  const [isCelsius, setIsCelsius] = useState(true)

  const temp = isCelsius ? weather.temperature : toF(weather.temperature)
  const feelsLike = isCelsius ? weather.feelsLike : toF(weather.feelsLike)
  const unit = isCelsius ? '°C' : '°F'

  const flagEmoji = weather.country
    ? String.fromCodePoint(
        ...weather.country
          .toUpperCase()
          .split('')
          .map((c) => 0x1f1e0 + c.charCodeAt(0) - 65)
      )
    : ''

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-glass animate-slide-up">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        {/* Header: City + Flag + Save */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{weather.country} {flagEmoji}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{weather.city}</h2>
            <p className="text-slate-400 capitalize mt-1">{weather.description}</p>
          </div>

          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                isSaved
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 cursor-default'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-cyan-500/15 hover:text-cyan-400 hover:border-cyan-500/30'
              }`}
            >
              <Star className={`h-4 w-4 ${isSaved ? 'fill-cyan-400' : ''}`} />
              {isSaved ? 'Saved' : 'Save City'}
            </button>
          )}
        </div>

        {/* Temperature + Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-end gap-3">
            <span className="text-7xl sm:text-8xl font-extrabold text-white leading-none">
              {temp}
            </span>
            <div className="mb-3">
              {/* Unit toggle */}
              <div className="flex rounded-xl overflow-hidden border border-white/15 mb-1">
                <button
                  onClick={() => setIsCelsius(true)}
                  className={`px-3 py-1.5 text-sm font-bold transition-all duration-200 ${
                    isCelsius ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setIsCelsius(false)}
                  className={`px-3 py-1.5 text-sm font-bold transition-all duration-200 ${
                    !isCelsius ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  °F
                </button>
              </div>
              <p className="text-slate-400 text-xs text-center">Feels {feelsLike}{unit}</p>
            </div>
          </div>

          {/* Weather Icon */}
          <div className="animate-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={weather.iconUrl}
              alt={weather.description}
              width={96}
              height={96}
              className="drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            />
          </div>
        </div>

        {/* Min / Max */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Thermometer className="h-4 w-4 text-red-400" />
            <span>H: {isCelsius ? weather.tempMax : toF(weather.tempMax)}{unit}</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Thermometer className="h-4 w-4 text-blue-400" />
            <span>L: {isCelsius ? weather.tempMin : toF(weather.tempMin)}{unit}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%`, color: 'text-blue-400' },
            { icon: Wind, label: 'Wind Speed', value: `${weather.windSpeed} km/h`, color: 'text-green-400' },
            { icon: Eye, label: 'Visibility', value: `${weather.visibility} km`, color: 'text-purple-400' },
            { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa`, color: 'text-orange-400' },
            {
              icon: Sunrise,
              label: 'Sunrise',
              value: formatTime(weather.sunrise, weather.timezone),
              color: 'text-yellow-400',
            },
            {
              icon: Sunset,
              label: 'Sunset',
              value: formatTime(weather.sunset, weather.timezone),
              color: 'text-pink-400',
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/8 p-3 hover:bg-white/8 transition-colors duration-200"
            >
              <div className={`${color} shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
