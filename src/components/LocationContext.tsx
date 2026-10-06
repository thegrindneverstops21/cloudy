import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type ReactNode } from 'react';
import { type Location } from '../types/weather';
import { useGeolocation } from '../hooks/useGeolocation';
import { reverseGeocode } from '../services/weatherService';

/* string keys for local storage to avoid rendundacy */
const STORAGE_KEY = 'weather-app-location'; {/* stored location data*/}
const ACTIVE_KEY = 'weather-app-active-location'; {/* current location*/}

/* shape of the location */
interface LocationContextType {
    currentLocation: Location | null;
    savedLocations: Location[];
    activeLocation: Location | null;
    setActiveLocation: (location: Location) => void;
    addLocation: (location: Location) => void;
    removeLocation: (id: string) => void;
    geolocationLoading: boolean;
    permissionDenied: boolean;
}

/* context that takes the shape of Location context & returns the context object or undefined if it is missing */
const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    /* read geo-location using custom hook */
    const { latitude, longitude, loading, permissionDenied } = useGeolocation();
    /* current location */
    const [place, setPlace] = useState<{name: string, country: string} | null>(null);
    /* saved location from local storage*/
    const [savedLocations, setSavedLocations] = useState<Location[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ?  JSON.parse(saved) : [];
    });
    /* active location from local storage */
    const [activeLocationState, setActiveLocationState] = useState<Location | null>(() => {
        const saved = localStorage.getItem(ACTIVE_KEY);
        return saved ? JSON.parse(saved) : null;
    });

    const currentLocation = useMemo<Location | null>(() => {
        if(latitude === null || longitude === null) return null;

        return {
            id: 'current-location',
            name: place?.name ?? 'current-location',
            country: place?.country ?? '',
            latitude,
            longitude,
            isCurrentLocation: true,
        };
    }, [latitude, longitude, place]);

    //if nothing is picked, follow live location
    const activeLocation = useMemo<Location | null>(() => {
        if(!activeLocationState || activeLocationState.id === 'current-location'){
            return currentLocation ?? activeLocationState;
        }
        return activeLocationState;
    }, [activeLocationState, currentLocation]);
    /* provides and stores location if coordinates are available*/
    useEffect(() => {
        if (latitude === null || longitude === null) return;
        let cancelled = false;
        reverseGeocode(latitude, longitude).then(({name, country}) => {
            if(!cancelled) setPlace({name, country})
        }).catch((err) => {
                console.error("reverse geocoding failed", err);
        });
        return () => {
            cancelled = true;
        };
    }, [latitude, longitude]);

    /* persist location as saved location to local storage */
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
    }, [savedLocations]);
    /* persist location as active location to local storage */
    useEffect(() => {
        if (activeLocation) {
            localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeLocation));
        }
    }, [activeLocation]);
    /* a function switches to active location */
    const setActiveLocation = (location: Location) => {
        setActiveLocationState(location);
    };
    /* a function helps add new location to saved locations */
    const addLocation = (location: Location) => {
    setSavedLocations((prev) => {
        if(prev.some((l) => l.id === location.id)) return prev;
        return [...prev, location];
    });
    };
    /* a function that helps delete a saved location by it's id */
    const removeLocation = (id: string) => {
        setSavedLocations((prev) => prev.filter((l) => l.id !== id));
    };

    return (
        <LocationContext.Provider value={{
            currentLocation,
            savedLocations,
            activeLocation,
            setActiveLocation,
            addLocation,
            removeLocation,
            geolocationLoading: loading,
            permissionDenied,
        }}>
            {children}
        </LocationContext.Provider>
    );
}

/* custom hook */
export function useLocation() {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}