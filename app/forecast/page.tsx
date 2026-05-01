'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import ForecastCard from '@/components/ForecastCard'
import WeatherChart from '@/components/WeatherChart'
import { useForecast } from '@/hooks/useWeather'
import { AlertCircle, Calendar } from 'lucide-react'

// Skeleton for forecast cards
function ForecastSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/8 bg-white/5 p-4 animate-pulse flex flex-col items-center gap-3">
          <div className="h-3 w-12 bg-white/10 rounded" />
          <div className="h-12 w-12 rounded-full bg-white/10" />
          <div className="h-2.5 w-16 bg-white/8 rounded" />
          <div className="h-4 w-12 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse">
      <div className="h-5 w-48 bg-white/10 rounded mb-2" />
      <div className="h-3 w-64 bg-white/8 rounded mb-6" />
      <div className="h-64 bg-white/5 rounded-2xl" />
    </div>
  )
}

export default function ForecastPage() {
  const [city, setCity] = useState('')
  const { forecast, loading, error, fetchForecast } = useForecast()

  const handleSearch = useCallback(
    (q: string) => {
      setCity(q)
      fetchForecast(q)
    },
    [fetchForecast]
  )

  return (
    <div className="min-h-screen hero-mesh">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">5-Day Forecast</h1>
            <p className="text-slate-400 text-sm">Plan ahead with daily weather forecasts</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            placeholder="Search city for forecast (e.g. Paris, Sydney)…"
          />
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 mb-6 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">Forecast unavailable</p>
              <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <>
            <ForecastSkeleton />
            <ChartSkeleton />
          </>
        )}

        {/* Forecast cards */}
        {!loading && forecast.length > 0 && (
          <>
            {/* City label */}
            {city && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-400">Showing forecast for</span>
                <span className="text-sm font-bold text-white bg-white/8 border border-white/10 px-3 py-1 rounded-full">
                  {city}
                </span>
              </div>
            )}

            {/* Forecast grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {forecast.map((f, i) => (
                <ForecastCard key={f.dateKey} forecast={f} index={i} />
              ))}
            </div>

            {/* Chart */}
            <WeatherChart forecast={forecast} city={city} />
          </>
        )}

        {/* Empty state */}
        {!loading && forecast.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border border-white/8 bg-white/3">
            <div className="text-7xl mb-5 animate-float">📅</div>
            <h2 className="text-xl font-bold text-white mb-2">Get a 5-day forecast</h2>
            <p className="text-slate-400 text-sm max-w-xs">
              Search for any city above to see daily forecasts and temperature trend charts.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
