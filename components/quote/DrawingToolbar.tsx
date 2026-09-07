import type { ReactNode } from "react";
import type { ShapeType } from "@/types/quote";

const shapeBtn = (active: boolean) =>
  `rounded-full px-3 py-1.5 text-sm ${
    active
      ? "bg-asphalt-950 text-paper"
      : "bg-paper-raised text-asphalt-700 ring-1 ring-asphalt-200"
  }`;

const equalBtn =
  "w-full rounded-md px-2 py-2 text-center text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40";

interface DrawingToolbarProps {
  shapeType: ShapeType;
  onShapeTypeChange: (next: ShapeType) => void;
  pointCount: number;
  canFinish: boolean;
  isDrawing: boolean;
  onUndo: () => void;
  onClear: () => void;
  onToggleDrawing: () => void;
  finishLabel: string;
  resumeLabel: string;
  extra?: ReactNode;
}

export function DrawingToolbar({
  shapeType,
  onShapeTypeChange,
  pointCount,
  canFinish,
  isDrawing,
  onUndo,
  onClear,
  onToggleDrawing,
  finishLabel,
  resumeLabel,
  extra,
}: DrawingToolbarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-asphalt-700">Shape:</span>
        <button type="button" onClick={() => onShapeTypeChange("polygon")} className={shapeBtn(shapeType === "polygon")}>
          Area
        </button>
        <button type="button" onClick={() => onShapeTypeChange("line")} className={shapeBtn(shapeType === "line")}>
          Line
        </button>
        {extra}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={pointCount === 0}
          className={`btn-secondary ${equalBtn}`}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={pointCount === 0}
          className={`btn-secondary ${equalBtn}`}
        >
          Clear
        </button>
        {isDrawing ? (
          <button
            type="button"
            onClick={onToggleDrawing}
            disabled={!canFinish}
            className={`bg-success text-white ${equalBtn}`}
          >
            {finishLabel}
          </button>
        ) : (
          <button type="button" onClick={onToggleDrawing} className={`btn-secondary ${equalBtn}`}>
            {resumeLabel}
          </button>
        )}
      </div>
    </div>
  );
}
