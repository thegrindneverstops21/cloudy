import {  useEffect, useState, type ReactNode } from "react";
import { DEFAULT_UNITS, type UnitSettings } from "../types/weather";
import { UnitContext } from "../hooks/useUnits";

const STORAGE_KEY = 'weather-app-units';

const VALID_VALUES: { [K in keyof UnitSettings]: UnitSettings[K][] } = {
    temperature: ['C', 'F'],
    windSpeed: ['km/h', 'mph'],
    pressure: ['hPa', 'inHg'],
    visibility: ['km', 'mi'],
    precipitation: ['mm', 'in'],
};

//keep value if it is valid or fallback to default
function validOrDefault<K extends keyof UnitSettings>(key: K, value: unknown): UnitSettings[K]{
    return (VALID_VALUES[key] as unknown[]).includes(value)
        ? (value as UnitSettings[K])
        : DEFAULT_UNITS[key];
}

// prevent outdated cache data from persisting
function sanitizeUnits(raw: Partial<UnitSettings> | null): UnitSettings {
    //fallback to default units if key is not the correct value
    if(!raw) return DEFAULT_UNITS;

    return {
        temperature: validOrDefault('temperature', raw.temperature),
        windSpeed: validOrDefault('windSpeed', raw.windSpeed),
        pressure: validOrDefault('pressure', raw.pressure),
        visibility: validOrDefault('visibility', raw.visibility),
        precipitation: validOrDefault('precipitation', raw.precipitation),
    };
}

export function UnitProvider({ children }: { children: ReactNode }) {
    const [units, setUnits] = useState<UnitSettings>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return sanitizeUnits(saved ? JSON.parse(saved) : null);
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
    }, [units]);

    const setUnit = <K extends keyof UnitSettings>(key: K, value: UnitSettings[K]) => {
        setUnits((prev) => ({ ...prev, [key]: value}));
    };

    const resetUnits = () => setUnits(DEFAULT_UNITS);

    return(
        <UnitContext.Provider value={{ units, setUnit, resetUnits }}>
            {children}
        </UnitContext.Provider>
    );
}

