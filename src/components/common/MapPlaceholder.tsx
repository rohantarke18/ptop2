import React, { useState } from 'react';
import { MapPin, Navigation, Crosshair, Layers, Compass } from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapPlaceholderProps {
  coordinates?: Coordinates;
  onCoordinatesChange?: (coords: Coordinates) => void;
  addressLabel?: string;
  wardName?: string;
  className?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  coordinates = { lat: 18.5204, lng: 73.8567 }, // Pune default center
  onCoordinatesChange,
  addressLabel = 'Selected municipal location pin',
  wardName = 'Ward 14 (Shivajinagar)',
  className = '',
}) => {
  const [currentCoords, setCurrentCoords] = useState<Coordinates>(coordinates);
  const [isSimulatingGps, setIsSimulatingGps] = useState(false);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map pixel offset to slight coordinate delta around base
    const latDelta = ((rect.height / 2 - y) / rect.height) * 0.04;
    const lngDelta = ((x - rect.width / 2) / rect.width) * 0.04;

    const newCoords = {
      lat: Number((18.5204 + latDelta).toFixed(5)),
      lng: Number((73.8567 + lngDelta).toFixed(5)),
    };

    setCurrentCoords(newCoords);
    if (onCoordinatesChange) {
      onCoordinatesChange(newCoords);
    }
  };

  const handleLocateMe = () => {
    setIsSimulatingGps(true);
    setTimeout(() => {
      const simulated = { lat: 18.5314, lng: 73.8293 };
      setCurrentCoords(simulated);
      if (onCoordinatesChange) {
        onCoordinatesChange(simulated);
      }
      setIsSimulatingGps(false);
    }, 400);
  };

  return (
    <div className={`rounded-lg border border-slate-300 bg-slate-50 overflow-hidden ${className}`}>
      {/* Top control bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>GIS Ward Cadastral Layer</span>
          <span className="text-[11px] text-slate-400 font-mono">
            ({currentCoords.lat}, {currentCoords.lng})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isSimulatingGps}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
          >
            <Crosshair className={`w-3 h-3 text-blue-600 ${isSimulatingGps ? 'animate-spin' : ''}`} />
            <span>Use My Location</span>
          </button>
        </div>
      </div>

      {/* Schematic Map Stage */}
      <div
        onClick={handleMapClick}
        className="relative h-56 w-full cursor-crosshair select-none bg-[#f1f5f9] overflow-hidden"
        title="Click on the schematic to place location pin"
      >
        {/* Subtle grid pattern resembling municipal GIS map */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f1f5f9 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {/* Schematic road corridors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <path d="M 0 90 Q 180 120 400 60 T 800 110" stroke="#cbd5e1" strokeWidth="8" fill="none" />
          <path d="M 0 90 Q 180 120 400 60 T 800 110" stroke="#f8fafc" strokeWidth="6" fill="none" />
          <path d="M 140 0 L 190 240" stroke="#cbd5e1" strokeWidth="5" fill="none" />
          <path d="M 320 0 L 290 240" stroke="#cbd5e1" strokeWidth="5" fill="none" />
          <path d="M 0 170 Q 250 160 550 210" stroke="#e2e8f0" strokeWidth="4" fill="none" />
          {/* Ward boundary outline */}
          <polygon
            points="60,30 280,20 380,140 310,210 110,190"
            fill="rgba(37, 99, 235, 0.04)"
            stroke="#93c5fd"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Ward label */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[11px] font-medium text-slate-700 border border-slate-200 pointer-events-none shadow-xs">
          📍 {wardName}
        </div>

        {/* Pin marker positioned at center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none flex flex-col items-center">
          <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg border-2 border-white ring-2 ring-blue-600/30 animate-bounce">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="w-2.5 h-1 bg-black/30 rounded-full mt-0.5 filter blur-[1px]" />
        </div>

        {/* Help label overlay */}
        <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white px-2 py-1 rounded text-[10px] pointer-events-none">
          Click anywhere to reposition pin
        </div>
      </div>

      {/* Footer information */}
      <div className="px-3 py-2 bg-white border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="truncate mr-2">
          <span className="font-semibold text-slate-800">Pin Location:</span>{' '}
          <span className="truncate">{addressLabel}</span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">
          OpenStreetMap / GIS Bridge Ready
        </span>
      </div>
    </div>
  );
};
