"use client"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/redux/store"

export default function Clock() {
  const timezone = useAppSelector(state => state.locationReducer.timezone)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).formatToParts(now)

  const weekday = date.find(p => p.type === "weekday")?.value ?? ""
  const month = date.find(p => p.type === "month")?.value ?? ""
  const day = date.find(p => p.type === "day")?.value ?? ""
  const year = date.find(p => p.type === "year")?.value ?? ""
  const dateStr = `${weekday} ${month} ${day}, ${year}`

  const timeStr = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now)

  return (
    <div className="text-right">
      <p className="text-sm text-foreground-muted">{dateStr}</p>
      <p className="text-sm font-mono text-foreground-muted">{timeStr}</p>
    </div>
  )
}
