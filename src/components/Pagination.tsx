import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const btn =
    "inline-flex h-9 items-center gap-1 rounded-md border border-line-strong bg-paper-raised px-3 text-sm font-medium text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-between"
    >
      <button
        className={btn}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden /> Previous
      </button>
      <span className="text-sm text-ink-soft tabular-nums" aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button
        className={btn}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
