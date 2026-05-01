'use client'

import { useState, useCallback } from 'react'
import axios from 'axios'
import type { FormattedCurrentWeather, FormattedForecast, UseWeatherReturn, UseForecastReturn } from '@/types/weather'

// ──────────────────────────────────────────────
// useWeather — Current weather hook
// ──────────────────────────────────────────────
export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<FormattedCurrentWeather | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(async (city: string) => {
    if (!city.trim()) return

    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.get<{ data: FormattedCurrentWeather }>('/api/weather/current', {
        params: { city: city.trim() },
      })
      setWeather(data.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message ?? 'Failed to fetch weather data'
        setError(msg)
      } else {
        setError('An unexpected error occurred')
      }
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return { weather, loading, error, fetchWeather }
}

// ──────────────────────────────────────────────
// useForecast — 5-day forecast hook
// ──────────────────────────────────────────────
export function useForecast(): UseForecastReturn {
  const [forecast, setForecast] = useState<FormattedForecast[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchForecast = useCallback(async (city: string) => {
    if (!city.trim()) return

    setLoading(true)
    setError(null)

    try {
      const { data } = await axios.get<{ data: FormattedForecast[] }>('/api/weather/forecast', {
        params: { city: city.trim() },
      })
      setForecast(data.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message ?? 'Failed to fetch forecast data'
        setError(msg)
      } else {
        setError('An unexpected error occurred')
      }
      setForecast([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { forecast, loading, error, fetchForecast }
}
