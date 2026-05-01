'use client'

export const dynamic = 'force-dynamic'

import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import SearchBar from '@/components/SearchBar'
import WeatherCard from '@/components/WeatherCard'
import SavedCities from '@/components/SavedCities'
import { useWeather } from '@/hooks/useWeather'
import { useLocations } from '@/hooks/useLocations'
import { AlertCircle, Cloud, TrendingUp, MapPin } from 'lucide-react'
import type { Metadata } from 'next'

// Skeleton for the WeatherCard while loading
function WeatherCardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-3 w-16 bg-white/10 rounded mb-2" />
          <div className="h-9 w-40 bg-white/10 rounded mb-2" />
          <div className="h-3 w-24 bg-white/8 rounded" />
        </div>
        <div className="h-9 w-28 bg-white/8 rounded-xl" />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-20 w-36 bg-white/10 rounded-2xl" />
        <div className="h-20 w-20 rounded-full bg-white/8" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-white/8" />
        ))}
      </div>
    </div>
  )
}

// Quick stats bar shown before any search
function StatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {[
        { icon: Cloud, label: 'Real-Time Data', desc: 'OpenWeatherMap API', color: 'text-cyan-400' },
        { icon: TrendingUp, label: '5-Day Forecasts', desc: 'Temperature trends', color: 'text-purple-400' },
        { icon: MapPin, label: 'Save Locations', desc: 'Quick city access', color: 'text-green-400' },
      ].map(({ icon: Icon, label, desc, color }) => (
        <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
          <Icon className={`h-5 w-5 ${color} shrink-0`} />
          <div>
            <p className="text-sm font-semibold text-white">{label}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [searchedCity, setSearchedCity] = useState('')
  const { weather, loading: weatherLoading, error: weatherError, fetchWeather } = useWeather()
  const { locations, loading: locLoading, saveLocation, deleteLocation } = useLocations()

  const handleSearch = useCallback(
    (city: string) => {
      setSearchedCity(city)
      fetchWeather(city)
    },
    [fetchWeather]
  )

  const handleSave = useCallback(() => {
    if (!weather) return
    saveLocation(weather.city, weather.country, weather.lat, weather.lon)
  }, [weather, saveLocation])

  const isSaved = weather ? locations.some((l) => l.cityName === weather.city) : false

  return (
    <div className="min-h-screen hero-mesh">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Weather Dashboard</h1>
          <p className="text-slate-400 text-sm">Search any city to get real-time weather data</p>
        </div>

        {/* Layout: main + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left / Main Column ── */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="mb-6">
              <SearchBar
                onSearch={handleSearch}
                loading={weatherLoading}
                placeholder="Search city (e.g. Delhi, Chennai, Kolkata)…"
              />
            </div>

            {/* Stats bar — show when nothing searched yet */}
            {!weather && !weatherLoading && !weatherError && <StatsBar />}

            {/* Error state */}
            {weatherError && !weatherLoading && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur px-5 py-4 mb-6 animate-fade-in">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-300">Couldn&apos;t fetch weather</p>
                  <p className="text-xs text-red-400/80 mt-0.5">{weatherError}</p>
                </div>
              </div>
            )}

            {/* Skeleton */}
            {weatherLoading && <WeatherCardSkeleton />}

            {/* Weather card */}
            {weather && !weatherLoading && (
              <WeatherCard
                weather={weather}
                onSave={handleSave}
                isSaved={isSaved}
              />
            )}

            {/* Empty hero */}
            {!weather && !weatherLoading && !weatherError && (
              <div className="relative flex flex-col items-center justify-center py-24 px-6 text-center rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent overflow-hidden shadow-glass">
                {/* Glowing Background Blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative">
                  <div className="text-8xl mb-8 animate-float drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">🌍</div>
                </div>

                <h2 className="text-3xl font-black text-white mb-4 tracking-tight drop-shadow-sm">Search for a city</h2>
                <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
                  Type any city name in the search bar above to instantly get real-time weather conditions and a 5-day forecast.
                </p>
              </div>
            )}
          </div>

          {/* ── Right / Sidebar ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <SavedCities
              locations={locations}
              loading={locLoading}
              onSelect={handleSearch}
              onDelete={deleteLocation}
              activeCityName={weather?.city}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
