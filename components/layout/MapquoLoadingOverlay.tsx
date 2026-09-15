"use client";

import { useEffect, useState } from "react";
import { MapquoLoader } from "@/components/layout/MapquoLoader";

interface MapquoLoadingOverlayProps {
  show: boolean;
  label?: string;
  variant?: "overlay" | "inline";
  /** Avoid a flash when the request finishes quickly. */
  delayMs?: number;
}

export function MapquoLoadingOverlay({
  show,
  label,
  variant = "overlay",
  delayMs = 350,
}: MapquoLoadingOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const timeout = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timeout);
  }, [show, delayMs]);

  if (!visible) return null;
  return <MapquoLoader label={label} variant={variant} />;
}
