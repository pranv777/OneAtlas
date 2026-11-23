"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { TYPE_LABEL, fmtPrice, fmtScore } from "@/lib/format";
import { useRankings } from "@/lib/hooks";
import {
  EmptyState,
  ErrorState,
  LabMark,
  PageHeader,
  ScoreBar,
  Skeleton,
} from "./ui";

const TYPES = [
  { value: "", label: "All types" },
  { value: "chat", label: "Chat" },
  { value: "reasoning", label: "Reasoning" },
  { value: "code", label: "Code" },
];

export default function RankingsView() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const benchmark = sp.get("benchmark") ?? "overall";
  const type = sp.get("type") ?? "";
  const { data, isLoading, isError, error, refetch, isFetching } = useRankings(
    benchmark,
    type || undefined,
  );

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (!v || (k === "benchmark" && v === "overall")) next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const tabs = [
    { id: "overall", name: "Overall" },
    ...(data?.benchmarks ?? []).map((b) => ({ id: b.id, name: b.name })),
  ];

  return (
    <>
      <PageHeader
        title="Rankings"
        description="Leaderboards built from published benchmark scores. Filter by model type, or switch benchmark to see who leads at what."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Benchmark"
          className="flex max-w-full gap-1 overflow-x-auto rounded-md border border-line-strong bg-paper-raised p-1"
        >
          {(data ? tabs : [{ id: "overall", name: "Overall" }]).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={benchmark === t.id}
              onClick={() => update({ benchmark: t.id })}
              className={cn(
                "shrink-0 rounded px-3 py-1.5 text-sm font-medium",
                benchmark === t.id
                  ? "bg-ink text-white"
                  : "text-ink-soft hover:bg-paper-sunk",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="type" className="text-sm text-ink-soft">
            Model type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => update({ type: e.target.value })}
            className="h-10 rounded-md border border-line-strong bg-paper-raised px-3 text-sm outline-none focus:border-cobalt"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isError ? (
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : (
        <section
          role="tabpanel"
          aria-label={data.selected.name}
          className={cn(isFetching && "opacity-70 transition-opacity")}
        >
          <div className="mb-4 rounded-card border border-line bg-paper-raised p-4">
            <h2 className="font-display text-xl font-semibold">
              {data.selected.name}
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-ink-soft">
              {data.selected.description}
            </p>
          </div>

          {data.entries.length === 0 ? (
            <EmptyState
              title="No scored models for this filter"
              hint="Try a different model type or benchmark."
            />
          ) : (
            <ol className="overflow-hidden rounded-card border border-line bg-paper-raised">
              {data.entries.map((e) => (
                <li
                  key={e.model.slug}
                  className="grid grid-cols-[32px_minmax(0,1fr)_72px] items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[40px_minmax(0,1.2fr)_minmax(0,1.4fr)_72px_110px]"
                >
                  <span
                    className={cn(
                      "font-display text-lg font-semibold tabular-nums",
                      e.rank <= 3 ? "text-cobalt" : "text-ink-mute",
                    )}
                  >
                    {e.rank}
                  </span>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <LabMark lab={e.model.lab} size={28} />
                    <div className="min-w-0">
                      <Link
                        href={`/models/${e.model.slug}`}
                        className="block truncate font-medium hover:text-cobalt hover:underline"
                      >
                        {e.model.name}
                      </Link>
                      <p className="truncate text-xs text-ink-mute">
                        {e.model.lab.name} · {TYPE_LABEL[e.model.type]}
                      </p>
                    </div>
                  </div>
                  <span className="text-right text-sm font-semibold tabular-nums sm:order-4">
                    {fmtScore(e.score, data.selected.unit)}
                  </span>
                  <div className="col-span-3 sm:order-3 sm:col-span-1">
                    <ScoreBar
                      value={e.score}
                      max={data.selected.max}
                      highlight={e.rank <= 3}
                      label={`${e.model.name} score`}
                    />
                  </div>
                  <span className="hidden text-right text-xs tabular-nums text-ink-mute sm:order-5 sm:block">
                    from {fmtPrice(e.model.inputPrice)}/1M
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </>
  );
}
