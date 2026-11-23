"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fmtScore } from "@/lib/format";
import { useLabs, useModels, useRankings, useStats } from "@/lib/hooks";
import { ModelRow, ModelTableHeader } from "./ModelRow";
import { ErrorState, LabMark, ScoreBar, Skeleton } from "./ui";

const SUGGESTIONS = ["Open weights", "Reasoning", "Vision", "Code"];

export default function HomeView() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const stats = useStats();
  const latest = useModels({ sort: "newest", pageSize: 6 });
  const top = useRankings("overall");
  const labs = useLabs();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      q.trim() ? `/models?q=${encodeURIComponent(q.trim())}` : "/models",
    );
  };

  return (
    <div className="space-y-16">
      <section
        aria-labelledby="hero"
        className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center"
      >
        <div>
          <h1
            id="hero"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Every model, priced and measured.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-soft">
            Find the right AI model for your product. Compare cost, context and
            capability across labs and the providers that host them.
          </p>
          <form
            onSubmit={submit}
            className="mt-7 flex max-w-lg gap-2"
            role="search"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
                aria-hidden
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search models"
                placeholder="Search models, e.g. claude or llama"
                className="h-12 w-full rounded-md border border-line-strong bg-paper-raised pl-9 pr-3 outline-none focus:border-cobalt"
              />
            </div>
            <button className="h-12 rounded-md bg-cobalt px-5 font-medium text-white hover:bg-cobalt-dark">
              Search
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href="/models?openWeights=true"
              className="rounded-full border border-line-strong px-3 py-1 hover:border-ink"
            >
              {SUGGESTIONS[0]}
            </Link>
            <Link
              href="/models?types=reasoning"
              className="rounded-full border border-line-strong px-3 py-1 hover:border-ink"
            >
              {SUGGESTIONS[1]}
            </Link>
            <Link
              href="/models?capabilities=vision"
              className="rounded-full border border-line-strong px-3 py-1 hover:border-ink"
            >
              {SUGGESTIONS[2]}
            </Link>
            <Link
              href="/models?types=code"
              className="rounded-full border border-line-strong px-3 py-1 hover:border-ink"
            >
              {SUGGESTIONS[3]}
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-mute tabular-nums">
            {stats.data ? (
              `${stats.data.models} models · ${stats.data.labs} labs · ${stats.data.providers} providers · ${stats.data.benchmarks} benchmarks`
            ) : (
              <span
                aria-hidden
                className="inline-block h-4 w-64 max-w-full animate-pulse rounded-md bg-paper-sunk align-middle"
              />
            )}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold">
              Latest releases
            </h2>
            <Link
              href="/models"
              className="inline-flex items-center gap-1 text-sm font-medium text-cobalt hover:underline"
            >
              All models <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          {latest.isError ? (
            <ErrorState
              message={(latest.error as Error).message}
              onRetry={() => latest.refetch()}
            />
          ) : latest.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-card border border-line bg-paper-raised">
              <ModelTableHeader />
              {latest.data?.items.map((m) => (
                <ModelRow key={m.slug} model={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="top">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="top" className="font-display text-2xl font-semibold">
            Top of the overall index
          </h2>
          <Link
            href="/rankings"
            className="inline-flex items-center gap-1 text-sm font-medium text-cobalt hover:underline"
          >
            Full rankings <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {top.isLoading ? (
          <Skeleton className="h-60" />
        ) : top.isError ? (
          <ErrorState
            message={(top.error as Error).message}
            onRetry={() => top.refetch()}
          />
        ) : (
          <ol className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper-raised">
            {top.data?.entries.slice(0, 5).map((e) => (
              <li
                key={e.model.slug}
                className="grid grid-cols-[28px_minmax(0,1fr)_64px] items-center gap-x-3 gap-y-2 px-4 py-3 sm:grid-cols-[28px_minmax(0,1fr)_minmax(0,1.5fr)_64px]"
              >
                <span className="font-display font-semibold text-cobalt">
                  {e.rank}
                </span>
                <Link
                  href={`/models/${e.model.slug}`}
                  className="truncate font-medium hover:text-cobalt hover:underline"
                >
                  {e.model.name}
                </Link>
                <span className="text-right text-sm font-semibold tabular-nums sm:order-4">
                  {fmtScore(e.score, "%")}
                </span>
                <div className="col-span-3 sm:col-span-1">
                  <ScoreBar
                    value={e.score}
                    max={100}
                    highlight
                    label={e.model.name}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-labelledby="labs">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="labs" className="font-display text-2xl font-semibold">
            Browse by lab
          </h2>
          <Link
            href="/labs"
            className="inline-flex items-center gap-1 text-sm font-medium text-cobalt hover:underline"
          >
            All labs <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {labs.isLoading ? (
          <Skeleton className="h-24" />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {labs.data?.items.slice(0, 10).map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/labs/${l.slug}`}
                  className="flex items-center gap-2.5 rounded-card border border-line bg-paper-raised p-3 hover:border-ink"
                >
                  <LabMark lab={l} size={28} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{l.name}</p>
                    <p className="text-xs text-ink-mute">
                      {l.modelCount} model{l.modelCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
