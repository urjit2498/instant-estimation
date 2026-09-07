"use client";

import { useEffect, useMemo, useState } from "react";
import { StepActions } from "@/components/quote/StepActions";
import { SelectCard } from "@/components/quote/SelectCard";
import { MATERIAL_CATEGORIES } from "@/lib/materials/categories";
import type { MaterialListItem } from "@/types/material";

interface MaterialSelectStepProps {
  contractorSlug: string;
  onBack: () => void;
  onSubmit: (selection: { materialId: string; heightId: string }) => void;
}

type CategoryFilter = "all" | string;

export function MaterialSelectStep({
  contractorSlug,
  onBack,
  onSubmit,
}: MaterialSelectStepProps) {
  const [materials, setMaterials] = useState<MaterialListItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [selectedHeightId, setSelectedHeightId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setMaterials(null);
    setLoadError(null);

    fetch(`/api/materials?contractorSlug=${encodeURIComponent(contractorSlug)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load materials");
        return data as MaterialListItem[];
      })
      .then((data) => {
        if (!cancelled) setMaterials(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Couldn't load materials.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contractorSlug]);

  const filteredMaterials = useMemo(() => {
    if (!materials) return null;
    if (categoryFilter === "all") return materials;
    return materials.filter((m) => m.categoryId === categoryFilter);
  }, [materials, categoryFilter]);

  function handleSelectMaterial(material: MaterialListItem) {
    setSelectedMaterialId(material.id);
    if (material.heights.length === 1) {
      setSelectedHeightId(material.heights[0].id);
    } else {
      setSelectedHeightId(null);
    }
  }

  function handleCategoryChange(next: CategoryFilter) {
    setCategoryFilter(next);
    // Clear selection if it no longer belongs to the active filter.
    if (selectedMaterialId && materials) {
      const selected = materials.find((m) => m.id === selectedMaterialId);
      if (selected && next !== "all" && selected.categoryId !== next) {
        setSelectedMaterialId(null);
        setSelectedHeightId(null);
      }
    }
  }

  const selectedMaterial = materials?.find((m) => m.id === selectedMaterialId) ?? null;
  const canContinue = Boolean(selectedMaterialId && selectedHeightId);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-heading text-xl font-semibold text-asphalt-950">Choose your material</h2>
        <p className="mt-1 text-sm text-asphalt-700">
          Pick a style, then choose a height. Pricing uses the rate for that height.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter materials by category"
      >
        <button
          type="button"
          role="tab"
          aria-selected={categoryFilter === "all"}
          onClick={() => handleCategoryChange("all")}
          className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
            categoryFilter === "all"
              ? "bg-asphalt-950 text-paper"
              : "bg-paper-raised text-asphalt-700 ring-1 ring-asphalt-200 hover:ring-asphalt-300"
          }`}
        >
          All
        </button>
        {MATERIAL_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={categoryFilter === category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              categoryFilter === category.id
                ? "bg-asphalt-950 text-paper"
                : "bg-paper-raised text-asphalt-700 ring-1 ring-asphalt-200 hover:ring-asphalt-300"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {loadError && (
        <div className="rounded-lg border border-error bg-error-bg p-4 text-sm text-asphalt-950">
          {loadError}
        </div>
      )}

      {!materials && !loadError && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-asphalt-200/60" />
          ))}
        </div>
      )}

      {materials && materials.length === 0 && (
        <div className="rounded-lg border border-asphalt-200 bg-paper-raised p-4 text-sm text-asphalt-700">
          No materials are available for this brand yet.
        </div>
      )}

      {filteredMaterials && filteredMaterials.length === 0 && materials && materials.length > 0 && (
        <div className="rounded-lg border border-asphalt-200 bg-paper-raised p-4 text-sm text-asphalt-700">
          No materials in this category.
        </div>
      )}

      {filteredMaterials && filteredMaterials.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filteredMaterials.map((material) => (
            <SelectCard
              key={material.id}
              selected={selectedMaterialId === material.id}
              onSelect={() => handleSelectMaterial(material)}
              cornerBadge={material.category ?? undefined}
            >
              <div className="-mx-4 -mt-4 overflow-hidden rounded-t-[10px]">
                {material.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage public URLs
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-asphalt-950 font-heading text-3xl text-accent-bright">
                    {material.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 pt-1">
                <span className="font-heading text-sm font-semibold text-asphalt-950">
                  {material.name}
                </span>
                <p className="mt-0.5 line-clamp-2 text-xs text-asphalt-700">
                  {material.shortDescription}
                </p>
                {material.heights.length > 0 && (
                  <p className="mt-1.5 text-[11px] text-asphalt-300">
                    From ${Math.min(...material.heights.map((h) => h.price)).toFixed(2)}/ft
                  </p>
                )}
              </div>
            </SelectCard>
          ))}
        </div>
      )}

      {selectedMaterial && selectedMaterial.heights.length > 0 && (
        <div className="rounded-lg border border-asphalt-200 bg-paper-raised p-4">
          <p className="mb-2 text-sm font-medium text-asphalt-950">Select height</p>
          <div className="flex flex-wrap gap-2">
            {selectedMaterial.heights.map((height) => (
              <button
                key={height.id}
                type="button"
                onClick={() => setSelectedHeightId(height.id)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  selectedHeightId === height.id
                    ? "bg-asphalt-950 text-paper"
                    : "bg-paper text-asphalt-700 ring-1 ring-asphalt-200 hover:ring-asphalt-300"
                }`}
              >
                {height.title}
                <span className="ml-1.5 font-mono text-xs opacity-80">
                  ${height.price.toFixed(2)}/ft
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <StepActions onBack={onBack}>
        <button
          type="button"
          onClick={() =>
            selectedMaterialId &&
            selectedHeightId &&
            onSubmit({ materialId: selectedMaterialId, heightId: selectedHeightId })
          }
          disabled={!canContinue}
          className="btn-gradient shrink-0 rounded-md px-5 py-2.5 text-sm font-medium"
        >
          Continue
        </button>
      </StepActions>
    </div>
  );
}
