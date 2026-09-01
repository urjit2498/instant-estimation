/**
 * Flat-plane geometry for the "upload a survey" branch. NOT the same math as lib/geo/polygon.ts —
 * that file uses Turf, which assumes [lng, lat] geographic coordinates on a sphere. Here we're
 * measuring a traced shape in image-pixel coordinates after calibrating pixels-to-feet against a
 * known reference length, which is plain Cartesian geometry (shoelace formula), not geodesic.
 */

export interface PixelPoint {
  x: number;
  y: number;
}

function distancePx(a: PixelPoint, b: PixelPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Feet-per-pixel scale derived from two calibration points and their known real-world length. */
export function computeCalibrationScale(
  p1: PixelPoint,
  p2: PixelPoint,
  knownLengthFt: number
): number {
  const pixelDistance = distancePx(p1, p2);
  if (pixelDistance === 0) return 0;
  return knownLengthFt / pixelDistance;
}

/** Area of a traced polygon in square feet, via the shoelace formula. Requires at least 3 points. */
export function computePlanarAreaSqFt(points: PixelPoint[], ftPerPixel: number): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const { x: x1, y: y1 } = points[i];
    const { x: x2, y: y2 } = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  const areaPx2 = Math.abs(sum) / 2;
  return areaPx2 * ftPerPixel * ftPerPixel;
}

/** Length of a traced line in feet. Requires at least 2 points. */
export function computePlanarLengthFt(points: PixelPoint[], ftPerPixel: number): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += distancePx(points[i], points[i + 1]);
  }
  return total * ftPerPixel;
}
