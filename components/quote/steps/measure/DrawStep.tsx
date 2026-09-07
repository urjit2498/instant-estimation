"use client";

import { GoogleMap, Marker, Polygon, Polyline } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";
import { DrawingToolbar } from "@/components/quote/DrawingToolbar";
import { MapControls } from "@/components/quote/MapControls";
import { StepActions } from "@/components/quote/StepActions";
import { SegmentLengthLabels } from "@/components/quote/SegmentLengthLabels";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";
import { computeAreaSqFt, computeLengthFt } from "@/lib/geo/polygon";
import { DRAWING_PEN_CURSOR } from "@/lib/map/drawingCursor";
import type { LatLngPoint, Measurement, ShapeType } from "@/types/quote";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const MAP_OPTIONS: google.maps.MapOptions = {
  mapTypeId: "satellite",
  disableDefaultUI: true,
  cameraControl: false,
  zoomControl: false,
  tilt: 0,
  // One-finger drag pans on touch (Google's "auto" otherwise shows a "use two fingers" overlay).
  gestureHandling: "greedy",
};

interface DrawStepProps {
  /** Required — parent only mounts this step after an address location is resolved. */
  center: LatLngPoint;
  onBack: () => void;
  onComplete: (measurement: Measurement) => void;
}

export function DrawStep({ center, onBack, onComplete }: DrawStepProps) {
  const { isLoaded, loadError, apiKeyConfigured } = useGoogleMapsLoader();
  const [shapeType, setShapeType] = useState<ShapeType>("polygon");
  const [path, setPath] = useState<LatLngPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(true);
  const [panMode, setPanMode] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const placingPoints = isDrawing && !panMode;
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      ...MAP_OPTIONS,
      ...(panMode
        ? { draggableCursor: "grab", draggingCursor: "grabbing" }
        : placingPoints
          ? { draggableCursor: DRAWING_PEN_CURSOR, draggingCursor: DRAWING_PEN_CURSOR }
          : {}),
    }),
    [panMode, placingPoints]
  );

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!placingPoints || !e.latLng) return;
      setPath((prev) => [...prev, { lat: e.latLng!.lat(), lng: e.latLng!.lng() }]);
    },
    [placingPoints]
  );

  const updatePointAt = useCallback((index: number, latLng: google.maps.LatLng) => {
    setPath((prev) => {
      const next = [...prev];
      next[index] = { lat: latLng.lat(), lng: latLng.lng() };
      return next;
    });
  }, []);

  function syncPathFromOverlay(overlay: google.maps.Polygon | google.maps.Polyline) {
    const newPath = overlay
      .getPath()
      .getArray()
      .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    setPath(newPath);
  }

  function undoLastPoint() {
    setPath((prev) => prev.slice(0, -1));
  }

  function clearShape() {
    setPath([]);
    setIsDrawing(true);
  }

  function switchShapeType(next: ShapeType) {
    setShapeType(next);
    clearShape();
  }

  const minPoints = shapeType === "polygon" ? 3 : 2;
  const canFinish = path.length >= minPoints;
  const measurement: Measurement | null = canFinish
    ? shapeType === "polygon"
      ? { method: "draw", shapeType, path, areaSqFt: computeAreaSqFt(path) }
      : { method: "draw", shapeType, path, lengthFt: computeLengthFt(path) }
    : null;
  const measurementLabel = measurement
    ? measurement.shapeType === "polygon"
      ? `~${Math.round(measurement.areaSqFt ?? 0).toLocaleString()} sq ft`
      : `~${Math.round(measurement.lengthFt ?? 0).toLocaleString()} ft`
    : null;

  if (!apiKeyConfigured) {
    return (
      <div className="rounded-lg border border-accent bg-accent-100 p-4 text-sm text-asphalt-950">
        The map can&apos;t load yet — add <code className="font-mono text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
        to <code className="font-mono text-xs">.env.local</code>.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-error bg-error-bg p-4 text-sm text-asphalt-950">
        Couldn&apos;t load Google Maps. Check your API key and enabled APIs (Maps JavaScript API,
        Geocoding API).
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DrawingToolbar
        shapeType={shapeType}
        onShapeTypeChange={switchShapeType}
        pointCount={path.length}
        canFinish={canFinish}
        isDrawing={isDrawing}
        onUndo={undoLastPoint}
        onClear={clearShape}
        onToggleDrawing={() => setIsDrawing((prev) => !prev)}
        finishLabel="Finish"
        resumeLabel="Resume"
      />

      <div
        className={`relative -mx-4 h-80 w-[calc(100%+2rem)] overflow-hidden rounded-lg border border-asphalt-200 sm:-mx-6 sm:h-96 sm:w-[calc(100%+3rem)] lg:h-[32rem] xl:h-[40rem]${placingPoints ? " map-drawing-pen-cursor" : ""}`}
      >
        {isLoaded ? (
          <>
            {placingPoints && (
              <style>{`
                .map-drawing-pen-cursor .gm-style canvas {
                  cursor: ${DRAWING_PEN_CURSOR} !important;
                }
              `}</style>
            )}
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={center}
              zoom={20}
              onLoad={setMap}
              onUnmount={() => setMap(null)}
              onClick={handleMapClick}
              options={mapOptions}
            >
              {shapeType === "polygon" && path.length > 0 && (
                <Polygon
                  path={path}
                  editable={!isDrawing}
                  draggable={false}
                  options={{
                    fillColor: "#17181c",
                    fillOpacity: isDrawing ? 0.12 : 0.25,
                    strokeColor: "#ff4b1f",
                    strokeOpacity: isDrawing ? 0.6 : 1,
                    strokeWeight: 2,
                  }}
                  onEdit={(p) => syncPathFromOverlay(p)}
                />
              )}
              {shapeType === "line" && path.length > 0 && (
                <Polyline
                  path={path}
                  editable={!isDrawing}
                  onLoad={(p) => {
                    // Polyline has no onEdit prop (unlike Polygon), so wire the same
                    // insert/set/remove path listeners manually.
                    const mvcPath = p.getPath();
                    ["insert_at", "set_at", "remove_at"].forEach((eventName) => {
                      google.maps.event.addListener(mvcPath, eventName, () =>
                        syncPathFromOverlay(p)
                      );
                    });
                  }}
                  options={{
                    strokeColor: "#ff4b1f",
                    strokeOpacity: isDrawing ? 0.6 : 1,
                    strokeWeight: 3,
                  }}
                />
              )}
              {/* Draggable handles while placing points — lets users fix a misplaced click
                  without undoing and re-drawing the whole shape. */}
              {isDrawing &&
                path.map((point, i) => (
                  <Marker
                    key={i}
                    position={point}
                    draggable={!panMode}
                    onDrag={(e) => e.latLng && updatePointAt(i, e.latLng)}
                    onDragEnd={(e) => e.latLng && updatePointAt(i, e.latLng)}
                    options={{
                      cursor: "grab",
                      icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 6,
                        fillColor: "#f8fafc",
                        fillOpacity: 1,
                        strokeColor: "#17181c",
                        strokeWeight: 2,
                      },
                      zIndex: 999,
                    }}
                  />
                ))}
              {path.length >= 2 && (
                <SegmentLengthLabels
                  path={path}
                  closeLoop={shapeType === "polygon" && path.length >= 3}
                />
              )}
            </GoogleMap>

            <MapControls map={map} panMode={panMode} onPanModeChange={setPanMode} />

            <div className="pointer-events-none absolute left-3 top-3 flex max-w-[calc(100%-4.5rem)] items-center gap-2 rounded-full bg-paper-raised/95 px-3 py-1.5 text-xs font-medium text-asphalt-950 shadow-md ring-1 ring-asphalt-200">
              {panMode ? (
                <>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>Drag to move</span>
                </>
              ) : isDrawing ? (
                <>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-700" />
                  </span>
                  <span>
                    {path.length === 0
                      ? "Tap to place a point"
                      : `${path.length} point${path.length === 1 ? "" : "s"} · drag to adjust`}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-asphalt-300" />
                  <span>Drag a point to adjust</span>
                </>
              )}
              {measurementLabel && (
                <span className="ml-1 rounded-full bg-asphalt-950 px-2 py-0.5 font-mono text-white">
                  {measurementLabel}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-asphalt-300">
            Loading map…
          </div>
        )}
      </div>

      <StepActions
        onBack={onBack}
        message={
          measurementLabel
            ? `${shapeType === "polygon" ? "Area" : "Length"}: ${measurementLabel}`
            : "Draw a shape to see its measurement."
        }
      >
        <button
          type="button"
          onClick={() => measurement && onComplete(measurement)}
          disabled={!measurement}
          className="btn-gradient shrink-0 rounded-md px-5 py-2.5 text-sm font-medium"
        >
          Continue
        </button>
      </StepActions>
    </div>
  );
}
