import axios from 'axios'
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  FormattedCurrentWeather,
  FormattedForecast,
} from '@/types/weather'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const API_KEY = process.env.OPENWEATHER_API_KEY

if (!API_KEY) {
  console.warn('OPENWEATHER_API_KEY is not set in environment variables.')
}

export async function fetchCurrentWeather(city: string): Promise<FormattedCurrentWeather> {
  const response = await axios.get<CurrentWeatherResponse>(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
    },
  })

  const data = response.data
  return formatCurrentWeather(data)
}

export async function fetchWeatherForecast(city: string): Promise<FormattedForecast[]> {
  const response = await axios.get<ForecastResponse>(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      cnt: 40, // 5 days × 8 readings per day
    },
  })

  return formatForecast(response.data)
}

function formatCurrentWeather(data: CurrentWeatherResponse): FormattedCurrentWeather {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s → km/h
    windDeg: data.wind.deg,
    visibility: Math.round((data.visibility ?? 0) / 1000), // m → km
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
    lat: data.coord.lat,
    lon: data.coord.lon,
    timezone: data.timezone,
    fetchedAt: new Date().toISOString(),
  }
}

function formatForecast(data: ForecastResponse): FormattedForecast[] {
  // Group by day and get one reading per day (closest to noon)
  const dailyMap = new Map<string, FormattedForecast>()

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toISOString().split('T')[0]
    const hour = date.getUTCHours()

    if (!dailyMap.has(dateKey) || Math.abs(hour - 12) < Math.abs(dailyMap.get(dateKey)!.hour - 12)) {
      dailyMap.set(dateKey, {
        date: date.toISOString(),
        dateKey,
        hour,
        day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        feelsLike: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        windSpeed: Math.round(item.wind.speed * 3.6),
        pop: Math.round((item.pop ?? 0) * 100), // probability of precipitation %
      })
    }
  })

  return Array.from(dailyMap.values()).slice(0, 5)
}
