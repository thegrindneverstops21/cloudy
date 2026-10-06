import { type Location, type CurrentWeather as CurrentWeatherType, type UnitSettings } from '../types/weather';
import { getWeatherInfo } from '../services/weatherCodeMap';
import { convertTemperature, formatValue } from '../services/unitConversions';
import WeatherIcon from './WeatherIcon';
import { MapPin } from 'lucide-react';
import './styles/CurrentWeather.css';
import SaveLocationButton from './SaveLocationButton';

/* interface that represents the location, weather and unit of measurement */
interface CurrentWeatherProps {
    location: Location;
    weather: CurrentWeatherType;
    units: UnitSettings;
}

/* a function component*/
export default function CurrentWeather({ location, weather, units }: CurrentWeatherProps) {
    const info = getWeatherInfo(weather.weatherCode, weather.isDay);
    const temp = convertTemperature(weather.temperature, units.temperature);

    /* a date object that formats the date to localized date */
    const formattedDate = new Date(weather.time).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',                                                                                                       
        weekday: 'long',
    });
    /* date object that formats the time to localized time*/                    
    const formattedTime = new Date(weather.time).toLocaleTimeString('en-ZA', {
        hour: 'numeric',
        minute: '2-digit',
    });

    return (
        <div className="current-weather">
            <div className="current-weather-top">
                <div className="location-pill">
                    {location.isCurrentLocation && <MapPin size={14} />}
                    <span>{location.name}</span>
                </div>
                <SaveLocationButton location={location} />
            </div>


            <div className="current-weather-icon">
                <WeatherIcon icon={info.icon} size={110} />
            </div>

            <div className="current-temp">
                {formatValue(temp)}°{units.temperature}
            </div>

            <div className="current-condition">{info.label}</div>

            <div className="current-datetime">
                <div>{formattedDate}</div>
                <div>{formattedTime}</div>
            </div>
        </div>
    );
}