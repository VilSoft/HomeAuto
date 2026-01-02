"use client"
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import styles from '@/styles/Weather.module.css'
import Axios from './Axios'
import Forecast from './Forecast'

function getWeather() {

    const [location, setLocation] = useState<GeolocationPosition>()
    const [locationError, setLocationError] = useState()
    const [forecastWeatherUrl, setForecastWeatherUrl] = useState<string>('')
    const [gotWeather, setGotWeather] = useState<boolean>(false)
    const [forecast, setForecast] = useState<Array<any>>()

    const gotLocation = (position: GeolocationPosition) => {
        setLocation(position)
    }
    const handleGeoError = (error: any) => {
        setLocationError(error)
    }
    
    useEffect(() => {
        if (!location) {
            navigator.geolocation.getCurrentPosition(gotLocation, handleGeoError)
        }
    }, [location])

    // Get user location
    
    let weatherApi = 'https://api.weather.gov/points/' + `${location?.coords.latitude},${location?.coords.longitude}`

    useEffect(() => {
        // Only get weather after coordinates are gotten
        if (!weatherApi.includes('undefined') && !gotWeather) {
            Axios(weatherApi, 'get', true)
            .then((res) => {
                setForecastWeatherUrl(res.data.properties.forecast)
                // Get Hourly once hourlyUrl has been set
                if (forecastWeatherUrl) {
                    Axios(forecastWeatherUrl, 'get', true)
                    .then((res) =>  {
                        let tmpForecast : any = []
                        let tmpSorted : Array<any> = []
                        // Sort data into days from days/nights
                        res.data?.properties.periods.map((p : any) => {
                            if (tmpForecast.length == 2) {
                                tmpSorted.push(tmpForecast)
                                tmpForecast = []
                            }
                            tmpForecast.push(p)
                        })
                        tmpSorted.push(tmpForecast)
                        setForecast(tmpSorted)
                    })
                    setGotWeather(true)
                }
            }).catch((err) => {
                console.error(err)
            })
        }
    }, [weatherApi, gotWeather, forecastWeatherUrl])
   

  return (
    <div className={`container ${styles.weatherContainer}`}>
        <div className="row">
            {
                forecast && forecast?.map((forecast, index) => (
                    <div className={`col ${styles.weatherIndividual}`} key={index}>
                        <Forecast day={forecast}/>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default getWeather