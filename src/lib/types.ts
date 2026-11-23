export type ModelType = "chat" | "reasoning" | "code" | "embedding";
export type Capability =
  "tools" | "vision" | "json" | "reasoning" | "caching" | "streaming";
export type Modality = "text" | "image" | "audio" | "video";
export type LabKind = "Frontier lab" | "Open-weights lab" | "Big tech";
export type ProviderKind =
  "First-party API" | "Cloud platform" | "Inference host";

export interface LabRef {
  slug: string;
  name: string;
  color: string;
}

export interface ProviderOffer {
  providerSlug: string;
  providerName: string;
  inputPrice: number; // USD per 1M tokens
  outputPrice: number;
  latencyMs: number; // time to first token
  throughput: number; // tokens / second
}

export interface Model {
  slug: string;
  name: string;
  lab: LabRef;
  type: ModelType;
  releaseDate: string; // ISO date
  contextWindow: number;
  maxOutput: number;
  inputPrice: number; // lowest listed price, USD per 1M tokens
  outputPrice: number;
  inputModalities: Modality[];
  outputModalities: Modality[];
  capabilities: Capability[];
  openWeights: boolean;
  parameters: string | null;
  description: string;
  providers: ProviderOffer[];
  benchmarks: Record<string, number>;
}

export interface Lab {
  slug: string;
  name: string;
  country: string;
  founded: number;
  kind: LabKind;
  color: string;
  description: string;
  website: string;
  modelCount: number;
}

export interface Provider {
  slug: string;
  name: string;
  kind: ProviderKind;
  description: string;
  website: string;
  regions: string[];
  openAICompatible: boolean;
  modelCount: number;
}

export interface Benchmark {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string;
  max: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facets {
  labs: FacetOption[];
  providers: FacetOption[];
  types: FacetOption[];
  capabilities: FacetOption[];
  modalities: FacetOption[];
}

export interface RankingEntry {
  rank: number;
  score: number;
  model: Model;
}

export interface RankingsResponse {
  selected: {
    id: string;
    name: string;
    description: string;
    unit: string;
    max: number;
  };
  benchmarks: Benchmark[];
  entries: RankingEntry[];
}

export interface SearchResults {
  models: { slug: string; name: string; type: ModelType; labName: string }[];
  labs: { slug: string; name: string; kind: LabKind }[];
  providers: { slug: string; name: string; kind: ProviderKind }[];
}

export interface Stats {
  models: number;
  labs: number;
  providers: number;
  benchmarks: number;
}

export type SortKey =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "context-desc"
  | "context-asc"
  | "name";

export interface ModelFilters {
  q?: string;
  labs?: string[];
  providers?: string[];
  types?: string[];
  capabilities?: string[];
  modalities?: string[];
  openWeights?: boolean;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}
