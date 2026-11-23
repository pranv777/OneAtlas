"use client";

import { Building2, Cpu, Search, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useDebounced, useSearch } from "@/lib/hooks";

interface Item {
  key: string;
  href: string;
  title: string;
  meta: string;
  group: "Models" | "Labs" | "Providers";
}

const ICON = { Models: Cpu, Labs: Building2, Providers: Server } as const;

export default function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounced(q, 200);
  const { data, isFetching } = useSearch(debounced);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    if (!data || !debounced.trim()) return [];
    return [
      ...data.models.map((m) => ({
        key: `m-${m.slug}`,
        href: `/models/${m.slug}`,
        title: m.name,
        meta: m.labName,
        group: "Models" as const,
      })),
      ...data.labs.map((l) => ({
        key: `l-${l.slug}`,
        href: `/labs/${l.slug}`,
        title: l.name,
        meta: l.kind,
        group: "Labs" as const,
      })),
      ...data.providers.map((p) => ({
        key: `p-${p.slug}`,
        href: `/providers/${p.slug}`,
        title: p.name,
        meta: p.kind,
        group: "Providers" as const,
      })),
    ];
  }, [data, debounced]);

  useEffect(() => setActive(0), [items.length]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(items.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[active]) go(items[active].href);
      else if (q.trim()) go(`/models?q=${encodeURIComponent(q.trim())}`);
    }
  };

  let lastGroup = "";
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh]"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search OneAtlas"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="w-full max-w-xl overflow-hidden rounded-card border border-line bg-paper-raised shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 text-ink-mute" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search models, labs and providers"
            aria-label="Search"
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls="search-results"
            className="h-12 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-mute"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-xs text-ink-mute">
            Esc
          </kbd>
        </div>
        <ul
          id="search-results"
          role="listbox"
          className="max-h-80 overflow-y-auto p-2"
        >
          {items.map((it, i) => {
            const showGroup = it.group !== lastGroup;
            lastGroup = it.group;
            const Icon = ICON[it.group];
            return (
              <li key={it.key} role="presentation">
                {showGroup && (
                  <p className="px-2 pb-1 pt-2 text-xs font-medium text-ink-mute">
                    {it.group}
                  </p>
                )}
                <button
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(it.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left",
                    i === active && "bg-cobalt-tint",
                  )}
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-ink-mute"
                    aria-hidden
                  />
                  <span className="flex-1 truncate font-medium text-ink">
                    {it.title}
                  </span>
                  <span className="text-xs text-ink-mute">{it.meta}</span>
                </button>
              </li>
            );
          })}
          {debounced.trim() && !isFetching && items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-ink-soft">
              Nothing matches &ldquo;{debounced}&rdquo;. Press Enter to search
              all models.
            </li>
          )}
          {!debounced.trim() && (
            <li className="px-3 py-6 text-center text-sm text-ink-soft">
              Try &ldquo;claude&rdquo;, &ldquo;open weights&rdquo; or
              &ldquo;groq&rdquo;.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
