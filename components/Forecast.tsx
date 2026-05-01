"use client"
import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import * as icons from "@/icons/weather/animated"
import styles from "@/styles/Weather.module.css"

interface ForecastPeriod {
  name: string
  shortForecast: string
  temperature: number
  icon: string
  isDaytime: boolean
}

interface ForecastProps {
  day: [ForecastPeriod, ForecastPeriod]
}

const iconMap: Record<string, any> = {
  // clear
  skc:              { day: icons.ClearDay,                  night: icons.ClearNight },
  few:              { day: icons.ClearDay,                  night: icons.ClearNight },
  // partly cloudy
  sct:              { day: icons.PartlyCloudyDay,           night: icons.PartlyCloudyNight },
  bkn:              { day: icons.PartlyCloudyDay,           night: icons.PartlyCloudyNight },
  // overcast
  ovc:              { day: icons.OvercastDay,               night: icons.OvercastNight },
  // wind
  wind_skc:         { day: icons.Wind,                      night: icons.Wind },
  wind_few:         { day: icons.Wind,                      night: icons.Wind },
  wind_sct:         { day: icons.Wind,                      night: icons.Wind },
  wind_bkn:         { day: icons.Wind,                      night: icons.Wind },
  wind_ovc:         { day: icons.Wind,                      night: icons.Wind },
  // rain
  rain:             { day: icons.Rain,                      night: icons.Rain },
  rain_showers:     { day: icons.PartlyCloudyDayRain,       night: icons.PartlyCloudyNightRain },
  rain_showers_hi:  { day: icons.PartlyCloudyDayRain,       night: icons.PartlyCloudyNightRain },
  // drizzle / mixed precip
  rain_snow:        { day: icons.PartlyCloudyDaySnow,       night: icons.PartlyCloudyNightSnow },
  rain_sleet:       { day: icons.PartlyCloudyDaySleet,      night: icons.PartlyCloudyNightSleet },
  snow_sleet:       { day: icons.Sleet,                     night: icons.Sleet },
  fzra:             { day: icons.Sleet,                     night: icons.Sleet },
  rain_fzra:        { day: icons.PartlyCloudyDaySleet,      night: icons.PartlyCloudyNightSleet },
  snow_fzra:        { day: icons.PartlyCloudyDaySnow,       night: icons.PartlyCloudyNightSnow },
  sleet:            { day: icons.Sleet,                     night: icons.Sleet },
  // snow
  snow:             { day: icons.Snow,                      night: icons.Snow },
  blizzard:         { day: icons.Snow,                      night: icons.Snow },
  // thunderstorms
  tsra:             { day: icons.ThunderstormsDayRain,      night: icons.ThunderstormsNightRain },
  tsra_sct:         { day: icons.ThunderstormsDay,          night: icons.ThunderstormsNight },
  tsra_hi:          { day: icons.ThunderstormsDay,          night: icons.ThunderstormsNight },
  // tropical
  tornado:          { day: icons.Tornado,                   night: icons.Tornado },
  hurricane:        { day: icons.Hurricane,                 night: icons.Hurricane },
  tropical_storm:   { day: icons.Hurricane,                 night: icons.Hurricane },
  // visibility
  fog:              { day: icons.FogDay,                    night: icons.FogNight },
  haze:             { day: icons.HazeDay,                   night: icons.HazeNight },
  smoke:            { day: icons.Smoke,                     night: icons.Smoke },
  smoke_particles:  { day: icons.SmokeParticles,            night: icons.SmokeParticles },
  dust:             { day: icons.DustDay,                   night: icons.DustNight },
  // extreme
  hot:              { day: icons.ThermometerHot,            night: icons.ThermometerHot },
  cold:             { day: icons.ThermometerCold,           night: icons.ThermometerCold },
}

export default function Forecast({ day }: ForecastProps) {
  const [hover, setHover] = useState(false)

  const current = hover ? day[1] : day[0]

  const getCode = (iconUrl?: string) => {
    if (!iconUrl) return "skc"
    const parts = iconUrl.split("/").pop() ?? ""
    const code = parts.split(",")[0].split("?")[0]
    return code.toLowerCase()
  }

  const iconCode = getCode(current.icon)
  const icon = iconMap[iconCode]?.[current.isDaytime ? "day" : "night"] ?? icons.ClearDay

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={styles.forecastCard}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <p className="text-xs font-medium text-foreground-muted text-center">{current.name}</p>
      <Image src={icon} alt={current.shortForecast} width={56} height={56} />
      <p className="text-xl font-bold text-foreground">{current.temperature}°</p>
      <p className="text-xs text-foreground-subtle text-center leading-tight capitalize line-clamp-2">
        {current.shortForecast}
      </p>
    </motion.div>
  )
}
