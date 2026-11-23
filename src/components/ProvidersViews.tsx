"use client";

import { ExternalLink, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { fmtContext, fmtDate, fmtPrice } from "@/lib/format";
import { useDebounced, useProvider, useProviders } from "@/lib/hooks";
import {
  Badge,
  Breadcrumb,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
} from "./ui";

const KINDS = ["", "First-party API", "Cloud platform", "Inference host"];

export function ProvidersDirectory() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const dq = useDebounced(q, 250);
  const { data, isLoading, isError, error, refetch } = useProviders(
    dq || undefined,
    kind || undefined,
  );

  return (
    <>
      <PageHeader
        title="Providers"
        description="Where models are served from: the labs' own APIs, cloud platforms and specialised inference hosts."
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Provider type"
          className="flex flex-wrap gap-1 rounded-md border border-line-strong bg-paper-raised p-1"
        >
          {KINDS.map((k) => (
            <button
              key={k || "all"}
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium",
                kind === k
                  ? "bg-ink text-white"
                  : "text-ink-soft hover:bg-paper-sunk",
              )}
            >
              {k || "All"}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search providers"
            aria-label="Search providers"
            className="h-10 w-full rounded-md border border-line-strong bg-paper-raised pl-9 pr-3 text-sm outline-none focus:border-cobalt"
          />
        </div>
      </div>

      {isError ? (
        <ErrorState
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : data && data.items.length === 0 ? (
        <EmptyState
          title="No providers match"
          hint="Clear the search or pick a different provider type."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/providers/${p.slug}`}
                className="flex h-full flex-col rounded-card border border-line bg-paper-raised p-5 hover:border-ink"
              >
                <h2 className="font-display text-lg font-semibold">{p.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-soft">
                  {p.description}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                  <Badge>{p.kind}</Badge>
                  {p.openAICompatible && (
                    <Badge tone="accent">OpenAI-compatible</Badge>
                  )}
                  <span className="text-xs text-ink-mute">
                    {p.modelCount} models
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

export function ProviderDetail({ slug }: { slug: string }) {
  const { data, isLoading, isError, error, refetch } = useProvider(slug);
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
  const { provider: p, models } = data;

  return (
    <>
      <Breadcrumb
        items={[{ label: "Providers", href: "/providers" }, { label: p.name }]}
      />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {p.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge>{p.kind}</Badge>
            {p.openAICompatible && (
              <Badge tone="accent">OpenAI-compatible API</Badge>
            )}
            {p.regions.map((r) => (
              <Badge key={r}>{r}</Badge>
            ))}
          </div>
          <p className="mt-4 text-ink-soft">{p.description}</p>
        </div>
        <a
          href={p.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-paper-raised px-3 py-2 text-sm font-medium hover:border-ink"
        >
          Website <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </header>

      <section aria-labelledby="supported" className="mt-10">
        <h2 id="supported" className="mb-3 font-display text-xl font-semibold">
          Supported models ({models.length})
        </h2>
        <div className="overflow-x-auto rounded-card border border-line bg-paper-raised">
          <table className="w-full min-w-[640px] text-left text-sm tabular-nums">
            <thead>
              <tr className="border-b border-line text-xs text-ink-mute">
                <th scope="col" className="px-4 py-2 font-medium">
                  Model
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Lab
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Context
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Input / 1M
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Output / 1M
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Speed
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Released
                </th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => {
                const offer = m.providers.find((o) => o.providerSlug === slug);
                return (
                  <tr
                    key={m.slug}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/models/${m.slug}`}
                        className="hover:text-cobalt hover:underline"
                      >
                        {m.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/labs/${m.lab.slug}`}
                        className="hover:underline"
                      >
                        {m.lab.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{fmtContext(m.contextWindow)}</td>
                    <td className="px-4 py-3">
                      {offer ? fmtPrice(offer.inputPrice) : "n/a"}
                    </td>
                    <td className="px-4 py-3">
                      {offer && m.outputPrice
                        ? fmtPrice(offer.outputPrice)
                        : "n/a"}
                    </td>
                    <td className="px-4 py-3">
                      {offer ? `${offer.throughput} tok/s` : "n/a"}
                    </td>
                    <td className="px-4 py-3">{fmtDate(m.releaseDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
