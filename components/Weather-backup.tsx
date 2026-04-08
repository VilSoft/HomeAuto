"use client"
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import styles from '@/styles/Weather.module.css'
import Axios from './Axios'
import Forecast from './Forecast'

export default function getWeather() {

    const [location, setLocation] = useState<GeolocationPosition | null>(null)
    const [locationError, setLocationError] = useState<any>()
    const [forecastWeatherUrl, setForecastWeatherUrl] = useState<string>('')
    const [gotWeather, setGotWeather] = useState<boolean>(false)
    const [forecast, setForecast] = useState<Array<any>>()

    const gotLocation = (position: GeolocationPosition) => {
        setLocation(position)
    }
    const handleGeoError = (error: any) => {
        setLocationError(error)
    }
    
    // Get user location safely
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            gotLocation,
            handleGeoError
        );
    }, []);

    // Only compute weatherApi inside effect, after location exists
    useEffect(() => {
        if (!location || gotWeather) return; // wait for location

        const weatherApi = `https://api.weather.gov/points/${location.coords.latitude},${location.coords.longitude}`

        Axios(weatherApi, 'get', true)
        .then((res) => {
            setForecastWeatherUrl(res.data.properties.forecast)

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
                .catch((err) => console.error(err))
            }
            setGotWeather(true)
        })
        .catch((err) => {
            console.error(err)
        })

    }, [location, gotWeather, forecastWeatherUrl]) // same deps as before

    return (
        <div className={`container ${styles.weatherContainer}`}>
            <div className="row">
                {forecast && forecast.map((forecastItem, index) => (
                    <div className={`col ${styles.weatherIndividual}`} key={index}>
                        <Forecast day={forecastItem}/>
                    </div>
                ))}
            </div>
        </div>
    )
}
