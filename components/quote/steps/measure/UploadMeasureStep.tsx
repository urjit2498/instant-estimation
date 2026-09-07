"use client";

import { BackButton } from "@/components/quote/BackButton";
import { DrawingToolbar } from "@/components/quote/DrawingToolbar";
import { StepActions } from "@/components/quote/StepActions";
import { useRef, useState } from "react";
import {
  computeCalibrationScale,
  computePlanarAreaSqFt,
  computePlanarLengthFt,
  type PixelPoint,
} from "@/lib/geo/planar";
import type { Measurement, ShapeType } from "@/types/quote";

interface UploadMeasureStepProps {
  onBack: () => void;
  onComplete: (measurement: Measurement) => void;
}

type Phase = "upload" | "calibrate" | "trace";

/**
 * File upload + click-to-trace over the image + a two-point calibration step to convert traced
 * pixels to real-world feet. The image is used purely client-side as a tracing reference — it is
 * never uploaded anywhere in this mocked phase.
 */
export function UploadMeasureStep({ onBack, onComplete }: UploadMeasureStepProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("upload");
  const [calibrationPoints, setCalibrationPoints] = useState<PixelPoint[]>([]);
  const [calibrationLengthFt, setCalibrationLengthFt] = useState("");
  const [ftPerPixel, setFtPerPixel] = useState<number | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("polygon");
  const [tracePoints, setTracePoints] = useState<PixelPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setPhase("calibrate");
    setCalibrationPoints([]);
    setCalibrationLengthFt("");
    setFtPerPixel(null);
    setTracePoints([]);
    setIsDrawing(true);
  }

  function getRelativePoint(e: React.MouseEvent): PixelPoint | null {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleOverlayClick(e: React.MouseEvent) {
    const point = getRelativePoint(e);
    if (!point) return;

    if (phase === "calibrate" && calibrationPoints.length < 2) {
      setCalibrationPoints((prev) => [...prev, point]);
      return;
    }
    if (phase === "trace" && isDrawing) {
      setTracePoints((prev) => [...prev, point]);
    }
  }

  function confirmCalibration() {
    const knownLengthFt = Number(calibrationLengthFt);
    if (calibrationPoints.length !== 2 || !Number.isFinite(knownLengthFt) || knownLengthFt <= 0) {
      return;
    }
    const scale = computeCalibrationScale(calibrationPoints[0], calibrationPoints[1], knownLengthFt);
    if (scale <= 0) return;
    setFtPerPixel(scale);
    setPhase("trace");
  }

  function recalibrate() {
    setPhase("calibrate");
    setCalibrationPoints([]);
    setCalibrationLengthFt("");
    setFtPerPixel(null);
    setTracePoints([]);
    setIsDrawing(true);
  }

  function undoLastTracePoint() {
    setTracePoints((prev) => prev.slice(0, -1));
  }

  function clearTrace() {
    setTracePoints([]);
    setIsDrawing(true);
  }

  function switchShapeType(next: ShapeType) {
    setShapeType(next);
    clearTrace();
  }

  const minPoints = shapeType === "polygon" ? 3 : 2;
  const canFinish = tracePoints.length >= minPoints;
  const measurement: Measurement | null =
    canFinish && ftPerPixel
      ? shapeType === "polygon"
        ? { method: "upload", shapeType, areaSqFt: computePlanarAreaSqFt(tracePoints, ftPerPixel) }
        : { method: "upload", shapeType, lengthFt: computePlanarLengthFt(tracePoints, ftPerPixel) }
      : null;
  const measurementLabel = measurement
    ? measurement.shapeType === "polygon"
      ? `~${Math.round(measurement.areaSqFt ?? 0).toLocaleString()} sq ft`
      : `~${Math.round(measurement.lengthFt ?? 0).toLocaleString()} ft`
    : null;

  const polygonPointsAttr =
    shapeType === "polygon" ? tracePoints.map((p) => `${p.x},${p.y}`).join(" ") : "";
  const polylinePointsAttr = tracePoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">
          Upload a survey and trace it
        </h2>
        <p className="mt-1 text-sm text-asphalt-700">
          Upload a plot plan or site photo, calibrate it against something of known length, then
          trace your driveway.
        </p>
      </div>

      {phase === "upload" && (
        <>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-asphalt-200 bg-paper-raised px-6 py-12 text-center transition-colors hover:border-asphalt-950">
            <span className="font-heading text-base font-semibold text-asphalt-950">
              Choose a survey image
            </span>
            <span className="text-sm text-asphalt-700">
              PNG or JPG — a plot plan, site photo, or aerial screenshot
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          </label>
          <div className="flex items-center justify-start">
            <BackButton onClick={onBack} />
          </div>
        </>
      )}

      {phase !== "upload" && imageUrl && (
        <>
          {phase === "calibrate" && (
            <div className="rounded-lg border border-accent bg-accent-100 p-3 text-sm text-asphalt-950">
              {calibrationPoints.length < 2
                ? "Click both ends of something you know the length of — e.g. a garage door, driveway apron, or parked car."
                : "Got it. Enter that length below to calibrate."}
            </div>
          )}

          {phase === "trace" && (
            <DrawingToolbar
              shapeType={shapeType}
              onShapeTypeChange={switchShapeType}
              pointCount={tracePoints.length}
              canFinish={canFinish}
              isDrawing={isDrawing}
              onUndo={undoLastTracePoint}
              onClear={clearTrace}
              onToggleDrawing={() => setIsDrawing((prev) => !prev)}
              finishLabel="Finish"
              resumeLabel="Resume"
              extra={
                <button
                  type="button"
                  onClick={recalibrate}
                  className="ml-auto text-xs text-asphalt-700 underline"
                >
                  Recalibrate
                </button>
              }
            />
          )}

          <div className="flex justify-center overflow-auto rounded-lg border border-asphalt-200 bg-asphalt-950 p-2">
            <div className="relative inline-block" ref={containerRef}>
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, not an optimizable remote asset */}
              <img
                src={imageUrl}
                alt="Uploaded survey, used as a tracing reference"
                className="block max-h-[28rem] w-auto max-w-full select-none sm:max-h-[32rem] lg:max-h-[40rem]"
                draggable={false}
              />
              <svg
                className={`absolute inset-0 h-full w-full ${phase === "calibrate" || isDrawing ? "cursor-crosshair" : ""}`}
                onClick={handleOverlayClick}
              >
                {/* Calibration reference line — stays visible (muted) during tracing for context. */}
                {calibrationPoints.length === 2 && (
                  <line
                    x1={calibrationPoints[0].x}
                    y1={calibrationPoints[0].y}
                    x2={calibrationPoints[1].x}
                    y2={calibrationPoints[1].y}
                    stroke="#ff4b1f"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    opacity={phase === "calibrate" ? 1 : 0.4}
                  />
                )}
                {calibrationPoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={5} fill="#ff4b1f" stroke="#17181c" strokeWidth={1.5} />
                ))}

                {/* Traced shape */}
                {shapeType === "polygon" && tracePoints.length >= 3 && (
                  <polygon
                    points={polygonPointsAttr}
                    fill="#17181c"
                    fillOpacity={isDrawing ? 0.12 : 0.25}
                    stroke="#ff4b1f"
                    strokeOpacity={isDrawing ? 0.6 : 1}
                    strokeWidth={2}
                  />
                )}
                {shapeType === "line" && tracePoints.length >= 2 && (
                  <polyline
                    points={polylinePointsAttr}
                    fill="none"
                    stroke="#ff4b1f"
                    strokeOpacity={isDrawing ? 0.6 : 1}
                    strokeWidth={3}
                  />
                )}
                {tracePoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={5} fill="#f8fafc" stroke="#17181c" strokeWidth={2} />
                ))}
              </svg>

              {phase === "trace" && (
                <div className="pointer-events-none absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-paper-raised/95 px-3 py-1.5 text-xs font-medium text-asphalt-950 shadow-md ring-1 ring-asphalt-200">
                  {tracePoints.length === 0
                    ? "Tap to place a point"
                    : `${tracePoints.length} point${tracePoints.length === 1 ? "" : "s"} · drag to adjust`}
                  {measurementLabel && (
                    <span className="ml-2 rounded-full bg-asphalt-950 px-2 py-0.5 font-mono text-white">
                      {measurementLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {phase === "calibrate" && calibrationPoints.length === 2 && (
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label htmlFor="calibration-length" className="mb-1 block text-sm font-medium text-asphalt-950">
                  That reference is how long?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="calibration-length"
                    type="number"
                    min={0.1}
                    step="0.1"
                    inputMode="decimal"
                    placeholder="e.g. 16"
                    value={calibrationLengthFt}
                    onChange={(e) => setCalibrationLengthFt(e.target.value)}
                    className="w-28 rounded-md border border-asphalt-200 bg-paper-raised px-3 py-2 font-mono text-sm text-asphalt-950 focus:border-asphalt-950 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <span className="text-sm text-asphalt-700">ft</span>
                </div>
              </div>
              <button
                type="button"
                onClick={confirmCalibration}
                disabled={!calibrationLengthFt || Number(calibrationLengthFt) <= 0}
                className="btn-gradient rounded-md px-4 py-2.5 text-sm font-medium"
              >
                Confirm calibration
              </button>
              <button
                type="button"
                onClick={() => setCalibrationPoints([])}
                className="rounded-md px-3 py-2.5 text-sm text-asphalt-700 underline"
              >
                Reset points
              </button>
            </div>
          )}

          {phase === "trace" && (
            <StepActions
              onBack={onBack}
              message={
                measurementLabel
                  ? `${shapeType === "polygon" ? "Area" : "Length"}: ${measurementLabel}`
                  : "Trace a shape to see its measurement."
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
          )}

          {phase === "calibrate" && (
            <div className="flex items-center justify-start">
              <BackButton onClick={onBack} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
