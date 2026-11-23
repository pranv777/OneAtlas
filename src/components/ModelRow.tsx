import Link from "next/link";
import {
  CAPABILITY_LABEL,
  TYPE_LABEL,
  fmtContext,
  fmtDate,
  fmtPrice,
} from "@/lib/format";
import type { Model } from "@/lib/types";
import CompareToggle from "./CompareToggle";
import { Badge, LabMark } from "./ui";

/** Column template shared by ModelTableHeader and ModelRow so they always align. */
export const ROW_GRID =
  "md:grid-cols-[minmax(0,2.6fr)_repeat(4,minmax(0,1fr))]";

export function ModelTableHeader() {
  return (
    <div
      className={`hidden gap-4 border-b border-line px-4 py-2 text-xs font-medium text-ink-mute md:grid ${ROW_GRID}`}
    >
      <span>Model</span>
      <span>Context</span>
      <span>Input / 1M</span>
      <span>Output / 1M</span>
      <span>Released</span>
    </div>
  );
}

export function ModelRow({ model }: { model: Model }) {
  return (
    <div
      className={`group grid grid-cols-2 items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3 last:border-b-0 hover:bg-paper md:gap-y-0 ${ROW_GRID}`}
    >
      <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
        <CompareToggle slug={model.slug} name={model.name} />
        <LabMark lab={model.lab} size={28} />
        <div className="min-w-0">
          <Link
            href={`/models/${model.slug}`}
            className="block truncate font-medium text-ink hover:text-cobalt hover:underline"
          >
            {model.name}
          </Link>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-mute">
            <Link
              href={`/labs/${model.lab.slug}`}
              className="hover:text-ink hover:underline"
            >
              {model.lab.name}
            </Link>
            <Badge>{TYPE_LABEL[model.type]}</Badge>
            {model.openWeights && <Badge tone="good">Open weights</Badge>}
            {model.capabilities.includes("vision") && (
              <span title={CAPABILITY_LABEL.vision}>Vision</span>
            )}
          </div>
        </div>
      </div>
      <Cell label="Context">{fmtContext(model.contextWindow)}</Cell>
      <Cell label="Input / 1M">{fmtPrice(model.inputPrice)}</Cell>
      <Cell label="Output / 1M">
        {model.outputPrice === 0 ? "n/a" : fmtPrice(model.outputPrice)}
      </Cell>
      <Cell label="Released">{fmtDate(model.releaseDate)}</Cell>
    </div>
  );
}

function Cell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-sm tabular-nums text-ink">
      <span className="block text-xs text-ink-mute md:hidden">{label}</span>
      {children}
    </div>
  );
}

export function ModelCard({ model }: { model: Model }) {
  return (
    <article className="flex flex-col rounded-card border border-line bg-paper-raised p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <LabMark lab={model.lab} size={32} />
          <div className="min-w-0">
            <Link
              href={`/models/${model.slug}`}
              className="block truncate font-display text-lg font-semibold text-ink hover:text-cobalt"
            >
              {model.name}
            </Link>
            <Link
              href={`/labs/${model.lab.slug}`}
              className="text-xs text-ink-mute hover:text-ink hover:underline"
            >
              {model.lab.name}
            </Link>
          </div>
        </div>
        <CompareToggle slug={model.slug} name={model.name} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-ink-soft">
        {model.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{TYPE_LABEL[model.type]}</Badge>
        {model.openWeights && <Badge tone="good">Open weights</Badge>}
        {model.capabilities.slice(0, 2).map((c) => (
          <Badge key={c}>{CAPABILITY_LABEL[c]}</Badge>
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 text-sm tabular-nums">
        <div>
          <dt className="text-xs text-ink-mute">Context</dt>
          <dd className="font-medium">{fmtContext(model.contextWindow)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-mute">Input / 1M</dt>
          <dd className="font-medium">{fmtPrice(model.inputPrice)}</dd>
        </div>
        <div>
          <dt className="text-xs text-ink-mute">Output / 1M</dt>
          <dd className="font-medium">
            {model.outputPrice === 0 ? "n/a" : fmtPrice(model.outputPrice)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
