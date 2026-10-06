import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { searchLocations } from "../services/weatherService";
import { useLocation } from "./LocationContext";
import { type Location } from "../types/weather";
import "./styles/SearchBar.css";

interface SearchBarProps {
  onLocationSelect?: () => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  /* the last query we finished searching for (used to work out "loading") */
  const [resolvedQuery, setResolvedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setActiveLocation } = useLocation();

  /* derived values: worked out during render, no extra state needed */
  const trimmed = query.trim();
  const isSearchable = trimmed.length >= 2;
  const loading = isSearchable && resolvedQuery !== query;
  const visibleResults = isSearchable ? results : [];

  /* debounced search: waits 400ms after typing stops before calling the API */
  useEffect(() => {
    if (!isSearchable) return;

    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      try {
        const raw = await searchLocations(query);
        if (cancelled) return;
        const mapped: Location[] = raw.map(
          (r: {
            latitude: number;
            longitude: number;
            name: string;
            country?: string;
          }) => ({
            id: `${r.latitude}-${r.longitude}`,
            name: r.name,
            country: r.country ?? "",
            latitude: r.latitude,
            longitude: r.longitude,
          }),
        );
        setResults(mapped);
        setOpen(true);
      } catch (err) {
        if (cancelled) return;
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        if (!cancelled) setResolvedQuery(query);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, isSearchable]);

  /* close the dropdown when clicking outside the search bar */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Checks if the element the mouse clicked belongs to the search bar ui
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // A function that adds/saves the location selected by the user
  const handleSelect = (location: Location) => {
    setActiveLocation(location);
    setQuery("");
    setResults([]);
    setOpen(false);
    onLocationSelect?.();
  };

  // A function that clears the search bar when user clears their input
  const handleClear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-bar-input-wrap">
        <Search size={18} className="search-bar-icon" />
        <input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => visibleResults.length > 0 && setOpen(true)}
          className="search-bar-input"
        />
        {query && (
          <button
            className="search-bar-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && (
        <div className="search-bar-dropdown">
          {loading && <div className="search-bar-status">Searching...</div>}
          {!loading && visibleResults.length === 0 && isSearchable && (
            <div className="search-bar-status">No locations found</div>
          )}
          {!loading &&
            visibleResults.map((location) => (
              <button
                key={location.id}
                className="search-bar-result"
                onClick={() => handleSelect(location)}
              >
                <span className="search-bar-result-name">{location.name}</span>
                <span className="search-bar-result-country">
                  {location.country}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
