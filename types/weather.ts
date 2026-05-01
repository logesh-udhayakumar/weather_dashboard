// ============================================================
// OpenWeatherMap Raw API Response Types
// ============================================================

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

export interface WindData {
  speed: number
  deg: number
  gust?: number
}

export interface SysData {
  country: string
  sunrise: number
  sunset: number
}

export interface CoordData {
  lat: number
  lon: number
}

export interface CurrentWeatherResponse {
  coord: CoordData
  weather: WeatherCondition[]
  main: MainWeatherData
  wind: WindData
  visibility?: number
  sys: SysData
  dt: number
  timezone: number
  id: number
  name: string
  cod: number
}

export interface ForecastItem {
  dt: number
  main: MainWeatherData
  weather: WeatherCondition[]
  wind: WindData
  visibility?: number
  pop?: number
  dt_txt: string
}

export interface ForecastCity {
  id: number
  name: string
  coord: CoordData
  country: string
  timezone: number
  sunrise: number
  sunset: number
}

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: ForecastCity
}

// ============================================================
// Formatted / Application Types
// ============================================================

export interface FormattedCurrentWeather {
  city: string
  country: string
  temperature: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  pressure: number
  windSpeed: number
  windDeg: number
  visibility: number
  description: string
  icon: string
  iconUrl: string
  sunrise: string
  sunset: string
  lat: number
  lon: number
  timezone: number
  fetchedAt: string
}

export interface FormattedForecast {
  date: string
  dateKey: string
  hour: number
  day: string
  temperature: number
  tempMin: number
  tempMax: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  iconUrl: string
  windSpeed: number
  pop: number
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiResponse<T> {
  data: T
  cached: boolean
  timestamp: string
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

// ============================================================
// Saved Location Types
// ============================================================

export interface SavedLocation {
  id: string
  cityName: string
  country: string
  lat?: number | null
  lon?: number | null
  userId: string
  createdAt: string
}

// ============================================================
// Weather Record Types (DB)
// ============================================================

export interface WeatherRecord {
  id: string
  cityName: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  description: string
  windSpeed: number
  icon: string
  pressure: number
  visibility: number
  sunrise?: string | null
  sunset?: string | null
  fetchedAt: string
}

// ============================================================
// Hook Return Types
// ============================================================

export interface UseWeatherReturn {
  weather: FormattedCurrentWeather | null
  loading: boolean
  error: string | null
  fetchWeather: (city: string) => Promise<void>
}

export interface UseForecastReturn {
  forecast: FormattedForecast[]
  loading: boolean
  error: string | null
  fetchForecast: (city: string) => Promise<void>
}

export interface UseLocationsReturn {
  locations: SavedLocation[]
  loading: boolean
  saveLocation: (cityName: string, country: string, lat?: number, lon?: number) => Promise<void>
  deleteLocation: (id: string) => Promise<void>
  refetch: () => Promise<void>
}

// ============================================================
// Chart Data Types
// ============================================================

export interface ChartDataPoint {
  date: string
  temp: number
  min: number
  max: number
  humidity: number
}

// ============================================================
// NextAuth Type Extensions
// ============================================================

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
