import React, {useState} from 'react'
import Image from 'next/image'
import * as icons from '@/icons/weather/animated'
import styles from '@/styles/Weather.module.css'

const weatherApi: string = "https://api.weather.gov/icons/land"
const weatherCodes: Array<string> = ["skc", "few", "sct", "bkn", "ovc", "wind_skc", "wind_few", "wind_sct", "wind_bkn", "wind_ovc", // 9
                                      "snow", "rain_snow", "rain_sleet", "snow_sleet", "fzra", "rain_fzra", "sleet", // 16
                                      "rain", "rain_showers", "rain_showers_hi", "tsra", "tsra_sct", "tsra_hi", "tornado", "hurricane", // 24
                                      "tropical_storm", "dust", "smoke", "haze", "hot", "cold", "blizzard", "fog"] //32

interface CodedWeather {
    code: string;
    icon: any;
}

function forecast(day : any) {
    let dayToShow = day.day

    const getImg: any = (icon: any) => {
        const weatherSize: number = 75
        return <Image src={icon} alt="" width={weatherSize} height={weatherSize}/> 
    }

    const getIcon: any = (iconUrl: string) => {
        if (!iconUrl) return;
        let modUrl = iconUrl.replace(weatherApi, '')
        modUrl = modUrl.substring(modUrl.indexOf('?'), -1)

        modUrl.includes(',') ? modUrl = modUrl.substring(modUrl.indexOf(','), -1) : modUrl

        let icon = modUrl.split('/')
        const iconLocation: number = 2
        const dayNight: number = 1
        const day: string = "day"
        let imgTag;
        switch(icon[iconLocation]) {
            // Clear
            case weatherCodes[0]:
            case weatherCodes[1]:
                icon[dayNight] == day ? imgTag = getImg(icons.ClearDay) : imgTag = getImg(icons.ClearNight)
                break;
            // Partly cloudy
            case weatherCodes[2]:
            case weatherCodes[3]:
            case weatherCodes[5]:
            case weatherCodes[6]:
            case weatherCodes[7]:
            case weatherCodes[8]:
            case weatherCodes[9]:
                icon[dayNight] == day ? imgTag = getImg(icons.PartlyCloudyDay) : imgTag = getImg(icons.PartlyCloudyNight)
                break;
            // Windy
            case weatherCodes[4]:
                imgTag = getImg(icons.Wind)
                break;
            // Snow
            case weatherCodes[10]:
                icon[dayNight] == day ? imgTag = getImg(icons.PartlyCloudyDaySnow) : imgTag = getImg(icons.PartlyCloudyNightSnow)
                break;
            // rain and snow
            case weatherCodes[11]:
                imgTag = getImg(icons.RainDrops)
                break;
            // Sleet
            case weatherCodes[12]:
            case weatherCodes[13]:
            case weatherCodes[16]:
                imgTag = getImg(icons.Sleet)
                break;
            // freezing rain
            case weatherCodes[14]:
            case weatherCodes[15]:
                imgTag = getImg(icons.SmokeParticles)
                break;
            // Rain
            case weatherCodes[17]:
            case weatherCodes[18]:
            case weatherCodes[19]:
                imgTag = getImg(icons.Rain)
                break;
            // Thunder
            case weatherCodes[20]:
            case weatherCodes[21]:
            case weatherCodes[22]:
                icon[dayNight] == day ? imgTag = getImg(icons.ThunderstormsDayRain) : imgTag = getImg(icons.ThunderstormsNightRain)
            // Tornado
            case weatherCodes[23]:
                imgTag = getImg(icons.Tornado)
            // Hurricane
            case weatherCodes[24]:
            case weatherCodes[25]:
                imgTag = getImg(icons.Hurricane)
                break;
            // Dust
            case weatherCodes[26]:
                icon[dayNight] == day ? imgTag = getImg(icons.DustDay) : imgTag = getImg(icons.DustNight)
                break;
            // Smoke
            case weatherCodes[27]:
                imgTag = getImg(icons.Smoke)
                break;
            // Haze
            case weatherCodes[28]:
                icon[dayNight] == day ? imgTag = getImg(icons.HazeDay) : imgTag = getImg(icons.HazeNight)
                break;
            // Hot
            case weatherCodes[29]:
                imgTag = getImg(icons.ThermometerHot)
                break;
            // Cold
            case weatherCodes[30]:
                imgTag = getImg(icons.ThermometerCold)
                break;
            // Blizzard
            case weatherCodes[31]:
                imgTag = getImg(icons.Snow)
                break;
            // Fog
            case weatherCodes[32]:
                icon[dayNight] == day ? imgTag = getImg(icons.FogDay) : imgTag = getImg(icons.FogNight)
                break;
        }

        return imgTag;
    }

    const [showDay, setShowDay] = useState(
        <div>
            {getIcon(dayToShow[0]?.icon)}
            <p>{dayToShow[0]?.shortForecast}</p>
            <p>{dayToShow[0]?.temperature}°</p>
        </div>
    )

    const showNight = (night: boolean) => {
        if (night) {
            setShowDay(
                <div>
                    {getIcon(dayToShow[1]?.icon)}
                    <p>{dayToShow[1]?.shortForecast}</p>
                    <p>{dayToShow[1]?.temperature}°</p>
                </div>
            )
        }
        else {
            setShowDay(
                <div>
                    {getIcon(dayToShow[0]?.icon)}
                    <p>{dayToShow[0]?.shortForecast}</p>
                    <p>{dayToShow[0]?.temperature}°</p>
                </div>
            )
        }
    }

    return (
        <div className="container">
            <div className={`row ${styles.weatherRow}`}>
                <p>{dayToShow[0]?.name}</p>
                <div className="col-sm" key={dayToShow[0]?.name} onMouseOver={() => showNight(true)} onMouseOut={() => showNight(false)}>
                    {showDay}
                </div>
            </div>
        </div>
    )
}

export default forecast