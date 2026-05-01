'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import type { SavedLocation, UseLocationsReturn } from '@/types/weather'

export function useLocations(): UseLocationsReturn {
  const [locations, setLocations] = useState<SavedLocation[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLocations = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<{ data: SavedLocation[] }>('/api/locations')
      setLocations(data.data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        toast.error('Failed to load saved cities')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const saveLocation = useCallback(
    async (cityName: string, country: string, lat?: number, lon?: number) => {
      try {
        const { data } = await axios.post<{ data: SavedLocation; message: string }>('/api/locations', {
          cityName,
          country,
          lat,
          lon,
        })
        setLocations((prev) => {
          const exists = prev.some((l) => l.cityName === cityName)
          if (exists) return prev
          return [data.data, ...prev]
        })
        toast.success(`${cityName} saved!`)
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const msg = err.response?.data?.message ?? 'Failed to save city'
          toast.error(msg)
        }
      }
    },
    []
  )

  const deleteLocation = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/locations?id=${id}`)
      setLocations((prev) => prev.filter((l) => l.id !== id))
      toast.success('City removed')
    } catch {
      toast.error('Failed to remove city')
    }
  }, [])

  return {
    locations,
    loading,
    saveLocation,
    deleteLocation,
    refetch: fetchLocations,
  }
}
