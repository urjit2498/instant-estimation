"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/quote/BackButton";
import { SelectCard } from "@/components/quote/SelectCard";
import type { MaterialListItem } from "@/types/material";

interface MaterialSelectStepProps {
  onBack: () => void;
  onSubmit: (materialId: string) => void;
  isSubmitting: boolean;
}

export function MaterialSelectStep({ onBack, onSubmit, isSubmitting }: MaterialSelectStepProps) {
  const [materials, setMaterials] = useState<MaterialListItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/materials")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load materials");
        return res.json();
      })
      .then((data: MaterialListItem[]) => {
        if (!cancelled) setMaterials(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">Choose your material</h2>
        <p className="mt-1 text-sm text-asphalt-700">This is the only detail we need from you to price your job.</p>
      </div>

      {loadError && (
        <div className="rounded-lg border border-error bg-error-bg p-4 text-sm text-asphalt-950">
          Couldn&apos;t load materials. Please try again.
        </div>
      )}

      {!materials && !loadError && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-asphalt-200/60" />
          ))}
        </div>
      )}

      {materials && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {materials.map((material) => (
            <SelectCard
              key={material.id}
              selected={selectedId === material.id}
              onSelect={() => setSelectedId(material.id)}
            >
              <div className="flex items-start gap-3">
                {material.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- mock catalog data, no real assets yet
                  <img
                    src={material.imageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-asphalt-950 font-heading text-lg text-accent-bright">
                    {material.name.charAt(0)}
                  </div>
                )}
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-accent">
                    {material.category}
                  </span>
                  <span className="font-heading text-sm font-semibold text-asphalt-950">
                    {material.name}
                  </span>
                  <p className="mt-0.5 text-xs text-asphalt-700">{material.shortDescription}</p>
                </div>
              </div>
            </SelectCard>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          type="button"
          onClick={() => selectedId && onSubmit(selectedId)}
          disabled={!selectedId || isSubmitting}
          className="btn-gradient rounded-md px-5 py-2.5 text-sm font-medium"
        >
          {isSubmitting ? "Calculating…" : "Get instant estimate"}
        </button>
      </div>
    </div>
  );
}
