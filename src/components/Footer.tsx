import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-ink-mute sm:px-6">
        <p>
          OneAtlas. Model specs, pricing and benchmarks shown here are sample
          data.
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          <Link href="/models" className="hover:text-ink">
            Models
          </Link>
          <Link href="/rankings" className="hover:text-ink">
            Rankings
          </Link>
          <Link href="/labs" className="hover:text-ink">
            Labs
          </Link>
          <Link href="/providers" className="hover:text-ink">
            Providers
          </Link>
        </nav>
      </div>
    </footer>
  );
}
