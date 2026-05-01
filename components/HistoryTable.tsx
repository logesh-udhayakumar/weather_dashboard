'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { WeatherRecord } from '@/types/weather'

type SortField = 'cityName' | 'temperature' | 'humidity' | 'windSpeed' | 'fetchedAt'
type SortDir = 'asc' | 'desc'

interface HistoryTableProps {
  records: WeatherRecord[]
  loading?: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onCityFilter: (city: string) => void
  cityFilter: string
}

function SortIcon({ field, sortField, sortDir }: { field: string; sortField: string; sortDir: SortDir }) {
  if (field !== sortField) return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-600" />
  return sortDir === 'asc' ? (
    <ChevronUp className="h-3.5 w-3.5 text-cyan-400" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
  )
}

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'cityName', label: 'City' },
  { key: 'temperature', label: 'Temp (°C)' },
  { key: 'humidity', label: 'Humidity' },
  { key: 'windSpeed', label: 'Wind' },
  { key: 'fetchedAt', label: 'Date' },
]

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {COLUMNS.map((col) => (
        <td key={col.key} className="px-4 py-3.5">
          <div className="h-3.5 w-full max-w-[120px] rounded bg-white/8 animate-pulse" />
        </td>
      ))}
      <td className="px-4 py-3.5">
        <div className="h-3.5 w-16 rounded bg-white/8 animate-pulse" />
      </td>
    </tr>
  )
}

export default function HistoryTable({
  records,
  loading = false,
  page,
  totalPages,
  total,
  onPageChange,
  onCityFilter,
  cityFilter,
}: HistoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('fetchedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  // Client-side sort (server already paginates)
  const sorted = useMemo(() => {
    return [...records].sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      const dir = sortDir === 'asc' ? 1 : -1

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * dir
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * dir
      }
      return 0
    })
  }, [records, sortField, sortDir])

  const getWeatherEmoji = (desc: string) => {
    const d = desc.toLowerCase()
    if (d.includes('sun') || d.includes('clear')) return '☀️'
    if (d.includes('cloud')) return '☁️'
    if (d.includes('rain')) return '🌧️'
    if (d.includes('snow')) return '❄️'
    if (d.includes('thunder')) return '⛈️'
    if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return '🌫️'
    return '🌤️'
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl shadow-glass overflow-hidden">
      {/* Table toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-white/8">
        <div>
          <h3 className="text-base font-bold text-white">Weather History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {total} records total
          </p>
        </div>
        {/* City filter */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => onCityFilter(e.target.value)}
            placeholder="Filter by city..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/40 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-white/8">
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {label}
                    <SortIcon field={key} sortField={sortField} sortDir={sortDir} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Condition
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
              : sorted.map((record, i) => (
                  <tr
                    key={record.id}
                    className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/5 ${
                      i % 2 === 0 ? '' : 'bg-white/2'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white text-sm">{record.cityName}</div>
                      <div className="text-xs text-slate-500">{record.country}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{record.temperature}°C</span>
                        <span className="text-xs text-slate-500">/ {record.feelsLike}° feels</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-sm text-blue-300">
                        💧 {record.humidity}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-green-300">💨 {record.windSpeed} km/h</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-400">
                        {new Date(record.fetchedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-slate-600">
                        {new Date(record.fetchedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 rounded-full px-2.5 py-1 border border-white/8 capitalize">
                        {getWeatherEmoji(record.description)} {record.description}
                      </span>
                    </td>
                  </tr>
                ))}

            {/* Empty state */}
            {!loading && sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-slate-400 text-sm">No weather records found</p>
                  <p className="text-slate-600 text-xs mt-1">
                    {cityFilter ? `No records for "${cityFilter}"` : 'Search for a city on the Dashboard to start recording'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/8">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i))
              return p
            })
              .filter((p, idx, arr) => arr.indexOf(p) === idx && p >= 1 && p <= totalPages)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    p === page
                      ? 'bg-cyan-500 text-white shadow-glow'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
