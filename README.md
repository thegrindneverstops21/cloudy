# Cloudy — Weather App

<img src="https://socialify.git.ci/thegrindneverstops21/weather-app/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="weather-app" width="640" height="320" />

A responsive, location-aware weather app built with React, TypeScript, and Vite. Built as Task 3 of the CodeTribe 2026–2027 Work-Integrated Learning Programme (ReactTS track).
<img width="1920" height="916" alt="image" src="https://github.com/user-attachments/assets/7e9e1186-eac3-48ec-81db-37c97f1eca59" />


**Live demo:** [weather-app-ten-xi-16.vercel.app](https://weather-app-ten-xi-16.vercel.app/)

## Features

- **Real-time weather**: current temperature, condition, humidity, wind, pressure, UV index, dew point, visibility, sunrise/sunset
- **Hourly & daily forecasts**: toggle between views; the hourly strip aligns to the current hour and highlights it as "Now"
- **Location detection & search**: auto-detects the user's location (with a graceful empty state if permission is denied), debounced city search via geocoding
- **Multiple saved locations**: bookmark any searched city and switch between them; the current (GPS) location is always available separately
- **Custom units**: Celsius/Fahrenheit, km/h/mph, hPa/inHg, km/mi, mm/in — switching is instant, no refetch
- **Light & dark theme**: persisted across sessions
- **Offline access**: weather data is cached to `localStorage`; cached data displays immediately on revisit while a fresh fetch happens in the background
- **Fully responsive**: tested at 320px, 480px, 768px, 1024px, and 1200px breakpoints
<img width="1919" height="918" alt="image" src="https://github.com/user-attachments/assets/3ef0dc50-d66e-4ce1-8292-f6233df787d1" />

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Routing | react-router-dom v6+ |
| Icons | lucide-react |
| Weather data | [Open-Meteo API](https://open-meteo.com/) (no API key required) |
| Reverse geocoding | [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/) |
| State | React Context (Theme, Location, Units) |
| Persistence | `localStorage` (theme, locations, units, weather cache) |
| Styling | Plain CSS with custom properties (CSS variables) for theming |
<img width="1919" height="918" alt="image" src="https://github.com/user-attachments/assets/99d2375a-874a-4284-b71d-1423cc522895" />

## Getting Started

```bash
# clone the repo
git clone https://github.com/thegrindneverstops21/cloudy.git
cd cloudy

# install dependencies
npm install

# start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Other scripts

```bash
npm run build     # type-check with tsc, then build for production
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Project Structure

```
src/
  components/       # UI components (CurrentWeather, HourlyForecast, DetailCard, etc.)
    styles/         # per-component CSS files
  hooks/            # useWeather, useGeolocation
  services/         # weatherService (API + mappers), unitConversions, weatherCodeMap
  types/            # shared TypeScript types (weather.ts)
  assets/           # images and illustrations
```

Architecture follows a layered approach: **components** stay presentational and receive data via props, **hooks** isolate side effects (API calls, browser APIs), **services** are plain framework-agnostic functions (data mapping, unit conversion, WMO weather code lookups), and **context providers** hold persisted global state (theme, location, units).

## Known Limitations / Roadmap

- **Weather alerts**: push notifications for severe conditions are planned but not yet implemented.
- **Precipitation display**: precipitation probability is fetched from the API and has a unit setting (mm/in), but isn't yet surfaced on a detail card.
- **Action feedback**: saving/removing a location currently happens silently; toast-style confirmations are planned.

## Data Sources

Weather and forecast data is provided free of charge by [Open-Meteo](https://open-meteo.com/), which requires no API key. Reverse geocoding (converting GPS coordinates to a place name) uses [OpenStreetMap's Nominatim service](https://nominatim.openstreetmap.org/).

## Author

**Sam Junior Ndlovu**
CodeTribe 2026–2027 WIL Programme · Tshwane University of Technology, Polokwane
GitHub: [@thegrindneverstops21](https://github.com/thegrindneverstops21)
