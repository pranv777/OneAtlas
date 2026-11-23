"use client";

import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { useDebounced, useFacets, useModels } from "@/lib/hooks";
import type { ModelFilters, SortKey } from "@/lib/types";
import FilterPanel from "./FilterPanel";
import { ModelCard, ModelRow, ModelTableHeader } from "./ModelRow";
import Pagination from "./Pagination";
import { EmptyState, ErrorState, PageHeader, Skeleton } from "./ui";

const PAGE_SIZE = 12;
const LIST_KEYS = [
  "labs",
  "providers",
  "types",
  "capabilities",
  "modalities",
] as const;
const SORTS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest release" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "context-desc", label: "Context: largest first" },
  { value: "context-asc", label: "Context: smallest first" },
  { value: "name", label: "Name (A to Z)" },
];

function parse(sp: URLSearchParams): ModelFilters {
  const list = (k: string) => sp.get(k)?.split(",").filter(Boolean);
  const sort = sp.get("sort") as SortKey | null;
  return {
    q: sp.get("q") ?? undefined,
    labs: list("labs"),
    providers: list("providers"),
    types: list("types"),
    capabilities: list("capabilities"),
    modalities: list("modalities"),
    openWeights: sp.get("openWeights") === "true" || undefined,
    sort: sort && SORTS.some((s) => s.value === sort) ? sort : "newest",
    page: Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1),
    pageSize: PAGE_SIZE,
  };
}

export default function ModelsExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const view = sp.get("view") === "grid" ? "grid" : "list";
  const filters = useMemo(
    () => parse(new URLSearchParams(sp.toString())),
    [sp],
  );
  const [drawer, setDrawer] = useState(false);
  const [qInput, setQInput] = useState(filters.q ?? "");
  const debouncedQ = useDebounced(qInput, 300);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useModels(filters);
  const { data: facets } = useFacets();

  const writeUrl = useCallback(
    (
      patch: Record<string, string | string[] | boolean | number | undefined>,
      resetPage = true,
    ) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (
          v === undefined ||
          v === "" ||
          v === false ||
          (Array.isArray(v) && v.length === 0)
        )
          next.delete(k);
        else next.set(k, Array.isArray(v) ? v.join(",") : String(v));
      }
      if (resetPage) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [sp, router, pathname],
  );

  useEffect(() => setQInput(filters.q ?? ""), [filters.q]);
  useEffect(() => {
    if (debouncedQ !== (filters.q ?? ""))
      writeUrl({ q: debouncedQ || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const activeCount =
    LIST_KEYS.reduce((n, k) => n + (filters[k]?.length ?? 0), 0) +
    (filters.openWeights ? 1 : 0);

  const onChange = (patch: Partial<ModelFilters>) =>
    writeUrl(patch as unknown as Parameters<typeof writeUrl>[0]);
  const reset = () =>
    writeUrl({
      labs: undefined,
      providers: undefined,
      types: undefined,
      capabilities: undefined,
      modalities: undefined,
      openWeights: undefined,
    });

  const panel = (
    <FilterPanel
      facets={facets}
      filters={filters}
      onChange={onChange}
      onReset={reset}
      activeCount={activeCount}
    />
  );

  return (
    <>
      <PageHeader
        title="Models"
        description="Search and filter AI models across labs and providers. Pick up to four to compare."
      />

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            {panel}
          </div>
        </aside>

        <section aria-label="Results">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
                aria-hidden
              />
              <input
                type="search"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Search by name, lab or provider"
                aria-label="Search models"
                className="h-10 w-full rounded-md border border-line-strong bg-paper-raised pl-9 pr-3 text-sm outline-none focus:border-cobalt"
              />
            </div>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) =>
                writeUrl({
                  sort:
                    e.target.value === "newest" ? undefined : e.target.value,
                })
              }
              className="h-10 rounded-md border border-line-strong bg-paper-raised px-3 text-sm outline-none focus:border-cobalt"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setDrawer(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong bg-paper-raised px-3 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
              {activeCount > 0 && ` (${activeCount})`}
            </button>
            <div
              className="flex rounded-md border border-line-strong bg-paper-raised p-0.5"
              role="group"
              aria-label="Layout"
            >
              {(["list", "grid"] as const).map((v) => {
                const Icon = v === "list" ? List : LayoutGrid;
                return (
                  <button
                    key={v}
                    onClick={() =>
                      writeUrl({ view: v === "list" ? undefined : v }, false)
                    }
                    aria-pressed={view === v}
                    aria-label={`${v} view`}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded",
                      view === v
                        ? "bg-ink text-white"
                        : "text-ink-soft hover:bg-paper-sunk",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mb-3 text-sm text-ink-soft" aria-live="polite">
            {data
              ? `${data.total} model${data.total === 1 ? "" : "s"}`
              : "Loading models"}
            {isFetching && !isLoading && " · updating"}
          </p>

          {isError ? (
            <ErrorState
              message={(error as Error).message}
              onRetry={() => refetch()}
            />
          ) : isLoading ? (
            <ResultsSkeleton view={view} />
          ) : data && data.items.length === 0 ? (
            <EmptyState
              title="No models match these filters"
              hint="Remove a filter or shorten your search to see more results."
              action={
                <button
                  onClick={() => {
                    reset();
                    setQInput("");
                    writeUrl({ q: undefined });
                  }}
                  className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-white"
                >
                  Clear filters
                </button>
              }
            />
          ) : data ? (
            <div className={cn(isFetching && "opacity-70 transition-opacity")}>
              {view === "list" ? (
                <div className="overflow-hidden rounded-card border border-line bg-paper-raised">
                  <ModelTableHeader />
                  {data.items.map((m) => (
                    <ModelRow key={m.slug} model={m} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((m) => (
                    <ModelCard key={m.slug} model={m} />
                  ))}
                </div>
              )}
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onChange={(p) => {
                  writeUrl({ page: p === 1 ? undefined : p }, false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          ) : null}
        </section>
      </div>

      {drawer && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[88%] max-w-sm overflow-y-auto bg-paper p-5 shadow-xl">
            <button
              onClick={() => setDrawer(false)}
              aria-label="Close filters"
              className="absolute right-3 top-3 rounded-md p-2 hover:bg-paper-sunk"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <div className="mt-6">{panel}</div>
            <button
              onClick={() => setDrawer(false)}
              className="mt-6 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-white"
            >
              Show {data?.total ?? ""} models
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ResultsSkeleton({ view }: { view: "list" | "grid" }) {
  if (view === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}
