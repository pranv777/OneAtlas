"use client";

import { Check, Minus, Plus, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  ALL_CAPABILITIES,
  CAPABILITY_LABEL,
  TYPE_LABEL,
  fmtContext,
  fmtDate,
  fmtPrice,
  fmtScore,
  fmtTokens,
} from "@/lib/format";
import { useCompare, useDebounced, useSearch } from "@/lib/hooks";
import type { Model } from "@/lib/types";
import { MAX_COMPARE, useCompareList } from "./CompareProvider";
import { EmptyState, ErrorState, LabMark, Skeleton } from "./ui";

export default function CompareView() {
  const router = useRouter();
  const sp = useSearchParams();
  const shared = useCompareList();
  const urlSlugs = useMemo(
    () =>
      (sp.get("models") ?? "").split(",").filter(Boolean).slice(0, MAX_COMPARE),
    [sp],
  );

  // If someone lands on /compare with no query, fall back to the saved tray selection.
  useEffect(() => {
    if (urlSlugs.length === 0 && shared.slugs.length > 0)
      router.replace(`/compare?models=${shared.slugs.join(",")}`);
  }, [urlSlugs.length, shared.slugs, router]);

  // Keep the tray in sync with whatever the URL (a shared link, say) says.
  useEffect(() => {
    if (urlSlugs.length > 0 && urlSlugs.join(",") !== shared.slugs.join(","))
      shared.set(urlSlugs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSlugs.join(",")]);

  const setSlugs = (next: string[]) => {
    shared.set(next);
    router.replace(
      next.length ? `/compare?models=${next.join(",")}` : "/compare",
      { scroll: false },
    );
  };

  const { data, isLoading, isError, error, refetch } = useCompare(urlSlugs);
  const models = data?.models ?? [];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Compare models
          </h1>
          <p className="mt-2 text-ink-soft">
            Put up to four models side by side. The best value in each row is
            highlighted, and the link is shareable.
          </p>
        </div>
        <ModelPicker
          disabled={urlSlugs.length >= MAX_COMPARE}
          exclude={urlSlugs}
          onPick={(s) => setSlugs([...urlSlugs, s])}
        />
      </div>

      {urlSlugs.length === 0 ? (
        <EmptyState
          title="Choose models to compare"
          hint="Use the picker above, or add models with the + button while browsing."
          action={
            <Link
              href="/models"
              className="rounded-md bg-ink px-3 py-2 text-sm font-medium text-white"
            >
              Browse models
            </Link>
          }
        />
      ) : isError ? (
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : isLoading || !data ? (
        <Skeleton className="h-96" />
      ) : (
        <>
          {models.length < 2 && (
            <p className="mb-4 rounded-md bg-cobalt-tint px-4 py-3 text-sm text-cobalt-dark">
              Add at least one more model to see differences.
            </p>
          )}
          <CompareTable
            models={models}
            benchmarks={data.benchmarks}
            onRemove={(s) => setSlugs(urlSlugs.filter((x) => x !== s))}
          />
        </>
      )}
    </div>
  );
}

function ModelPicker({
  onPick,
  exclude,
  disabled,
}: {
  onPick: (slug: string) => void;
  exclude: string[];
  disabled: boolean;
}) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 200);
  const { data } = useSearch(dq);
  const options = (data?.models ?? []).filter((m) => !exclude.includes(m.slug));

  return (
    <div className="relative w-full sm:w-72">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
        aria-hidden
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "Comparison is full" : "Add a model"}
        aria-label="Add a model to compare"
        className="h-10 w-full rounded-md border border-line-strong bg-paper-raised pl-9 pr-3 text-sm outline-none focus:border-cobalt disabled:bg-paper-sunk"
      />
      {q.trim() && options.length > 0 && !disabled && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-line bg-paper-raised shadow-lg">
          {options.map((m) => (
            <li key={m.slug}>
              <button
                onClick={() => {
                  onPick(m.slug);
                  setQ("");
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-paper"
              >
                <span className="truncate font-medium">{m.name}</span>
                <span className="flex items-center gap-1 text-xs text-ink-mute">
                  <Plus className="h-3 w-3" aria-hidden />
                  {m.labName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Dir = "min" | "max";

function bestIndexes(values: (number | undefined)[], dir: Dir): Set<number> {
  const nums = values.filter((v): v is number => v !== undefined);
  if (nums.length < 2) return new Set();
  const target = dir === "min" ? Math.min(...nums) : Math.max(...nums);
  if (nums.every((n) => n === target)) return new Set();
  return new Set(
    values.map((v, i) => (v === target ? i : -1)).filter((i) => i >= 0),
  );
}

function CompareTable({
  models,
  benchmarks,
  onRemove,
}: {
  models: Model[];
  benchmarks: { id: string; name: string; unit: string }[];
  onRemove: (slug: string) => void;
}) {
  const cols = `minmax(150px,200px) repeat(${models.length}, minmax(170px, 1fr))`;

  const Row = ({
    label,
    cells,
    best,
  }: {
    label: string;
    cells: React.ReactNode[];
    best?: Set<number>;
  }) => (
    <div
      role="row"
      className="grid border-b border-line last:border-b-0"
      style={{ gridTemplateColumns: cols }}
    >
      <div
        role="rowheader"
        className="sticky left-0 z-10 bg-paper-raised px-4 py-3 text-sm text-ink-soft"
      >
        {label}
      </div>
      {cells.map((c, i) => (
        <div
          role="cell"
          key={i}
          className={cn(
            "px-4 py-3 text-sm tabular-nums",
            best?.has(i) && "bg-cobalt-tint font-semibold text-cobalt-dark",
          )}
        >
          {c}
        </div>
      ))}
    </div>
  );
  const Section = ({ title }: { title: string }) => (
    <div
      role="row"
      className="sticky left-0 border-b border-line bg-paper-sunk px-4 py-2 text-xs font-semibold text-ink-soft"
    >
      {title}
    </div>
  );

  const scored = benchmarks.filter((b) =>
    models.some((m) => m.benchmarks[b.id] !== undefined),
  );

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-paper-raised">
      <div
        role="table"
        aria-label="Model comparison"
        style={{ minWidth: 200 + models.length * 170 }}
      >
        <div
          role="row"
          className="grid border-b border-line"
          style={{ gridTemplateColumns: cols }}
        >
          <div className="sticky left-0 z-10 bg-paper-raised" />
          {models.map((m) => (
            <div role="columnheader" key={m.slug} className="relative p-4">
              <button
                onClick={() => onRemove(m.slug)}
                aria-label={`Remove ${m.name}`}
                className="absolute right-2 top-2 rounded p-1 text-ink-mute hover:bg-paper-sunk hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
              <LabMark lab={m.lab} size={28} />
              <Link
                href={`/models/${m.slug}`}
                className="mt-2 block pr-6 font-display text-lg font-semibold leading-tight hover:text-cobalt hover:underline"
              >
                {m.name}
              </Link>
              <Link
                href={`/labs/${m.lab.slug}`}
                className="text-xs text-ink-mute hover:underline"
              >
                {m.lab.name}
              </Link>
            </div>
          ))}
        </div>

        <Section title="Overview" />
        <Row label="Type" cells={models.map((m) => TYPE_LABEL[m.type])} />
        <Row
          label="Released"
          cells={models.map((m) => fmtDate(m.releaseDate))}
        />
        <Row
          label="License"
          cells={models.map((m) =>
            m.openWeights ? "Open weights" : "Proprietary",
          )}
        />
        <Row
          label="Parameters"
          cells={models.map((m) => m.parameters ?? "Not disclosed")}
        />
        <Row
          label="Input modalities"
          cells={models.map((m) => (
            <span key={m.slug} className="capitalize">
              {m.inputModalities.join(", ")}
            </span>
          ))}
        />

        <Section title="Pricing and limits" />
        <Row
          label="Input / 1M tokens"
          cells={models.map((m) => fmtPrice(m.inputPrice))}
          best={bestIndexes(
            models.map((m) => m.inputPrice),
            "min",
          )}
        />
        <Row
          label="Output / 1M tokens"
          cells={models.map((m) =>
            m.outputPrice ? fmtPrice(m.outputPrice) : "n/a",
          )}
          best={bestIndexes(
            models.map((m) => (m.outputPrice ? m.outputPrice : undefined)),
            "min",
          )}
        />
        <Row
          label="Context window"
          cells={models.map((m) => fmtContext(m.contextWindow))}
          best={bestIndexes(
            models.map((m) => m.contextWindow),
            "max",
          )}
        />
        <Row
          label="Max output"
          cells={models.map((m) =>
            m.maxOutput ? fmtTokens(m.maxOutput) : "n/a",
          )}
          best={bestIndexes(
            models.map((m) => m.maxOutput || undefined),
            "max",
          )}
        />
        <Row
          label="Providers"
          cells={models.map((m) => m.providers.length)}
          best={bestIndexes(
            models.map((m) => m.providers.length),
            "max",
          )}
        />

        <Section title="Capabilities" />
        {ALL_CAPABILITIES.map((c) => (
          <Row
            key={c}
            label={CAPABILITY_LABEL[c]}
            cells={models.map((m) =>
              m.capabilities.includes(c) ? (
                <Check
                  key={m.slug}
                  className="h-4 w-4 text-good"
                  aria-label="Supported"
                />
              ) : (
                <Minus
                  key={m.slug}
                  className="h-4 w-4 text-ink-mute"
                  aria-label="Not supported"
                />
              ),
            )}
          />
        ))}

        <Section title="Benchmarks" />
        {scored.length === 0 && (
          <div className="px-4 py-4 text-sm text-ink-soft">
            None of these models have published scores.
          </div>
        )}
        {scored.map((b) => (
          <Row
            key={b.id}
            label={b.name}
            cells={models.map((m) =>
              m.benchmarks[b.id] !== undefined
                ? fmtScore(m.benchmarks[b.id], b.unit)
                : "n/a",
            )}
            best={bestIndexes(
              models.map((m) => m.benchmarks[b.id]),
              "max",
            )}
          />
        ))}
      </div>
    </div>
  );
}
