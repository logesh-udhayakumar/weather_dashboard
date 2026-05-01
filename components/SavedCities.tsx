'use client'

import { X, MapPin, Loader2 } from 'lucide-react'
import type { SavedLocation } from '@/types/weather'

interface SavedCitiesProps {
  locations: SavedLocation[]
  loading?: boolean
  onSelect: (cityName: string) => void
  onDelete: (id: string) => void
  activeCityName?: string
}

// Skeleton loader for individual city card
function CitySkeleton() {
  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-3 animate-pulse">
      <div className="h-7 w-7 rounded-full bg-white/10 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-3 w-24 bg-white/10 rounded mb-1.5" />
        <div className="h-2.5 w-12 bg-white/8 rounded" />
      </div>
    </div>
  )
}

export default function SavedCities({
  locations,
  loading = false,
  onSelect,
  onDelete,
  activeCityName,
}: SavedCitiesProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
          <div className="h-3.5 w-28 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <CitySkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl p-5 shadow-glass">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Saved Cities</h3>
        </div>
        {locations.length > 0 && (
          <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            {locations.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {locations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-3xl mb-3">📍</div>
          <p className="text-sm text-slate-400">No saved cities yet</p>
          <p className="text-xs text-slate-600 mt-1">Search for a city and click "Save City"</p>
        </div>
      )}

      {/* City list */}
      {locations.length > 0 && (
        <div className="flex flex-col gap-3">
          {locations.map((loc) => {
            const isActive = loc.cityName === activeCityName
            // Dynamic building icon based on city name characters
            const buildings = ['🏙️', '🌇', '🌃', '🌉', '🌁', '🏰', '🏯', '🏟️', '🎡', '⛩️']
            const charSum = loc.cityName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
            const cityEmoji = buildings[charSum % buildings.length]

            return (
              <div
                key={loc.id}
                className={`group relative flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5'
                }`}
                onClick={() => onSelect(loc.cityName)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Icon */}
                  <span className="text-2xl shrink-0 drop-shadow-sm">{cityEmoji}</span>

                  {/* City info */}
                  <div className="flex flex-col min-w-0">
                    <p
                      className={`text-base font-bold truncate leading-tight transition-colors ${
                        isActive ? 'text-cyan-300' : 'text-white group-hover:text-cyan-100'
                      }`}
                    >
                      {loc.cityName}
                    </p>
                    <p className="text-xs font-medium text-slate-400 truncate mt-0.5">{loc.country}</p>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(loc.id)
                  }}
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-600 hover:scale-110 shadow-lg border-2 border-navy-900"
                  aria-label={`Remove ${loc.cityName}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
