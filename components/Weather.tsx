"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { setTimezone } from "@/redux/features/locationSlice"
import styles from "@/styles/Weather.module.css"
import Axios from "./Axios"
import Forecast from "./Forecast"
import locations from "../locations.json"

interface Location {
  id: string
  name: string
  lat: number
  lon: number
  timezone: string
  default?: boolean
}

interface ForecastPeriod {
  name: string
  shortForecast: string
  temperature: number
  icon: string
}

export default function Weather() {
  const dispatch = useDispatch<AppDispatch>()
  const defaultLocation: Location =
    (locations as Location[]).find(l => l.default) ??
    (locations as Location[])[0]

  const [location, setLocation] = useState<Location>({ ...defaultLocation })
  const [forecast, setForecast] = useState<[ForecastPeriod, ForecastPeriod][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setRefreshKey(k => k + 1), 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!location) return

    setIsTransitioning(true)
    setLoading(true)
    setError(null)

    const pointsUrl = `https://api.weather.gov/points/${location.lat},${location.lon}`

    Axios(pointsUrl, "get")
      .then(res => {
        const forecastUrl = res.data?.properties?.forecast
        return Axios(forecastUrl, "get")
      })
      .then(res => {
        const periods: ForecastPeriod[] = res.data?.properties?.periods ?? []

        const grouped: [ForecastPeriod, ForecastPeriod][] = []
        for (let i = 0; i < periods.length; i += 2) {
          const dayPair: [ForecastPeriod, ForecastPeriod] = [
            periods[i],
            periods[i + 1] ?? periods[i],
          ]
          grouped.push(dayPair)
        }

        setTimeout(() => {
          setForecast(grouped)
          setIsTransitioning(false)
        }, 200)
      })
      .catch(err => {
        console.error(err)
        setError("Failed to load weather data")
        setIsTransitioning(false)
      })
      .finally(() => setLoading(false))
  }, [location, refreshKey])

  return (
    <div className={styles.weatherCard}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-foreground">Weather</h2>
        <select
          className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.4)] transition-all w-full sm:w-48"
          value={location.id}
          onChange={e => {
            const selected = (locations as Location[]).find(
              l => l.id === e.target.value
            )
            if (selected) {
              setLocation({ ...selected })
              dispatch(setTimezone(selected.timezone))
            }
          }}
        >
          {(locations as Location[]).map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}

      <motion.div
        key={location.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 8 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {loading && (
          <p className="text-sm text-foreground-muted py-8 text-center">Loading weather…</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((forecastItem, index) => (
            <Forecast
              key={`${location.id}-${index}`}
              day={forecastItem}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
