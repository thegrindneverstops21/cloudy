import {
    Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle,
    CloudRain, CloudRainWind, CloudSnow, CloudLightning, HelpCircle,
    Droplets, Thermometer, Gauge, Eye, Sunrise, History, Wind,
    type LucideIcon,
} from 'lucide-react';

/* table for weather icons */
const ICON_MAP: Record<string, LucideIcon> = {
    Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle,
    CloudRain, CloudRainWind, CloudSnow, CloudLightning,
    Droplets, Thermometer, Gauge, Eye, Sunrise, History, Wind
};

/*interface that defines the shape of the Icon properties */
interface WeatherIconProps {
    icon: string;
    size?: number;
    className?: string;
}

/* destructure props, looks for item in the table, displays help circle if no items are found */
export default function WeatherIcon({ icon, size = 24, className }: WeatherIconProps) {
    const Icon = ICON_MAP[icon] || HelpCircle;
    return <Icon size={size} className={className} />;
}