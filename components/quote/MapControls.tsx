"use client";

import { useEffect, useState, type ReactNode } from "react";

interface MapControlsProps {
  map: google.maps.Map | null;
  panMode: boolean;
  onPanModeChange: (next: boolean) => void;
}

const btnClass =
  "flex h-9 w-9 items-center justify-center text-asphalt-800 transition-colors hover:bg-accent-100 hover:text-asphalt-950 disabled:cursor-not-allowed disabled:opacity-40";

export function MapControls({ map, panMode, onPanModeChange }: MapControlsProps) {
  const [zoom, setZoom] = useState<number | null>(null);

  useEffect(() => {
    if (!map) return;
    const syncZoom = () => setZoom(map.getZoom() ?? null);
    syncZoom();
    const listener = map.addListener("zoom_changed", syncZoom);
    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  const minZoom = typeof map?.get("minZoom") === "number" ? (map.get("minZoom") as number) : 0;
  const maxZoom = typeof map?.get("maxZoom") === "number" ? (map.get("maxZoom") as number) : 22;
  const atMin = zoom != null && zoom <= minZoom;
  const atMax = zoom != null && zoom >= maxZoom;

  function zoomBy(delta: number) {
    if (!map) return;
    const current = map.getZoom();
    if (current == null) return;
    map.setZoom(current + delta);
  }

  return (
    <div
      className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-md border border-asphalt-200 bg-paper-raised shadow-sm"
      role="group"
      aria-label="Map controls"
    >
      <button
        type="button"
        className={btnClass}
        aria-label="Zoom in"
        disabled={!map || atMax}
        onClick={() => zoomBy(1)}
      >
        <ControlIcon>
          <path d="M8 3.5v9M3.5 8h9" />
        </ControlIcon>
      </button>
      <button
        type="button"
        className={`${btnClass} border-t border-asphalt-200`}
        aria-label="Zoom out"
        disabled={!map || atMin}
        onClick={() => zoomBy(-1)}
      >
        <ControlIcon>
          <path d="M3.5 8h9" />
        </ControlIcon>
      </button>
      <button
        type="button"
        className={`${btnClass} border-t border-asphalt-200 ${
          panMode ? "bg-asphalt-950 text-paper hover:bg-asphalt-800 hover:text-paper" : ""
        }`}
        aria-label="Move map"
        aria-pressed={panMode}
        disabled={!map}
        onClick={() => onPanModeChange(!panMode)}
      >
        <ControlIcon>
          <path d="M8 2.25v11.5M2.25 8h11.5" />
          <path d="M8 2.25 5.75 4.5M8 2.25 10.25 4.5M8 13.75 5.75 11.5M8 13.75 10.25 11.5M2.25 8 4.5 5.75M2.25 8 4.5 10.25M13.75 8 11.5 5.75M13.75 8 11.5 10.25" />
        </ControlIcon>
      </button>
    </div>
  );
}

function ControlIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
