"use client";

import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCompareList } from "./CompareProvider";

export default function CompareToggle({
  slug,
  name,
  variant = "icon",
}: {
  slug: string;
  name: string;
  variant?: "icon" | "button";
}) {
  const { has, toggle, isFull } = useCompareList();
  const active = has(slug);
  const disabled = !active && isFull;
  const label = active
    ? `Remove ${name} from comparison`
    : disabled
      ? "Comparison is full (4 models)"
      : `Add ${name} to comparison`;

  if (variant === "button") {
    return (
      <button
        onClick={() => toggle(slug)}
        disabled={disabled}
        title={label}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          active
            ? "border-cobalt bg-cobalt-tint text-cobalt-dark"
            : "border-line-strong bg-paper-raised text-ink hover:border-ink",
        )}
      >
        {active ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Plus className="h-4 w-4" aria-hidden />
        )}
        {active ? "In comparison" : "Compare"}
      </button>
    );
  }
  return (
    <button
      onClick={() => toggle(slug)}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "border-cobalt bg-cobalt text-white"
          : "border-line-strong bg-paper-raised text-ink-soft hover:border-ink hover:text-ink",
      )}
    >
      {active ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Plus className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
