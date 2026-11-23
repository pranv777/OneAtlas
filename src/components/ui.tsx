"use client";

import Link from "next/link";
import { AlertTriangle, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { LabRef } from "@/lib/types";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-paper-sunk", className)}
    />
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "good";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-paper-sunk text-ink-soft",
        tone === "accent" && "bg-cobalt-tint text-cobalt-dark",
        tone === "good" && "bg-[#DCF1E9] text-good",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LabMark({
  lab,
  size = 20,
}: {
  lab: LabRef | { name: string; color: string };
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-md font-display font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: lab.color,
        fontSize: size * 0.5,
      }}
    >
      {lab.name.charAt(0)}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 text-ink-soft">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-card border border-line bg-paper-raised p-6"
    >
      <AlertTriangle className="h-5 w-5 text-warn" aria-hidden />
      <div>
        <p className="font-medium text-ink">We couldn&apos;t load this data</p>
        <p className="mt-1 text-sm text-ink-soft">
          {message ?? "Check your connection and try again."}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-white hover:bg-ink-soft"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong px-6 py-14 text-center">
      <SearchX className="h-6 w-6 text-ink-mute" aria-hidden />
      <p className="mt-3 font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-ink-soft">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-ink-mute">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href ? (
              <Link href={it.href} className="hover:text-ink hover:underline">
                {it.label}
              </Link>
            ) : (
              <span className="text-ink-soft">{it.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ScoreBar({
  value,
  max,
  highlight,
  label,
}: {
  value: number;
  max: number;
  highlight?: boolean;
  label?: string;
}) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-paper-sunk"
    >
      <div
        className={cn(
          "h-full rounded-full",
          highlight ? "bg-cobalt" : "bg-ink-mute/60",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
