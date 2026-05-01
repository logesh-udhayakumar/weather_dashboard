import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { fetchCurrentWeather } from '@/lib/weatherApi'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')

    if (!city || city.trim().length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'City name is required' },
        { status: 400 }
      )
    }

    const normalizedCity = city.trim().toLowerCase()
    const cacheKey = `weather:current:${normalizedCity}`

    // --- Check Redis cache ---
    const cached = await redis.get(cacheKey)
    if (cached) {
      const parsedCache = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json({
        data: parsedCache,
        cached: true,
        timestamp: new Date().toISOString(),
      })
    }

    // --- Fetch from OpenWeatherMap ---
    const weather = await fetchCurrentWeather(city.trim())

    // --- Cache in Redis for 10 minutes ---
    await redis.set(cacheKey, JSON.stringify(weather), { ex: 600 })

    // --- Persist to database (fire and forget) ---
    prisma.weatherRecord
      .create({
        data: {
          cityName: weather.city,
          country: weather.country,
          temperature: weather.temperature,
          feelsLike: weather.feelsLike,
          humidity: weather.humidity,
          description: weather.description,
          windSpeed: weather.windSpeed,
          icon: weather.icon,
          pressure: weather.pressure,
          visibility: weather.visibility,
          sunrise: weather.sunrise ? new Date(weather.sunrise) : null,
          sunset: weather.sunset ? new Date(weather.sunset) : null,
        },
      })
      .catch((err) => console.error('Failed to save weather record:', err))

    return NextResponse.json({
      data: weather,
      cached: false,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error('Weather API error:', error)

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosErr = error as { response: { status: number } }
      if (axiosErr.response?.status === 404) {
        return NextResponse.json(
          { error: 'Not Found', message: 'City not found. Please check the city name and try again.' },
          { status: 404 }
        )
      }
      if (axiosErr.response?.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid API key. Check your OpenWeatherMap API key.' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
