"use client";

import { Check, ExternalLink, Minus } from "lucide-react";
import Link from "next/link";
import { useModel } from "@/lib/hooks";
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
import { BENCHMARK_META } from "@/lib/benchmarks";
import CompareToggle from "./CompareToggle";
import { ModelCard } from "./ModelRow";
import {
  Badge,
  Breadcrumb,
  ErrorState,
  LabMark,
  ScoreBar,
  Skeleton,
} from "./ui";

export default function ModelDetail({ slug }: { slug: string }) {
  const { data, isLoading, isError, error, refetch } = useModel(slug);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    );
  }
  if (isError || !data)
    return (
      <ErrorState
        message={(error as Error | null)?.message}
        onRetry={() => refetch()}
      />
    );

  const { model: m, related } = data;
  const cheapest = Math.min(
    ...m.providers.map((p) => p.inputPrice + p.outputPrice),
  );
  const fastest = Math.max(...m.providers.map((p) => p.throughput));
  const scores = Object.entries(m.benchmarks);

  const specs: [string, string][] = [
    ["Context window", `${fmtContext(m.contextWindow)} tokens`],
    ["Max output", m.maxOutput ? `${fmtTokens(m.maxOutput)} tokens` : "n/a"],
    ["Input price", `${fmtPrice(m.inputPrice)} / 1M tokens`],
    [
      "Output price",
      m.outputPrice ? `${fmtPrice(m.outputPrice)} / 1M tokens` : "n/a",
    ],
    ["Released", fmtDate(m.releaseDate)],
    ["Parameters", m.parameters ?? "Not disclosed"],
    ["License", m.openWeights ? "Open weights" : "Proprietary"],
    ["Providers", String(m.providers.length)],
  ];

  return (
    <article>
      <Breadcrumb
        items={[{ label: "Models", href: "/models" }, { label: m.name }]}
      />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <LabMark lab={m.lab} size={40} />
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {m.name}
              </h1>
              <Link
                href={`/labs/${m.lab.slug}`}
                className="text-sm text-ink-soft hover:text-cobalt hover:underline"
              >
                by {m.lab.name}
              </Link>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge tone="accent">{TYPE_LABEL[m.type]}</Badge>
            {m.openWeights && <Badge tone="good">Open weights</Badge>}
          </div>
          <p className="mt-4 text-lg text-ink-soft">{m.description}</p>
        </div>
        <CompareToggle slug={m.slug} name={m.name} variant="button" />
      </header>

      <section aria-labelledby="specs" className="mt-10">
        <h2 id="specs" className="mb-3 font-display text-xl font-semibold">
          Specifications
        </h2>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-4">
          {specs.map(([k, v]) => (
            <div key={k} className="bg-paper-raised p-4">
              <dt className="text-xs text-ink-mute">{k}</dt>
              <dd className="mt-1 font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="modalities">
          <h2
            id="modalities"
            className="mb-3 font-display text-xl font-semibold"
          >
            Modalities
          </h2>
          <div className="rounded-card border border-line bg-paper-raised p-4 text-sm">
            <p>
              <span className="text-ink-mute">Input:</span>{" "}
              <span className="font-medium capitalize">
                {m.inputModalities.join(", ")}
              </span>
            </p>
            <p className="mt-1">
              <span className="text-ink-mute">Output:</span>{" "}
              <span className="font-medium capitalize">
                {m.outputModalities.join(", ")}
              </span>
            </p>
          </div>
        </section>

        <section aria-labelledby="caps">
          <h2 id="caps" className="mb-3 font-display text-xl font-semibold">
            Capabilities
          </h2>
          <ul className="grid grid-cols-2 gap-2 rounded-card border border-line bg-paper-raised p-4 text-sm">
            {ALL_CAPABILITIES.map((c) => {
              const has = m.capabilities.includes(c);
              return (
                <li
                  key={c}
                  className={`flex items-center gap-2 ${has ? "text-ink" : "text-ink-mute"}`}
                >
                  {has ? (
                    <Check
                      className="h-4 w-4 text-good"
                      aria-label="Supported"
                    />
                  ) : (
                    <Minus className="h-4 w-4" aria-label="Not supported" />
                  )}
                  {CAPABILITY_LABEL[c]}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section aria-labelledby="providers" className="mt-10">
        <h2 id="providers" className="mb-3 font-display text-xl font-semibold">
          Available providers
        </h2>
        <div className="overflow-x-auto rounded-card border border-line bg-paper-raised">
          <table className="w-full min-w-[560px] text-left text-sm tabular-nums">
            <thead>
              <tr className="border-b border-line text-xs text-ink-mute">
                <th scope="col" className="px-4 py-2 font-medium">
                  Provider
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Input / 1M
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Output / 1M
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  First token
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  Speed
                </th>
              </tr>
            </thead>
            <tbody>
              {m.providers.map((p) => (
                <tr
                  key={p.providerSlug}
                  className="border-b border-line last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/providers/${p.providerSlug}`}
                      className="hover:text-cobalt hover:underline"
                    >
                      {p.providerName}
                    </Link>
                    {p.inputPrice + p.outputPrice === cheapest &&
                      m.providers.length > 1 && (
                        <Badge tone="good" className="ml-2">
                          Lowest price
                        </Badge>
                      )}
                    {p.throughput === fastest && m.providers.length > 1 && (
                      <Badge tone="accent" className="ml-2">
                        Fastest
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">{fmtPrice(p.inputPrice)}</td>
                  <td className="px-4 py-3">
                    {m.outputPrice ? fmtPrice(p.outputPrice) : "n/a"}
                  </td>
                  <td className="px-4 py-3">{p.latencyMs} ms</td>
                  <td className="px-4 py-3">{p.throughput} tok/s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="bench" className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="bench" className="font-display text-xl font-semibold">
            Benchmarks
          </h2>
          <Link
            href="/rankings"
            className="inline-flex items-center gap-1 text-sm font-medium text-cobalt hover:underline"
          >
            See rankings <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
        {scores.length === 0 ? (
          <p className="rounded-card border border-dashed border-line-strong p-6 text-sm text-ink-soft">
            No benchmark scores are published for this model yet.
          </p>
        ) : (
          <ul className="divide-y divide-line rounded-card border border-line bg-paper-raised">
            {scores.map(([id, score]) => {
              const meta = BENCHMARK_META[id];
              return (
                <li
                  key={id}
                  className="grid grid-cols-[minmax(0,1fr)_72px] items-center gap-x-4 gap-y-2 px-4 py-3 sm:grid-cols-[220px_minmax(0,1fr)_72px]"
                >
                  <div>
                    <p className="text-sm font-medium">{meta?.name ?? id}</p>
                    <p className="text-xs text-ink-mute">{meta?.category}</p>
                  </div>
                  <div className="order-last col-span-2 sm:order-none sm:col-span-1">
                    <ScoreBar
                      value={score}
                      max={meta?.max ?? 100}
                      highlight
                      label={meta?.name ?? id}
                    />
                  </div>
                  <p className="text-right text-sm font-medium tabular-nums">
                    {fmtScore(score, meta?.unit ?? "%")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-10">
          <h2 id="related" className="mb-3 font-display text-xl font-semibold">
            Similar models
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((r) => (
              <ModelCard key={r.slug} model={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
