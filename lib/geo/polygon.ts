import { area } from "@turf/area";
import { distance } from "@turf/distance";
import { lineString, polygon } from "@turf/helpers";
import { length } from "@turf/length";
import type { LatLngPoint } from "@/types/quote";

const SQ_METERS_PER_SQ_FT = 0.09290304;
const METERS_PER_FT = 0.3048;

export interface PathSegment {
  start: LatLngPoint;
  end: LatLngPoint;
  midpoint: LatLngPoint;
  lengthFt: number;
}

function toClosedRing(path: LatLngPoint[]): [number, number][] {
  const ring = path.map((p) => [p.lng, p.lat] as [number, number]);
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng !== lastLng || firstLat !== lastLat) {
    ring.push([firstLng, firstLat]);
  }
  return ring;
}

/** Area of a drawn polygon in square feet. Requires at least 3 points. */
export function computeAreaSqFt(path: LatLngPoint[]): number {
  if (path.length < 3) return 0;
  const feature = polygon([toClosedRing(path)]);
  const sqMeters = area(feature);
  return sqMeters / SQ_METERS_PER_SQ_FT;
}

/** Length of a drawn line in feet. Requires at least 2 points. */
export function computeLengthFt(path: LatLngPoint[]): number {
  if (path.length < 2) return 0;
  const feature = lineString(path.map((p) => [p.lng, p.lat]));
  const km = length(feature, { units: "kilometers" });
  return (km * 1000) / METERS_PER_FT;
}

function midpoint(a: LatLngPoint, b: LatLngPoint): LatLngPoint {
  return { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
}

/** Length of a single straight segment in feet. */
export function computeSegmentLengthFt(a: LatLngPoint, b: LatLngPoint): number {
  const meters = distance([a.lng, a.lat], [b.lng, b.lat], { units: "meters" });
  return meters / METERS_PER_FT;
}

/** Consecutive path edges, optionally including the closing edge back to the first point. */
export function getPathSegments(path: LatLngPoint[], closeLoop: boolean): PathSegment[] {
  if (path.length < 2) return [];

  const segments: PathSegment[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    segments.push({
      start,
      end,
      midpoint: midpoint(start, end),
      lengthFt: computeSegmentLengthFt(start, end),
    });
  }

  if (closeLoop && path.length >= 3) {
    const start = path[path.length - 1];
    const end = path[0];
    segments.push({
      start,
      end,
      midpoint: midpoint(start, end),
      lengthFt: computeSegmentLengthFt(start, end),
    });
  }

  return segments;
}
