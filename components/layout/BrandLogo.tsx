"use client";

import { useEffect, useState } from "react";

interface BrandLogoProps {
  src: string;
  alt: string;
}

const DISPLAY_PX = 40;
const RASTER_PX = 128;

export function BrandLogo({ src, alt }: BrandLogoProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.decoding = "async";

    image.onload = () => {
      if (cancelled) return;
      try {
        setDisplaySrc(cropToContent(image) ?? src);
      } catch {
        setDisplaySrc(src);
      }
    };
    image.onerror = () => {
      if (!cancelled) setDisplaySrc(src);
    };
    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    if (!displaySrc) return;
    const selectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel="apple-touch-icon"]'];
    const previous = selectors.map((selector) => {
      const link = document.querySelector<HTMLLinkElement>(selector);
      return link ? { link, href: link.href } : null;
    });
    for (const entry of previous) {
      if (entry) entry.link.href = displaySrc;
    }
    return () => {
      for (const entry of previous) {
        if (entry) entry.link.href = entry.href;
      }
    };
  }, [displaySrc]);

  if (!displaySrc) {
    return (
      <span
        className="h-10 w-10 shrink-0"
        aria-hidden
      />
    );
  }

  return (
    <img
      src={displaySrc}
      alt={alt}
      width={DISPLAY_PX}
      height={DISPLAY_PX}
      className="h-10 w-10 shrink-0 object-contain"
    />
  );
}

function cropToContent(image: HTMLImageElement): string | null {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!(width > 0 && height > 0)) return null;

  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const sourceCtx = source.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) return null;
  sourceCtx.drawImage(image, 0, 0);

  let data: Uint8ClampedArray;
  try {
    data = sourceCtx.getImageData(0, 0, width, height).data;
  } catch {
    return null;
  }
  const bounds = contentBounds(data, width, height);
  if (!bounds) return null;

  const croppedWidth = bounds.maxX - bounds.minX + 1;
  const croppedHeight = bounds.maxY - bounds.minY + 1;
  const scale = Math.min(RASTER_PX / croppedWidth, RASTER_PX / croppedHeight);
  const drawWidth = Math.max(1, Math.round(croppedWidth * scale));
  const drawHeight = Math.max(1, Math.round(croppedHeight * scale));

  const output = document.createElement("canvas");
  output.width = RASTER_PX;
  output.height = RASTER_PX;
  const outputCtx = output.getContext("2d");
  if (!outputCtx) return null;
  outputCtx.imageSmoothingEnabled = true;
  outputCtx.imageSmoothingQuality = "high";
  outputCtx.drawImage(
    source,
    bounds.minX,
    bounds.minY,
    croppedWidth,
    croppedHeight,
    Math.floor((RASTER_PX - drawWidth) / 2),
    Math.floor((RASTER_PX - drawHeight) / 2),
    drawWidth,
    drawHeight,
  );

  return output.toDataURL("image/png");
}

function contentBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  const corners = [
    pixelAt(data, width, 0, 0),
    pixelAt(data, width, width - 1, 0),
    pixelAt(data, width, 0, height - 1),
    pixelAt(data, width, width - 1, height - 1),
  ];
  const bg = [
    corners.reduce((sum, p) => sum + p[0], 0) / 4,
    corners.reduce((sum, p) => sum + p[1], 0) / 4,
    corners.reduce((sum, p) => sum + p[2], 0) / 4,
    corners.reduce((sum, p) => sum + p[3], 0) / 4,
  ] as const;
  const transparentBg = bg[3] < 16;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i] ?? 0;
      const g = data[i + 1] ?? 0;
      const b = data[i + 2] ?? 0;
      const a = data[i + 3] ?? 0;
      const isEmpty = transparentBg
        ? a < 16
        : a < 16 ||
          Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(b - bg[2]) < 36;
      if (isEmpty) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) return null;

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.08);
  return {
    minX: Math.max(0, minX - pad),
    minY: Math.max(0, minY - pad),
    maxX: Math.min(width - 1, maxX + pad),
    maxY: Math.min(height - 1, maxY + pad),
  };
}

function pixelAt(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): [number, number, number, number] {
  const i = (y * width + x) * 4;
  return [data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0, data[i + 3] ?? 0];
}
