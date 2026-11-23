"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useCompareList } from "./CompareProvider";
import SearchPalette from "./SearchPalette";

const NAV = [
  { href: "/models", label: "Models" },
  { href: "/compare", label: "Compare" },
  { href: "/rankings", label: "Rankings" },
  { href: "/labs", label: "Labs" },
  { href: "/providers", label: "Providers" },
];

export default function Header() {
  const pathname = usePathname();
  const { slugs } = useCompareList();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            <circle
              cx="11"
              cy="11"
              r="9.5"
              fill="none"
              stroke="#2447E8"
              strokeWidth="1.8"
            />
            <path d="M11 4.5 13.2 11 11 17.5 8.8 11Z" fill="#2447E8" />
          </svg>
          OneAtlas
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active =
              pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-paper-sunk hover:text-ink",
                )}
              >
                {n.label}
                {n.href === "/compare" && slugs.length > 0 && (
                  <span
                    className={cn(
                      "ml-1.5 rounded-full px-1.5 text-xs",
                      active ? "bg-white/20" : "bg-cobalt text-white",
                    )}
                  >
                    {slugs.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 items-center gap-2 rounded-md border border-line-strong bg-paper-raised px-3 text-sm text-ink-mute hover:border-ink sm:w-60"
            aria-label="Search (Ctrl or Command K)"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden flex-1 text-left sm:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1.5 text-xs sm:inline">
              Ctrl K
            </kbd>
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-paper-raised md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden />
            ) : (
              <Menu className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-line bg-paper-raised px-4 py-2 md:hidden"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink hover:bg-paper-sunk"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
