import { type CurrentWeather, type HourlyWeather, type DailyWeather, type UnitSettings } from '../types/weather';
import { convertWindSpeed, convertPressure, convertVisibility, formatValue } from '../services/unitConversions';
import DetailCard from './DetailCard';
import './styles/DetailGrid.css';

interface DetailsGridProps {
    current: CurrentWeather;
    hourlyNow: HourlyWeather | undefined;
    dailyToday: DailyWeather | undefined;
    units: UnitSettings;
}

export default function DetailsGrid({ current, hourlyNow, dailyToday, units }: DetailsGridProps) {
    const sunrise = dailyToday
        ? new Date(dailyToday.sunrise).toLocaleTimeString('en-ZA', { hour: 'numeric', minute: '2-digit' })
        : '--';
    const sunset = dailyToday
        ? new Date(dailyToday.sunset).toLocaleTimeString('en-ZA', { hour: 'numeric', minute: '2-digit' })
        : '--';

    return (
        <div className="details-grid">
            <DetailCard
                icon="Sun"
                label="UV Index"
                value={hourlyNow ? formatValue(Array.isArray(hourlyNow.uvIndex) ? hourlyNow.uvIndex[0] : hourlyNow.uvIndex) : '--'}
            />
            <DetailCard
                icon="Droplets"
                label="Humidity"
                value={formatValue(current.humidity)}
                unit="%"
            />
            <DetailCard
                icon="Wind"
                label="Wind"
                value={hourlyNow ? formatValue(convertWindSpeed(current.windSpeed, units.windSpeed)) : '--'}
                unit={units.windSpeed}
            />
            <DetailCard
                icon="Thermometer"
                label="Dew Point"
                value={hourlyNow ? formatValue(Array.isArray(hourlyNow.dewPoint) ? hourlyNow.dewPoint[0] : hourlyNow.dewPoint) : '--'}
                unit={`°${units.temperature}`}
            />
            <DetailCard
                icon="Gauge"
                label="Pressure"
                value={formatValue(convertPressure(current.pressure, units.pressure))}
                unit={units.pressure}
            />
            <DetailCard
                icon="Eye"
                label="Visibility"
                value={hourlyNow ? formatValue(convertVisibility(Array.isArray(hourlyNow.visibility) ? hourlyNow.visibility[0] : hourlyNow.visibility, units.visibility), 1) : '--'}
                unit={units.visibility}
            />
            <DetailCard icon="Sunrise" label="Sun">
                <div className="sun-times">
                    <div>
                        <span className="sun-times-label">Rise</span>
                        <span>{sunrise}</span>
                    </div>
                    <div>
                        <span className="sun-times-label">Set</span>
                        <span>{sunset}</span>
                    </div>
                </div>
            </DetailCard>
            <DetailCard
                icon="History"
                label="Feels Like"
                value={formatValue(current.feelsLike)}
                unit={`°${units.temperature}`}
            />
            
        </div>
    );
}