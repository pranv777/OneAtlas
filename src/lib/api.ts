import type {
  Benchmark,
  Facets,
  Lab,
  Model,
  ModelFilters,
  Paginated,
  Provider,
  RankingsResponse,
  SearchResults,
  Stats,
} from "./types";

/** Empty string = same-origin mock API (/api). Set NEXT_PUBLIC_API_URL to point at the real backend. */
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Param = string | number | boolean | string[] | null | undefined;

function toQuery(params?: Record<string, Param>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "" || v === false) continue;
    if (Array.isArray(v)) {
      if (v.length) sp.set(k, v.join(","));
    } else {
      sp.set(k, String(v));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function get<T>(
  path: string,
  params?: Record<string, Param>,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`${BASE}/api${path}${toQuery(params)}`, { signal });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  models: (f: ModelFilters, signal?: AbortSignal) =>
    get<Paginated<Model>>("/models", { ...f }, signal),
  model: (slug: string) =>
    get<{ model: Model; related: Model[] }>(
      `/models/${encodeURIComponent(slug)}`,
    ),
  compare: (slugs: string[]) =>
    get<{ models: Model[]; benchmarks: Benchmark[] }>("/compare", {
      models: slugs,
    }),
  rankings: (benchmark: string, type?: string) =>
    get<RankingsResponse>("/rankings", { benchmark, type }),
  labs: (q?: string) => get<{ items: Lab[] }>("/labs", { q }),
  lab: (slug: string) =>
    get<{ lab: Lab; models: Model[]; providers: Provider[] }>(
      `/labs/${encodeURIComponent(slug)}`,
    ),
  providers: (q?: string, kind?: string) =>
    get<{ items: Provider[] }>("/providers", { q, kind }),
  provider: (slug: string) =>
    get<{ provider: Provider; models: Model[] }>(
      `/providers/${encodeURIComponent(slug)}`,
    ),
  search: (q: string, signal?: AbortSignal) =>
    get<SearchResults>("/search", { q }, signal),
  facets: () => get<Facets>("/facets"),
  stats: () => get<Stats>("/stats"),
};
