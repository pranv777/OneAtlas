import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24">
      <h1 className="font-display text-4xl font-semibold">
        That page isn&apos;t on the map
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">
        The address may be mistyped, or the model or lab may have been removed.
      </p>
      <Link
        href="/models"
        className="mt-6 inline-block rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-soft"
      >
        Browse all models
      </Link>
    </div>
  );
}
