"use client";

import type { Facets, FacetOption, ModelFilters } from "@/lib/types";
import { Skeleton } from "./ui";

type ListKey = "labs" | "providers" | "types" | "capabilities" | "modalities";

interface Props {
  facets?: Facets;
  filters: ModelFilters;
  onChange: (patch: Partial<ModelFilters>) => void;
  onReset: () => void;
  activeCount: number;
}

const GROUPS: { key: ListKey; title: string }[] = [
  { key: "types", title: "Model type" },
  { key: "labs", title: "Lab" },
  { key: "providers", title: "Provider" },
  { key: "capabilities", title: "Capabilities" },
  { key: "modalities", title: "Input modalities" },
];

export default function FilterPanel({
  facets,
  filters,
  onChange,
  onReset,
  activeCount,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm font-medium text-cobalt hover:underline"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-line bg-paper-raised px-3 py-2.5 text-sm font-medium">
        Open weights only
        <input
          type="checkbox"
          checked={!!filters.openWeights}
          onChange={(e) =>
            onChange({ openWeights: e.target.checked || undefined })
          }
          className="h-4 w-4 accent-cobalt"
        />
      </label>

      {!facets ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      ) : (
        GROUPS.map((g) => (
          <FilterGroup
            key={g.key}
            title={g.title}
            options={facets[g.key]}
            selected={filters[g.key] ?? []}
            onToggle={(value) => {
              const cur = filters[g.key] ?? [];
              const next = cur.includes(value)
                ? cur.filter((v) => v !== value)
                : [...cur, value];
              onChange({
                [g.key]: next.length ? next : undefined,
              } as Partial<ModelFilters>);
            }}
          />
        ))
      )}
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: FacetOption[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{title}</legend>
      <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-ink-soft hover:bg-paper-sunk"
          >
            <input
              type="checkbox"
              checked={selected.includes(o.value)}
              onChange={() => onToggle(o.value)}
              className="h-4 w-4 accent-cobalt"
            />
            <span className="flex-1 truncate">{o.label}</span>
            <span className="text-xs tabular-nums text-ink-mute">
              {o.count}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
