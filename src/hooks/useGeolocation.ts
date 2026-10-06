import { useState, useEffect } from "react";

/* shape of my custom use hook to track geolocation status */
interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

// Check if browser can do geolocation
const isGeolocationSupported = () =>
  typeof navigator !== "undefined" && !!navigator.geolocation;

/* start of custom hook, setting the state of variables to null & loading to true while requesting location data */
export function useGeolocation() {
  //check if geolocation works and provide appropiate message if otherwise
  const [state, setState] = useState<GeolocationState>(() =>
    isGeolocationSupported()
      ? {
          latitude: null,
          longitude: null,
          loading: true,
          error: null,
          permissionDenied: false,
        }
      : {
          latitude: null,
          longitude: null,
          loading: false,
          error: "Geolocation is not supported in your browser",
          permissionDenied: false,
        },
  );

  /* ask browser for user location */
  useEffect(() => {
    if (!isGeolocationSupported()) return;
    
    /* callback function if the browser successfully obtains the user's current location */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },

      /* error callback if browser fails to retrieve user location */
      (error) => {
        setState({
          latitude: null,
          longitude: null,
          loading: false,
          error: error.message,
          permissionDenied: error.code === error.PERMISSION_DENIED,
        });
      },

      /* control how browser should attempt to fetch user location */
      {
        /* restricts API from requesting precise location to improve performance */
        enableHighAccuracy: false,
        /* sets a 10s timeout */
        timeout: 10000,
        /* cached version of location that is 5 minutes old */
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, []);
  return state;
}
