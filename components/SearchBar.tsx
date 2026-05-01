'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'

interface SearchBarProps {
  onSearch: (city: string) => void
  loading?: boolean
  placeholder?: string
  defaultValue?: string
}

export default function SearchBar({
  onSearch,
  loading = false,
  placeholder = 'Search for a city...',
  defaultValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  // Debounce search: 500 ms after user stops typing
  useEffect(() => {
    // Skip firing on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        onSearch(value.trim())
      }, 500)
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim()) onSearch(value.trim())
  }

  const handleClear = () => {
    setValue('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        {/* Search Icon / Loader */}
        <div className="absolute z-10 pointer-events-none left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-200">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        {/* Input */}
        <input
          id="city-search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="
            w-full h-14 pl-12 pr-12 rounded-2xl
            bg-white/5 border border-white/10
            text-white placeholder-slate-500
            text-base font-medium
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-white/8
            hover:bg-white/7 hover:border-white/20
            backdrop-blur-sm
          "
        />

        {/* Clear Button */}
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_25px_rgba(6,182,212,0.15)]" />
      </div>
    </form>
  )
}
