"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCompareList } from "./CompareProvider";

export default function CompareTray() {
  const { slugs, clear, remove } = useCompareList();
  const pathname = usePathname();
  if (slugs.length === 0 || pathname.startsWith("/compare")) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="flex w-full max-w-xl items-center gap-3 rounded-card border border-ink bg-ink p-2 pl-4 text-white shadow-lg">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {slugs.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded bg-white/15 py-0.5 pl-2 pr-1 text-xs"
            >
              {s}
              <button
                onClick={() => remove(s)}
                aria-label={`Remove ${s}`}
                className="rounded p-0.5 hover:bg-white/20"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={clear}
          className="text-xs text-white/70 hover:text-white"
        >
          Clear
        </button>
        <Link
          href={`/compare?models=${slugs.join(",")}`}
          className={`rounded-md px-3 py-2 text-sm font-medium ${slugs.length < 2 ? "pointer-events-none bg-white/20 text-white/60" : "bg-white text-ink hover:bg-paper"}`}
          aria-disabled={slugs.length < 2}
        >
          Compare {slugs.length}
        </Link>
      </div>
    </div>
  );
}
