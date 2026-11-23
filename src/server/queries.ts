/**
 * Query layer for the mock API. Mirrors what a real backend (SQL + indexes) would do:
 * filtering, sorting, pagination, ranking and search happen here, never in the browser.
 */
import { BENCHMARKS, LABS, MODELS, PROVIDERS, type ModelRecord } from "./data";
import type {
  Facets,
  Lab,
  Model,
  ModelFilters,
  Paginated,
  Provider,
  ProviderOffer,
  RankingsResponse,
  SearchResults,
  SortKey,
  Stats,
} from "@/lib/types";

const labBySlug = new Map(LABS.map((l) => [l.slug, l]));
const providerBySlug = new Map(PROVIDERS.map((p) => [p.slug, p]));

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const BASE_LATENCY: Record<string, number> = {
  groq: 190,
  fireworks: 320,
  together: 380,
  deepinfra: 460,
};
const BASE_SPEED: Record<string, number> = {
  groq: 420,
  fireworks: 130,
  together: 95,
  deepinfra: 60,
};

function round(n: number): number {
  return n < 1 ? Math.round(n * 1000) / 1000 : Math.round(n * 100) / 100;
}

function buildOffers(m: ModelRecord): ProviderOffer[] {
  return m.providers.map((slug) => {
    const p = providerBySlug.get(slug)!;
    const h = hash(`${m.slug}:${slug}`);
    const hosted =
      p.kind === "Inference host" ||
      (m.openWeights && p.kind === "Cloud platform");
    const factor = hosted ? 0.8 + h * 0.5 : 1;
    return {
      providerSlug: slug,
      providerName: p.name,
      inputPrice: round(m.inputPrice * factor),
      outputPrice: round(m.outputPrice * factor),
      latencyMs: Math.round((BASE_LATENCY[slug] ?? 520) * (0.8 + h * 0.5)),
      throughput: Math.round((BASE_SPEED[slug] ?? 75) * (0.8 + h * 0.5)),
    };
  });
}

function hydrate(m: ModelRecord): Model {
  const lab = labBySlug.get(m.lab)!;
  const providers = buildOffers(m);
  const cheapestIn = providers.length
    ? Math.min(...providers.map((p) => p.inputPrice))
    : m.inputPrice;
  const cheapestOut = providers.length
    ? Math.min(...providers.map((p) => p.outputPrice))
    : m.outputPrice;
  return {
    slug: m.slug,
    name: m.name,
    lab: { slug: lab.slug, name: lab.name, color: lab.color },
    type: m.type,
    releaseDate: m.releaseDate,
    contextWindow: m.contextWindow,
    maxOutput: m.maxOutput,
    inputPrice: cheapestIn,
    outputPrice: cheapestOut,
    inputModalities: m.inputModalities,
    outputModalities: m.outputModalities,
    capabilities: m.capabilities,
    openWeights: m.openWeights,
    parameters: m.parameters,
    description: m.description,
    providers,
    benchmarks: m.benchmarks,
  };
}

const ALL_MODELS: Model[] = MODELS.map(hydrate);
const modelBySlug = new Map(ALL_MODELS.map((m) => [m.slug, m]));

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const blended = (m: Model) => (3 * m.inputPrice + m.outputPrice) / 4;

const SORTS: Record<SortKey, (a: Model, b: Model) => number> = {
  newest: (a, b) => b.releaseDate.localeCompare(a.releaseDate),
  "price-asc": (a, b) => blended(a) - blended(b),
  "price-desc": (a, b) => blended(b) - blended(a),
  "context-desc": (a, b) => b.contextWindow - a.contextWindow,
  "context-asc": (a, b) => a.contextWindow - b.contextWindow,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function isSortKey(v: string): v is SortKey {
  return v in SORTS;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function matchesQuery(m: Model, q: string): boolean {
  const hay = norm(
    `${m.name} ${m.lab.name} ${m.type} ${m.description} ${m.providers.map((p) => p.providerName).join(" ")}`,
  );
  return norm(q)
    .split(" ")
    .every((t) => hay.includes(t));
}

export function listModels(f: ModelFilters): Paginated<Model> {
  const page = Math.max(1, f.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, f.pageSize ?? 12));
  let items = ALL_MODELS.filter((m) => {
    if (f.q && !matchesQuery(m, f.q)) return false;
    if (f.labs?.length && !f.labs.includes(m.lab.slug)) return false;
    if (f.types?.length && !f.types.includes(m.type)) return false;
    if (
      f.providers?.length &&
      !m.providers.some((p) => f.providers!.includes(p.providerSlug))
    )
      return false;
    if (
      f.capabilities?.length &&
      !f.capabilities.every((c) => m.capabilities.includes(c as never))
    )
      return false;
    if (
      f.modalities?.length &&
      !f.modalities.every((c) => m.inputModalities.includes(c as never))
    )
      return false;
    if (f.openWeights && !m.openWeights) return false;
    return true;
  });
  items = [...items].sort(SORTS[f.sort ?? "newest"]);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export function getModel(slug: string): { model: Model; related: Model[] } {
  const model = modelBySlug.get(slug);
  if (!model) throw new HttpError(404, `No model with slug "${slug}"`);
  const related = ALL_MODELS.filter(
    (m) =>
      m.slug !== slug &&
      (m.lab.slug === model.lab.slug || m.type === model.type),
  )
    .sort(
      (a, b) =>
        Number(b.lab.slug === model.lab.slug) -
          Number(a.lab.slug === model.lab.slug) ||
        b.releaseDate.localeCompare(a.releaseDate),
    )
    .slice(0, 4);
  return { model, related };
}

export function compareModels(slugs: string[]): {
  models: Model[];
  benchmarks: typeof BENCHMARKS;
} {
  const unique = Array.from(new Set(slugs));
  if (unique.length < 1 || unique.length > 4)
    throw new HttpError(400, "Provide between 1 and 4 model slugs");
  const models = unique.map((s) => {
    const m = modelBySlug.get(s);
    if (!m) throw new HttpError(404, `No model with slug "${s}"`);
    return m;
  });
  return { models, benchmarks: BENCHMARKS };
}

const OVERALL_IDS = ["mmlu_pro", "gpqa", "swe_bench", "humaneval", "math500"];

export function getRankings(
  benchmark: string,
  type?: string,
): RankingsResponse {
  const isOverall = benchmark === "overall";
  const def = BENCHMARKS.find((b) => b.id === benchmark);
  if (!isOverall && !def)
    throw new HttpError(400, `Unknown benchmark "${benchmark}"`);

  const scored = ALL_MODELS.filter((m) => !type || m.type === type)
    .map((m) => {
      if (!isOverall) return { m, score: m.benchmarks[benchmark] };
      const vals = OVERALL_IDS.map((id) => m.benchmarks[id]).filter(
        (v): v is number => v !== undefined,
      );
      return {
        m,
        score:
          vals.length >= 3
            ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) /
              10
            : undefined,
      };
    })
    .filter((x): x is { m: Model; score: number } => x.score !== undefined)
    .sort((a, b) => b.score - a.score);

  return {
    selected: isOverall
      ? {
          id: "overall",
          name: "Overall index",
          description:
            "Average of MMLU-Pro, GPQA, SWE-bench, HumanEval and MATH-500. Models need at least three scores to appear.",
          unit: "%",
          max: 100,
        }
      : {
          id: def!.id,
          name: def!.name,
          description: def!.description,
          unit: def!.unit,
          max: def!.max,
        },
    benchmarks: BENCHMARKS,
    entries: scored.map((x, i) => ({
      rank: i + 1,
      score: x.score,
      model: x.m,
    })),
  };
}

function countModelsByLab(slug: string) {
  return ALL_MODELS.filter((m) => m.lab.slug === slug).length;
}
function countModelsByProvider(slug: string) {
  return ALL_MODELS.filter((m) =>
    m.providers.some((p) => p.providerSlug === slug),
  ).length;
}

const toLab = (l: (typeof LABS)[number]): Lab => ({
  ...l,
  modelCount: countModelsByLab(l.slug),
});
const toProvider = (p: (typeof PROVIDERS)[number]): Provider => ({
  ...p,
  modelCount: countModelsByProvider(p.slug),
});

export function listLabs(q?: string): Lab[] {
  return LABS.filter(
    (l) =>
      !q || norm(`${l.name} ${l.country} ${l.description}`).includes(norm(q)),
  ).map(toLab);
}

export function getLab(slug: string): {
  lab: Lab;
  models: Model[];
  providers: Provider[];
} {
  const rec = labBySlug.get(slug);
  if (!rec) throw new HttpError(404, `No lab with slug "${slug}"`);
  const models = ALL_MODELS.filter((m) => m.lab.slug === slug).sort(
    SORTS.newest,
  );
  const slugs = new Set(
    models.flatMap((m) => m.providers.map((p) => p.providerSlug)),
  );
  return {
    lab: toLab(rec),
    models,
    providers: PROVIDERS.filter((p) => slugs.has(p.slug)).map(toProvider),
  };
}

export function listProviders(q?: string, kind?: string): Provider[] {
  return PROVIDERS.filter(
    (p) =>
      (!kind || p.kind === kind) &&
      (!q || norm(`${p.name} ${p.description}`).includes(norm(q))),
  ).map(toProvider);
}

export function getProvider(slug: string): {
  provider: Provider;
  models: Model[];
} {
  const rec = providerBySlug.get(slug);
  if (!rec) throw new HttpError(404, `No provider with slug "${slug}"`);
  const models = ALL_MODELS.filter((m) =>
    m.providers.some((p) => p.providerSlug === slug),
  ).sort(SORTS.newest);
  return { provider: toProvider(rec), models };
}

export function search(q: string): SearchResults {
  const term = norm(q);
  if (!term) return { models: [], labs: [], providers: [] };
  return {
    models: ALL_MODELS.filter((m) => matchesQuery(m, q))
      .slice(0, 6)
      .map((m) => ({
        slug: m.slug,
        name: m.name,
        type: m.type,
        labName: m.lab.name,
      })),
    labs: LABS.filter((l) => norm(l.name).includes(term))
      .slice(0, 3)
      .map((l) => ({ slug: l.slug, name: l.name, kind: l.kind })),
    providers: PROVIDERS.filter((p) => norm(p.name).includes(term))
      .slice(0, 3)
      .map((p) => ({ slug: p.slug, name: p.name, kind: p.kind })),
  };
}

function tally<T>(items: T[], pick: (i: T) => string[]): Map<string, number> {
  const m = new Map<string, number>();
  items.forEach((i) => pick(i).forEach((k) => m.set(k, (m.get(k) ?? 0) + 1)));
  return m;
}

const CAP_LABELS: Record<string, string> = {
  tools: "Tool calling",
  vision: "Vision",
  json: "Structured output",
  reasoning: "Reasoning",
  caching: "Prompt caching",
  streaming: "Streaming",
};
const TYPE_LABELS: Record<string, string> = {
  chat: "Chat",
  reasoning: "Reasoning",
  code: "Code",
  embedding: "Embedding",
};
const MODALITY_LABELS: Record<string, string> = {
  text: "Text",
  image: "Image input",
  audio: "Audio input",
  video: "Video input",
};

export function getFacets(): Facets {
  const opts = (counts: Map<string, number>, label: (v: string) => string) =>
    Array.from(counts.entries())
      .map(([value, count]) => ({ value, label: label(value), count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return {
    labs: opts(
      tally(ALL_MODELS, (m) => [m.lab.slug]),
      (v) => labBySlug.get(v)!.name,
    ),
    providers: opts(
      tally(ALL_MODELS, (m) => m.providers.map((p) => p.providerSlug)),
      (v) => providerBySlug.get(v)!.name,
    ),
    types: opts(
      tally(ALL_MODELS, (m) => [m.type]),
      (v) => TYPE_LABELS[v] ?? v,
    ),
    capabilities: opts(
      tally(ALL_MODELS, (m) => m.capabilities),
      (v) => CAP_LABELS[v] ?? v,
    ),
    modalities: opts(
      tally(ALL_MODELS, (m) => m.inputModalities.filter((x) => x !== "text")),
      (v) => MODALITY_LABELS[v] ?? v,
    ),
  };
}

export function getStats(): Stats {
  return {
    models: ALL_MODELS.length,
    labs: LABS.length,
    providers: PROVIDERS.length,
    benchmarks: BENCHMARKS.length,
  };
}
