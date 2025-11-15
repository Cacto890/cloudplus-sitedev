"use client"

import { useState } from "react"
import { Tiny5Button } from "@/components/ui/tiny5-button"
import Link from "next/link"
import useSWR from "swr"
import { useMusicPlayer } from "@/components/music-player-provider"

interface WeatherData {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    time: string
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
  }
}

interface GeocodingResult {
  results?: Array<{
    name: string
    latitude: number
    longitude: number
    country: string
    admin1?: string
  }>
}

const weatherCodeToSymbol = (code: number): string => {
  if (code === 0) return "\\O/"
  if (code <= 3) return "( )"
  if (code <= 48) return "≡≡≡"
  if (code <= 67) return "┆┆┆"
  if (code <= 77) return "***"
  if (code <= 82) return "┆•┆"
  if (code <= 86) return "*•*"
  if (code <= 99) return "⚡︎"
  return "(?)"
}

const weatherCodeToDescription = (code: number): string => {
  if (code === 0) return "CLEAR SKY"
  if (code <= 3) return "PARTLY CLOUDY"
  if (code <= 48) return "FOG"
  if (code <= 67) return "RAIN"
  if (code <= 77) return "SNOW"
  if (code <= 82) return "RAIN SHOWERS"
  if (code <= 86) return "SNOW SHOWERS"
  if (code <= 99) return "THUNDERSTORM"
  return "UNKNOWN"
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

const VerticalText = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center md:hidden">
    {text.split("").map((char, i) => (
      <span key={i}>{char === " " ? "." : char}</span>
    ))}
  </div>
)

export default function WeatherPage() {
  const { isAllRed } = useMusicPlayer()
  const [location, setLocation] = useState("")
  const [searchedLocation, setSearchedLocation] = useState<string | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCelsius, setIsCelsius] = useState(false)

  const { data: weatherData, error: weatherError } = useSWR<WeatherData>(
    coords
      ? `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${isCelsius ? 'celsius' : 'fahrenheit'}&wind_speed_unit=mph&timezone=auto`
      : null,
    fetcher
  )

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!location.trim()) {
      setError("ENTER A LOCATION")
      return
    }

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
      )
      const geoData: GeocodingResult = await geoRes.json()

      if (!geoData.results || geoData.results.length === 0) {
        setError("LOCATION NOT FOUND")
        return
      }

      const result = geoData.results[0]
      setCoords({ lat: result.latitude, lon: result.longitude })
      setSearchedLocation(`${result.name}, ${result.country}`)
    } catch (err) {
      setError("SEARCH FAILED")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const textColor = isAllRed ? 'text-red-500' : 'text-white'
  const borderColor = isAllRed ? 'border-red-500/30' : 'border-white/30'
  const borderColorHover = isAllRed ? 'hover:border-red-500/50' : 'hover:border-white/50'
  const inputBorderColor = isAllRed ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.5)'

  return (
    <main className="min-h-screen bg-black relative flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 z-10">
        <Link href="/code">
          <Tiny5Button className={`${textColor} hover:text-red-500 hidden md:block`}>BACK</Tiny5Button>
          <div className="md:hidden">
            <Tiny5Button className={`${textColor} hover:text-red-500`}>
              <VerticalText text="BACK" />
            </Tiny5Button>
          </div>
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-10">
        <button
          onClick={() => setIsCelsius(!isCelsius)}
          className={`${textColor} opacity-50 hover:opacity-100 transition-opacity px-4 py-2 border ${borderColor} ${borderColorHover} hidden md:block`}
          style={{ fontFamily: "var(--font-tiny5)" }}
        >
          {isCelsius ? "°C" : "°F"}
        </button>
        <button
          onClick={() => setIsCelsius(!isCelsius)}
          className={`md:hidden ${textColor} opacity-50 hover:opacity-100 transition-opacity px-2 py-4 border ${borderColor} ${borderColorHover}`}
          style={{ fontFamily: "var(--font-tiny5)" }}
        >
          <VerticalText text={isCelsius ? "°C" : "°F"} />
        </button>
      </div>

      <div className="flex flex-col gap-8 items-center z-10 max-w-4xl w-full">
        <div className={`${textColor} opacity-50 text-2xl hidden md:block`} style={{ fontFamily: "var(--font-tiny5)" }}>
          WEATHER 1300
        </div>
        <div className={`md:hidden ${textColor} opacity-50 text-2xl`} style={{ fontFamily: "var(--font-tiny5)" }}>
          <VerticalText text="WEATHER 1300" />
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 items-center w-full max-w-md">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ENTER CITY NAME..."
            className={`flex-1 bg-transparent border-none ${textColor} px-4 py-2 focus:outline-none transition-opacity opacity-50 focus:opacity-100`}
            style={{
              fontFamily: "var(--font-tiny5)",
              borderBottom: `1px solid ${inputBorderColor}`,
            }}
            autoFocus
          />
          <Tiny5Button type="submit" className={`${textColor} hover:text-red-500`}>
            SEARCH
          </Tiny5Button>
        </form>

        {error && (
          <div className="text-red-500 opacity-50" style={{ fontFamily: "var(--font-tiny5)" }}>
            {error}
          </div>
        )}

        {weatherError && (
          <div className="text-red-500 opacity-50" style={{ fontFamily: "var(--font-tiny5)" }}>
            FAILED TO LOAD WEATHER
          </div>
        )}

        {weatherData && searchedLocation && (
          <div className="flex flex-col gap-8 w-full">
            {/* Current Weather */}
            <div className="flex flex-col gap-4 items-center">
              <div
                className={`${textColor} opacity-50 text-lg`}
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                {searchedLocation}
              </div>
              <div 
                className={`${textColor} opacity-50 text-6xl`}
                style={{ fontFamily: "var(--font-tiny5)", letterSpacing: "0.1em" }}
              >
                {weatherCodeToSymbol(weatherData.current.weather_code)}
              </div>
              <div
                className={`${textColor} opacity-50 text-4xl`}
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                {Math.round(weatherData.current.temperature_2m)}°{isCelsius ? "C" : "F"}
              </div>
              <div
                className={`${textColor} opacity-50 hidden md:block`}
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                {weatherCodeToDescription(weatherData.current.weather_code)}
              </div>
              <div className={`md:hidden ${textColor} opacity-50`} style={{ fontFamily: "var(--font-tiny5)" }}>
                <VerticalText text={weatherCodeToDescription(weatherData.current.weather_code)} />
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
              <div
                className={`flex flex-col gap-2 items-center p-4 border ${isAllRed ? 'border-red-500/50' : borderColor.replace('/30', '/10')}`}
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                <div className={`${textColor} opacity-30 text-sm hidden md:block`}>HUMIDITY</div>
                <div className={`md:hidden ${textColor} opacity-30 text-sm`}>
                  <VerticalText text="HUMIDITY" />
                </div>
                <div className={`${textColor} opacity-50`}>
                  {weatherData.current.relative_humidity_2m}%
                </div>
              </div>
              <div
                className={`flex flex-col gap-2 items-center p-4 border ${isAllRed ? 'border-red-500/50' : borderColor.replace('/30', '/10')}`}
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                <div className={`${textColor} opacity-30 text-sm hidden md:block`}>WIND</div>
                <div className={`md:hidden ${textColor} opacity-30 text-sm`}>
                  <VerticalText text="WIND" />
                </div>
                <div className={`${textColor} opacity-50`}>
                  {Math.round(weatherData.current.wind_speed_10m)} MPH
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="flex flex-col gap-4 w-full">
              <div
                className={`${textColor} opacity-30 text-center hidden md:block`}
                style={{ fontFamily: "var(--font-tiny5)" }}
              >
                7-DAY FORECAST
              </div>
              <div className={`md:hidden ${textColor} opacity-30 mx-auto`} style={{ fontFamily: "var(--font-tiny5)" }}>
                <VerticalText text="7-DAY FORECAST" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherData.daily.time.slice(0, 7).map((date, index) => (
                  <div
                    key={date}
                    className={`flex flex-col gap-2 items-center p-4 border ${isAllRed ? 'border-red-500/50' : borderColor.replace('/30', '/10')} ${!isAllRed && borderColorHover.replace('/50', '/30')} transition-colors`}
                    style={{ fontFamily: "var(--font-tiny5)" }}
                  >
                    <div className={`${textColor} opacity-30 text-xs`}>
                      {formatDate(date)}
                    </div>
                    <div className={`${textColor} opacity-50 text-2xl`} style={{ letterSpacing: "0.1em" }}>
                      {weatherCodeToSymbol(weatherData.daily.weather_code[index])}
                    </div>
                    <div className={`${textColor} opacity-50 text-sm`}>
                      {Math.round(weatherData.daily.temperature_2m_max[index])}°{isCelsius ? "C" : "F"}
                    </div>
                    <div className={`${textColor} opacity-30 text-xs`}>
                      {Math.round(weatherData.daily.temperature_2m_min[index])}°{isCelsius ? "C" : "F"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!weatherData && !error && !weatherError && coords === null && (
          <div className={`${textColor} opacity-30`} style={{ fontFamily: "var(--font-tiny5)" }}>
            SEARCH FOR A CITY TO SEE WEATHER
          </div>
        )}
      </div>
    </main>
  )
}
