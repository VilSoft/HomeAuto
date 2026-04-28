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
}

interface ForecastProps {
  day: [ForecastPeriod, ForecastPeriod]
}

const iconMap: Record<string, any> = {
  skc: { day: icons.ClearDay, night: icons.ClearNight },
  few: { day: icons.ClearDay, night: icons.ClearNight },
  sct: { day: icons.PartlyCloudyDay, night: icons.PartlyCloudyNight },
  bkn: { day: icons.PartlyCloudyDay, night: icons.PartlyCloudyNight },
  ovc: { day: icons.PartlyCloudyDay, night: icons.PartlyCloudyNight },
  wind_skc: { day: icons.Wind, night: icons.Wind },
  wind_few: { day: icons.Wind, night: icons.Wind },
  snow: { day: icons.PartlyCloudyDaySnow, night: icons.PartlyCloudyNightSnow },
  rain: { day: icons.Rain, night: icons.Rain },
  tsra: { day: icons.ThunderstormsDayRain, night: icons.ThunderstormsNightRain },
  tornado: { day: icons.Tornado, night: icons.Tornado },
  hurricane: { day: icons.Hurricane, night: icons.Hurricane },
  dust: { day: icons.DustDay, night: icons.DustNight },
  smoke: { day: icons.Smoke, night: icons.Smoke },
  haze: { day: icons.HazeDay, night: icons.HazeNight },
  hot: { day: icons.ThermometerHot, night: icons.ThermometerHot },
  cold: { day: icons.ThermometerCold, night: icons.ThermometerCold },
  blizzard: { day: icons.Snow, night: icons.Snow },
  fog: { day: icons.FogDay, night: icons.FogNight },
  sleet: { day: icons.Sleet, night: icons.Sleet },
  rain_snow: { day: icons.RainDrops, night: icons.RainDrops },
  smoke_particles: { day: icons.SmokeParticles, night: icons.SmokeParticles },
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
  const icon = iconMap[iconCode]?.[hover ? "night" : "day"] ?? icons.ClearDay

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
