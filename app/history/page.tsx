'use client'

import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import HistoryTable from '@/components/HistoryTable'
import { History } from 'lucide-react'
import type { WeatherRecord } from '@/types/weather'

interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function HistoryPage() {
  const [records, setRecords] = useState<WeatherRecord[]>([])
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [cityFilter, setCityFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [debouncedCity, setDebouncedCity] = useState('')

  // Debounce city filter
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedCity(cityFilter)
      // Reset to page 1 on new filter
      setPagination((p) => ({ ...p, page: 1 }))
    }, 400)
    return () => clearTimeout(t)
  }, [cityFilter])

  const fetchHistory = useCallback(async (page: number, city: string) => {
    setLoading(true)
    try {
      const { data } = await axios.get<{ data: WeatherRecord[]; pagination: PaginationMeta }>(
        '/api/history',
        { params: { city: city || undefined, page } }
      )
      setRecords(data.data)
      setPagination(data.pagination)
    } catch {
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch when page or debounced city changes
  useEffect(() => {
    fetchHistory(pagination.page, debouncedCity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, debouncedCity])

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }))
  }

  const handleCityFilter = (value: string) => {
    setCityFilter(value)
  }

  return (
    <div className="min-h-screen hero-mesh">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Weather History</h1>
            <p className="text-slate-400 text-sm">Browse past weather records sorted by most recent</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Records', value: pagination.total.toLocaleString(), emoji: '📊' },
            { label: 'Current Page', value: `${pagination.page} / ${pagination.totalPages || 1}`, emoji: '📄' },
            { label: 'Records/Page', value: pagination.pageSize, emoji: '🔢' },
          ].map(({ label, value, emoji }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/5 px-5 py-4 flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <HistoryTable
          records={records}
          loading={loading}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={handlePageChange}
          onCityFilter={handleCityFilter}
          cityFilter={cityFilter}
        />
      </main>
    </div>
  )
}
