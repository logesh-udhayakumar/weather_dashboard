'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts'
import type { FormattedForecast } from '@/types/weather'

interface WeatherChartProps {
  forecast: FormattedForecast[]
  city?: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-navy-900/95 backdrop-blur-xl p-4 shadow-glass">
        <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-300 capitalize">{entry.name}:</span>
            <span className="font-bold text-white">{entry.value}°C</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function WeatherChart({ forecast, city }: WeatherChartProps) {
  const chartData = forecast.map((f) => ({
    date: f.day.split(',')[0], // Short day label e.g. "Mon"
    fullDate: f.day,
    temp: f.temperature,
    min: f.tempMin,
    max: f.tempMax,
    humidity: f.humidity,
  }))

  if (!forecast.length) return null

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl p-6 shadow-glass">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">
          Temperature Trend
          {city && <span className="text-cyan-400 ml-2">— {city}</span>}
        </h3>
        <p className="text-sm text-slate-400 mt-1">5-day temperature overview with min/max range</p>
      </div>

      {/* Temperature Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />

          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(6,182,212,0.3)', strokeWidth: 1 }} />

          <Legend
            wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#94a3b8' }}
            iconType="circle"
            iconSize={8}
          />

          <Area
            type="monotone"
            dataKey="max"
            name="Max"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#maxGradient)"
            dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#f97316', fill: '#0f172a' }}
          />

          <Area
            type="monotone"
            dataKey="temp"
            name="Avg"
            stroke="#06b6d4"
            strokeWidth={3}
            fill="url(#tempGradient)"
            dot={{ fill: '#06b6d4', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 7, strokeWidth: 2, stroke: '#06b6d4', fill: '#0f172a' }}
          />

          <Line
            type="monotone"
            dataKey="min"
            name="Min"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#6366f1', fill: '#0f172a' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Humidity Bar Chart */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-slate-400 mb-4">Humidity (%)</h4>
        <ResponsiveContainer width="100%" height={80}>
          <LineChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} dy={6} />
            <YAxis hide domain={[0, 100]} />
            <ReferenceLine y={70} stroke="rgba(99,102,241,0.3)" strokeDasharray="3 3" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Humidity']}
              contentStyle={{
                background: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#e2e8f0',
              }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#818cf8"
              strokeWidth={2}
              dot={{ fill: '#818cf8', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
