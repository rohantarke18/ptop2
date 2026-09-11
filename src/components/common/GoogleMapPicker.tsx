import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Crosshair,
  Compass,
  Search,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GoogleMapPickerProps {
  coordinates?: Coordinates;
  onCoordinatesChange?: (coords: Coordinates) => void;
  addressLabel?: string;
  wardName?: string;
  onAddressDetected?: (address: string, ward?: string) => void;
  className?: string;
  height?: string;
}

// User-provided official Google Maps embed URL for Chhatrapati Sambhajinagar, Maharashtra
export const CS_DEFAULT_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120069.23652854012!2d75.25846909765767!3d19.875310850533477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb9815a369bc63%3A0x712d538b29a2a73e!2sChhatrapati%20Sambhajinagar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1789144501587!5m2!1sen!2sin';

// Default city center coordinates for Chhatrapati Sambhajinagar
export const CS_DEFAULT_COORDS: Coordinates = {
  lat: 19.8753,
  lng: 75.3433,
};

// Popular wards & localities in Chhatrapati Sambhajinagar
const CS_LOCALITY_PRESETS = [
  { name: 'Kranti Chowk', lat: 19.8732, lng: 75.3262, ward: 'Ward 5 (Kranti Chowk)' },
  { name: 'CIDCO N-1 to N-7', lat: 19.8762, lng: 75.3626, ward: 'Ward 8 (CIDCO)' },
  { name: 'Nirala Bazar', lat: 19.8821, lng: 75.3283, ward: 'Ward 3 (Nirala Bazar)' },
  { name: 'TV Centre / HUDCO', lat: 19.9056, lng: 75.3512, ward: 'Ward 11 (HUDCO)' },
  { name: 'Railway Station', lat: 19.8601, lng: 75.3189, ward: 'Ward 2 (Station Road)' },
  { name: 'Chikalthana / Prozone', lat: 19.8711, lng: 75.3789, ward: 'Ward 12 (Chikalthana)' },
  { name: 'Waluj MIDC', lat: 19.8322, lng: 75.2341, ward: 'Ward 15 (Waluj)' },
  { name: 'Begumpura / Panchakki', lat: 19.8943, lng: 75.3168, ward: 'Ward 1 (Begumpura)' },
];

export const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  coordinates = CS_DEFAULT_COORDS,
  onCoordinatesChange,
  addressLabel = 'Chhatrapati Sambhajinagar, Maharashtra',
  wardName = 'Ward 8 (CIDCO)',
  onAddressDetected,
  className = '',
  height = '450px',
}) => {
  const [coords, setCoords] = useState<Coordinates>(coordinates);
  const [zoom, setZoom] = useState<number>(16);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  // Tracks if showing the default official city embed or a specific pinpoint embed
  const [mode, setMode] = useState<'city_embed' | 'pinpoint'>('city_embed');

  // Search query within map
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Keep local coords in sync if parent changes coordinates
  useEffect(() => {
    if (
      coordinates &&
      (Math.abs(coordinates.lat - coords.lat) > 0.0001 ||
        Math.abs(coordinates.lng - coords.lng) > 0.0001)
    ) {
      setCoords(coordinates);
    }
  }, [coordinates?.lat, coordinates?.lng]);

  const updateLocation = useCallback(
    (newCoords: Coordinates, switchMode = true) => {
      const rounded = {
        lat: Number(newCoords.lat.toFixed(6)),
        lng: Number(newCoords.lng.toFixed(6)),
      };
      setCoords(rounded);
      if (switchMode) {
        setMode('pinpoint');
      }
      if (onCoordinatesChange) {
        onCoordinatesChange(rounded);
      }
    },
    [onCoordinatesChange]
  );

  // HTML5 High-Accuracy Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGpsAccuracy(Math.round(position.coords.accuracy));
        updateLocation(newCoords, true);
        setZoom(17);
        setIsLocatingGps(false);

        // Attempt reverse geocoding to auto-fill address
        if (onAddressDetected) {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newCoords.lat}&lon=${newCoords.lng}&zoom=18&addressdetails=1`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data && data.display_name) {
                const parts = [
                  data.address?.road || data.address?.suburb,
                  data.address?.neighbourhood || data.address?.city_district,
                  data.address?.city || data.address?.town || 'Chhatrapati Sambhajinagar',
                ].filter(Boolean);
                const readable = parts.join(', ') || data.display_name;
                onAddressDetected(readable, data.address?.suburb || wardName);
              }
            })
            .catch(() => {
              // Non-blocking fallback
            });
        }
      },
      (error) => {
        setIsLocatingGps(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError('Location permission denied. Please allow GPS access or search below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setGpsError('Location request timed out. Retrying with default precision...');
            break;
          default:
            setGpsError('Unable to retrieve GPS location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Search address or landmark
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGpsError(null);
    try {
      const queryWithCity = searchQuery.toLowerCase().includes('sambhajinagar') ||
        searchQuery.toLowerCase().includes('aurangabad')
        ? searchQuery
        : `${searchQuery}, Chhatrapati Sambhajinagar, Maharashtra`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryWithCity
        )}&limit=1`
      );
      const results = await response.json();
      if (results && results.length > 0) {
        const found = results[0];
        const newCoords: Coordinates = {
          lat: parseFloat(found.lat),
          lng: parseFloat(found.lon),
        };
        updateLocation(newCoords, true);
        setZoom(17);
        if (onAddressDetected) {
          onAddressDetected(found.display_name);
        }
      } else {
        setGpsError(`Location "${searchQuery}" not found. Try entering a landmark like Kranti Chowk, CIDCO, or Nirala Bazar.`);
      }
    } catch {
      setGpsError('Search service currently unreachable. Adjust pin manually using controls below.');
    } finally {
      setIsSearching(false);
    }
  };

  // Fine-tuning nudge buttons (adjust coordinates by ~15-20 meters)
  const nudge = (latDelta: number, lngDelta: number) => {
    updateLocation({
      lat: coords.lat + latDelta,
      lng: coords.lng + lngDelta,
    });
  };

  // Construct iframe embed src
  // Mode 1: Exact embed URL provided by user for Chhatrapati Sambhajinagar
  // Mode 2: Dynamic Google Maps embed centered on the specific coordinate / pin
  const currentEmbedUrl =
    mode === 'city_embed'
      ? CS_DEFAULT_EMBED_URL
      : `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&hl=en&z=${zoom}&output=embed`;

  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;

  return (
    <div
      id="google-maps-embed-container"
      className={`rounded-xl border border-slate-300 bg-white shadow-2xs overflow-hidden ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <span>Google Maps Municipal Location</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Check className="w-2.5 h-2.5" />
                Live Embed Active
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Coordinates: {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
              {gpsAccuracy && ` (±${gpsAccuracy}m precision)`}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Real GPS button */}
          <button
            id="btn-use-gps-location"
            type="button"
            onClick={handleGetLocation}
            disabled={isLocatingGps}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs cursor-pointer transition-colors disabled:opacity-50"
            title="Detect your exact location using device GPS"
          >
            {isLocatingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-blue-100" />
            )}
            <span>{isLocatingGps ? 'Detecting GPS...' : 'Use My GPS Location'}</span>
          </button>

          {/* Reset to Official City Embed */}
          <button
            id="btn-reset-city-embed"
            type="button"
            onClick={() => {
              setMode('city_embed');
              updateLocation(CS_DEFAULT_COORDS, false);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border text-xs font-medium shadow-2xs cursor-pointer transition-colors ${
              mode === 'city_embed'
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
            title="Reset to official Chhatrapati Sambhajinagar Google Map embed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>City Overview</span>
          </button>

          {/* Direct link to open in Google Maps */}
          <a
            id="link-open-in-google-maps"
            href={googleMapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 shadow-2xs transition-colors"
            title="Open location directly in Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* GPS Error Notification if any */}
      {gpsError && (
        <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGpsError(null)}
            className="text-[11px] underline font-medium text-amber-800 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Address / Landmark Quick Search Bar */}
      <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark, or street in Chhatrapati Sambhajinagar..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-md border border-slate-300 bg-white focus:outline-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs cursor-pointer shadow-2xs disabled:opacity-50"
          >
            {isSearching ? 'Finding...' : 'Locate on Map'}
          </button>
        </form>

        {/* Quick Area / Ward Shortcuts for Chhatrapati Sambhajinagar */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5 text-[11px]">
          <span className="text-slate-400 font-medium whitespace-nowrap">Localities:</span>
          {CS_LOCALITY_PRESETS.slice(0, 5).map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                updateLocation({ lat: preset.lat, lng: preset.lng }, true);
                setZoom(16);
                if (onAddressDetected) {
                  onAddressDetected(`${preset.name}, Chhatrapati Sambhajinagar`, preset.ward);
                }
              }}
              className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Google Maps Embed Iframe */}
      <div className="relative w-full bg-slate-100" style={{ height }}>
        <iframe
          id="google-maps-embed-iframe"
          title="Google Maps Municipal Location"
          src={currentEmbedUrl}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full block border-0"
        />

        {/* Overlay Pin indicator badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-md flex items-center gap-2 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          <span>
            {mode === 'city_embed'
              ? 'Chhatrapati Sambhajinagar City Jurisdiction'
              : `Pin: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`}
          </span>
        </div>

        {/* Floating Zoom & Fine-tuning controls */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
          {/* Zoom Buttons */}
          <div className="bg-white/95 backdrop-blur-xs rounded-lg shadow-md border border-slate-200 flex flex-col overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setMode('pinpoint');
                setZoom((z) => Math.min(z + 1, 19));
              }}
              className="p-2 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border-b border-slate-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pinpoint');
                setZoom((z) => Math.max(z - 1, 12));
              }}
              className="p-2 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Nudge D-pad to adjust pin position */}
          <div className="bg-white/95 backdrop-blur-xs rounded-lg p-1.5 shadow-md border border-slate-200 flex flex-col items-center">
            <button
              type="button"
              onClick={() => nudge(0.0003, 0)}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
              title="Move Pin North"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => nudge(0, -0.0003)}
                className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Move Pin West"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 select-none">NUDGE</span>
              <button
                type="button"
                onClick={() => nudge(0, 0.0003)}
                className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Move Pin East"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudge(-0.0003, 0)}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
              title="Move Pin South"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer bar with coordinate adjustments */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-800">Assigned Location:</span>
          <span className="text-slate-600 truncate max-w-xs">{addressLabel}</span>
        </div>

        {/* Lat/Lng Manual Precision inputs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500">Lat:</span>
            <input
              type="number"
              step="0.0001"
              value={coords.lat}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) updateLocation({ lat: val, lng: coords.lng }, true);
              }}
              className="w-20 px-1.5 py-0.5 rounded border border-slate-300 text-xs bg-white text-slate-800 font-mono"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-500">Lng:</span>
            <input
              type="number"
              step="0.0001"
              value={coords.lng}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) updateLocation({ lat: coords.lat, lng: val }, true);
              }}
              className="w-20 px-1.5 py-0.5 rounded border border-slate-300 text-xs bg-white text-slate-800 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapPicker;
