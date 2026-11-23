"use client";

import { ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDebounced, useLab, useLabs } from "@/lib/hooks";
import { fmtDate } from "@/lib/format";
import { ModelRow, ModelTableHeader } from "./ModelRow";
import {
  Badge,
  Breadcrumb,
  EmptyState,
  ErrorState,
  LabMark,
  PageHeader,
  Skeleton,
} from "./ui";

export function LabsDirectory() {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250);
  const { data, isLoading, isError, error, refetch } = useLabs(dq || undefined);

  return (
    <>
      <PageHeader
        title="AI labs"
        description="The companies and research groups building foundation models. Open a lab to see its releases and where they are hosted."
      >
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search labs"
            aria-label="Search labs"
            className="h-10 w-full rounded-md border border-line-strong bg-paper-raised pl-9 pr-3 text-sm outline-none focus:border-cobalt"
          />
        </div>
      </PageHeader>

      {isError ? (
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title="No labs match your search"
          hint="Try a different name or country."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/labs/${l.slug}`}
                className="flex h-full flex-col rounded-card border border-line bg-paper-raised p-5 hover:border-ink"
              >
                <div className="flex items-center gap-3">
                  <LabMark lab={l} size={36} />
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-tight">
                      {l.name}
                    </h2>
                    <p className="text-xs text-ink-mute">
                      {l.country} · founded {l.founded}
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-ink-soft">
                  {l.description}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <Badge>{l.kind}</Badge>
                  <span className="text-xs text-ink-mute">
                    {l.modelCount} model{l.modelCount === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function LabDetail({ slug }: { slug: string }) {
  const { data, isLoading, isError, error, refetch } = useLab(slug);
  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-64" />
      </div>
    );
  if (isError || !data)
    return (
      <ErrorState
        message={(error as Error | null)?.message}
        onRetry={() => refetch()}
      />
    );
  const { lab, models, providers } = data;

  return (
    <>
      <Breadcrumb
        items={[{ label: "Labs", href: "/labs" }, { label: lab.name }]}
      />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex max-w-3xl items-start gap-4">
          <LabMark lab={lab} size={52} />
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {lab.name}
            </h1>
            <p className="mt-1 text-sm text-ink-mute">
              {lab.country} · founded {lab.founded} · {lab.kind}
            </p>
            <p className="mt-3 text-ink-soft">{lab.description}</p>
          </div>
        </div>
        <a
          href={lab.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-paper-raised px-3 py-2 text-sm font-medium hover:border-ink"
        >
          Website <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </header>

      <section aria-labelledby="models" className="mt-10">
        <h2 id="models" className="mb-3 font-display text-xl font-semibold">
          Models ({models.length})
        </h2>
        <div className="overflow-hidden rounded-card border border-line bg-paper-raised">
          <ModelTableHeader />
          {models.map((m) => (
            <ModelRow key={m.slug} model={m} />
          ))}
        </div>
      </section>

      <section aria-labelledby="timeline" className="mt-10">
        <h2 id="timeline" className="mb-3 font-display text-xl font-semibold">
          Release history
        </h2>
        <ol className="space-y-3 border-l border-line-strong pl-5">
          {models.map((m) => (
            <li key={m.slug} className="relative">
              <span
                aria-hidden
                className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-cobalt"
              />
              <p className="text-xs text-ink-mute">{fmtDate(m.releaseDate)}</p>
              <Link
                href={`/models/${m.slug}`}
                className="font-medium hover:text-cobalt hover:underline"
              >
                {m.name}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="hosts" className="mt-10">
        <h2 id="hosts" className="mb-3 font-display text-xl font-semibold">
          Where to run these models
        </h2>
        <ul className="flex flex-wrap gap-2">
          {providers.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/providers/${p.slug}`}
                className="inline-block rounded-md border border-line-strong bg-paper-raised px-3 py-1.5 text-sm font-medium hover:border-ink"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
