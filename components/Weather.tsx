"use client"
import React, { useEffect, useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "@/styles/Weather.module.css"
import Axios from "./Axios"
import Forecast from "./Forecast"
import locations from "../locations.json"

interface Location {
  id: string
  name: string
  lat: number
  lon: number
  default?: boolean
}

interface ForecastPeriod {
  name: string
  shortForecast: string
  temperature: number
  icon: string
}

export default function Weather() {
  const defaultLocation: Location =
    (locations as Location[]).find(l => l.default) ??
    (locations as Location[])[0]

  const [location, setLocation] = useState<Location>({ ...defaultLocation })
  const [forecast, setForecast] = useState<[ForecastPeriod, ForecastPeriod][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

        // Group into tuples of [day, night], fallback to day if night missing
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
        }, 250) // match fade animation duration
      })
      .catch(err => {
        console.error(err)
        setError("Failed to load weather data")
        setIsTransitioning(false)
      })
      .finally(() => setLoading(false))
  }, [location])

  return (
    <div className={`container ${styles.weatherContainer}`}>
      {/* Location selector */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={location.id}
            onChange={e => {
              const selected = (locations as Location[]).find(
                l => l.id === e.target.value
              )
              if (selected) setLocation({ ...selected }) // clone for new reference
            }}
          >
            {(locations as Location[]).map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {/* Animated forecast wrapper */}
      <div
        key={location.id} // forces remount on location change
        className={`${styles.forecastWrapper} ${
          isTransitioning ? styles.fadeOut : styles.fadeIn
        }`}
      >
        {loading && <p>Loading weather…</p>}

        <div className="row">
          {forecast.map((forecastItem, index) => (
            <Forecast
              key={`${location.id}-${index}`}
              day={forecastItem}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

