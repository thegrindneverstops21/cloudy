import { useEffect, useState } from "react";
import type {
  Location,
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
} from "../types/weather";
import {
  fetchWeatherData,
  mapCurrentWeather,
  mapDailyWeather,
  mapHourlyWeather,
} from "../services/weatherService";

interface WeatherState {
  current: CurrentWeather | null;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
}

interface CachedWeather {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  fetchedAt: number;
}

const CACHE_PREFIX = "weather-app-cache";
const CACHE_AGE_MAX = 30 * 60 * 1000;

// return this if there's no weather data available, or if the location is null
const EMPTY_STATE: WeatherState = {
  current: null,
  hourly: [],
  daily: [],
  loading: true,
  error: null,
  isFromCache: false,
};

function getCacheKey(lat: number, lon: number) {
  return `${CACHE_PREFIX}${lat.toFixed(2)}-${lon.toFixed(2)}`;
}

function readCache(lat: number, lon: number): CachedWeather | null {
  try {
    const raw = localStorage.getItem(getCacheKey(lat, lon));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(
  lat: number,
  lon: number,
  data: Omit<CachedWeather, "fetchedAt">,
) {
  const payload: CachedWeather = { ...data, fetchedAt: Date.now() };
  localStorage.setItem(getCacheKey(lat, lon), JSON.stringify(payload));
}

export function useWeather(location: Location | null) {
  const lat = location?.latitude;
  const lon = location?.longitude;

  const [state, setState] = useState<WeatherState>({
    current: null,
    hourly: [],
    daily: [],
    loading: true,
    error: null,
    isFromCache: false,
  });

  useEffect(() => {
    if (lat === undefined || lon === undefined) return;

    const latitude = lat;
    const longitude = lon;
    let cancelled = false;

    async function load() {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      const cached = readCache(latitude, longitude);
      const cacheIsFresh =
        cached && Date.now() - cached.fetchedAt < CACHE_AGE_MAX;
      if (cached && !cancelled) {
        setState({
          current: cached.current,
          hourly: cached.hourly,
          daily: cached.daily,
          loading: false,
          error: null,
          isFromCache: true,
        });
      }

      try {
        const raw = await fetchWeatherData(latitude, longitude);
        if (cancelled) return;

        const current = mapCurrentWeather(raw);
        const hourly = mapHourlyWeather(raw);
        const daily = mapDailyWeather(raw);

        writeCache(latitude, longitude, { current, hourly, daily });

        if (cancelled) return;
        setState({
          current,
          hourly,
          daily,
          loading: false,
          error: null,
          isFromCache: false,
        });
      } catch (err) {
        if (cancelled) return;

        if (cached) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: cacheIsFresh
              ? null
              : "Showing cached data, failed to refresh",
          }));
        } else {
          setState({
            current: null,
            hourly: [],
            daily: [],
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Failed to load weather data",
            isFromCache: false,
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return location ? state: EMPTY_STATE;
}
