"use client";

import { OverlayViewF, OVERLAY_MOUSE_TARGET } from "@react-google-maps/api";
import { getPathSegments } from "@/lib/geo/polygon";
import type { LatLngPoint } from "@/types/quote";

interface SegmentLengthLabelsProps {
  path: LatLngPoint[];
  /** When true, also label the edge from the last point back to the first. */
  closeLoop: boolean;
}

export function SegmentLengthLabels({ path, closeLoop }: SegmentLengthLabelsProps) {
  const segments = getPathSegments(path, closeLoop);

  return (
    <>
      {segments.map((segment, i) => (
        <OverlayViewF
          key={i}
          position={segment.midpoint}
          mapPaneName={OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({
            x: -width / 2,
            y: -height / 2,
          })}
        >
          <div className="pointer-events-none whitespace-nowrap rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-slate-900 shadow-sm ring-1 ring-slate-200">
            {Math.round(segment.lengthFt)} ft
          </div>
        </OverlayViewF>
      ))}
    </>
  );
}
