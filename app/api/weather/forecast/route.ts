import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { fetchWeatherForecast } from '@/lib/weatherApi'

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
    const cacheKey = `weather:forecast:${normalizedCity}`

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
    const forecast = await fetchWeatherForecast(city.trim())

    // --- Cache in Redis for 30 minutes ---
    await redis.setex(cacheKey, 1800, JSON.stringify(forecast))

    return NextResponse.json({
      data: forecast,
      cached: false,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    console.error('Forecast API error:', error)

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosErr = error as { response: { status: number } }
      if (axiosErr.response?.status === 404) {
        return NextResponse.json(
          { error: 'Not Found', message: 'City not found. Please check the city name.' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch forecast data' },
      { status: 500 }
    )
  }
}
