import { createContext } from "react";
import type { UnitSettings } from "../types/weather";
import { useContext } from "react";

export interface UnitContextType {
    units: UnitSettings;
    setUnit: <K extends keyof UnitSettings>(key: K, value: UnitSettings[K]) => void;
    resetUnits: () => void;
}

export const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function useUnits() {
    const context = useContext(UnitContext);
    if(!context) {
        throw new Error("useUnits must be used within a unit provider")
    }
    return context;
}