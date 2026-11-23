/**
 * MOCK DATA SOURCE (stand-in for the backend database).
 * Numbers are illustrative sample data for building the UI, not authoritative.
 * The frontend never imports this file; it only talks to /api/* through src/lib/api.ts.
 */
import type {
  Benchmark,
  Capability,
  LabKind,
  Modality,
  ModelType,
  ProviderKind,
} from "@/lib/types";

export interface LabRecord {
  slug: string;
  name: string;
  country: string;
  founded: number;
  kind: LabKind;
  color: string;
  description: string;
  website: string;
}

export interface ProviderRecord {
  slug: string;
  name: string;
  kind: ProviderKind;
  description: string;
  website: string;
  regions: string[];
  openAICompatible: boolean;
}

export interface ModelRecord {
  slug: string;
  name: string;
  lab: string;
  type: ModelType;
  releaseDate: string;
  contextWindow: number;
  maxOutput: number;
  inputPrice: number;
  outputPrice: number;
  inputModalities: Modality[];
  outputModalities: Modality[];
  capabilities: Capability[];
  openWeights: boolean;
  parameters: string | null;
  description: string;
  providers: string[];
  benchmarks: Record<string, number>;
}

export const LABS: LabRecord[] = [
  {
    slug: "openai",
    name: "OpenAI",
    country: "United States",
    founded: 2015,
    kind: "Frontier lab",
    color: "#0F8F6F",
    website: "https://openai.com",
    description:
      "Builds the GPT and o-series model families and the API most developers meet first.",
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    country: "United States",
    founded: 2021,
    kind: "Frontier lab",
    color: "#B4532A",
    website: "https://anthropic.com",
    description:
      "Safety-focused lab behind the Claude family, strong in coding and long-document work.",
  },
  {
    slug: "google",
    name: "Google DeepMind",
    country: "United Kingdom",
    founded: 2010,
    kind: "Big tech",
    color: "#2F6FE4",
    website: "https://deepmind.google",
    description:
      "Develops Gemini models with very long context windows and native multimodal input.",
  },
  {
    slug: "meta",
    name: "Meta AI",
    country: "United States",
    founded: 2013,
    kind: "Big tech",
    color: "#1877F2",
    website: "https://ai.meta.com",
    description:
      "Releases the Llama open-weights family that most inference hosts serve.",
  },
  {
    slug: "mistral",
    name: "Mistral AI",
    country: "France",
    founded: 2023,
    kind: "Open-weights lab",
    color: "#E8710A",
    website: "https://mistral.ai",
    description:
      "European lab shipping efficient general and code models, some with open weights.",
  },
  {
    slug: "deepseek",
    name: "DeepSeek",
    country: "China",
    founded: 2023,
    kind: "Open-weights lab",
    color: "#4057D6",
    website: "https://deepseek.com",
    description:
      "Mixture-of-experts models with open weights and aggressive API pricing.",
  },
  {
    slug: "alibaba",
    name: "Alibaba Qwen",
    country: "China",
    founded: 2023,
    kind: "Big tech",
    color: "#7B4FE0",
    website: "https://qwenlm.github.io",
    description:
      "The Qwen series: broad size range, strong multilingual and coding variants.",
  },
  {
    slug: "cohere",
    name: "Cohere",
    country: "Canada",
    founded: 2019,
    kind: "Frontier lab",
    color: "#2E7D6B",
    website: "https://cohere.com",
    description:
      "Enterprise-oriented models focused on retrieval, tool use and multilingual work.",
  },
  {
    slug: "xai",
    name: "xAI",
    country: "United States",
    founded: 2023,
    kind: "Frontier lab",
    color: "#2B2B2B",
    website: "https://x.ai",
    description:
      "Creator of the Grok models, trained with a focus on real-time information.",
  },
  {
    slug: "microsoft",
    name: "Microsoft Research",
    country: "United States",
    founded: 1991,
    kind: "Big tech",
    color: "#0078D4",
    website: "https://www.microsoft.com/research",
    description:
      "Publishes compact Phi models that punch above their parameter count.",
  },
];

export const PROVIDERS: ProviderRecord[] = [
  {
    slug: "openai-api",
    name: "OpenAI API",
    kind: "First-party API",
    website: "https://platform.openai.com",
    regions: ["US", "EU"],
    openAICompatible: true,
    description:
      "Direct access to OpenAI models with the newest releases first.",
  },
  {
    slug: "anthropic-api",
    name: "Anthropic API",
    kind: "First-party API",
    website: "https://console.anthropic.com",
    regions: ["US", "EU"],
    openAICompatible: false,
    description:
      "Direct access to Claude models, including prompt caching and extended thinking.",
  },
  {
    slug: "google-ai",
    name: "Google AI Studio",
    kind: "First-party API",
    website: "https://ai.google.dev",
    regions: ["US", "EU", "APAC"],
    openAICompatible: true,
    description: "Gemini API with generous free tier and long-context support.",
  },
  {
    slug: "mistral-api",
    name: "La Plateforme",
    kind: "First-party API",
    website: "https://console.mistral.ai",
    regions: ["EU"],
    openAICompatible: true,
    description: "Mistral's hosted API, with EU data residency.",
  },
  {
    slug: "deepseek-api",
    name: "DeepSeek API",
    kind: "First-party API",
    website: "https://platform.deepseek.com",
    regions: ["CN"],
    openAICompatible: true,
    description:
      "Lowest-cost access to DeepSeek models with automatic context caching.",
  },
  {
    slug: "alibaba-cloud",
    name: "Alibaba Model Studio",
    kind: "First-party API",
    website: "https://www.alibabacloud.com/product/modelstudio",
    regions: ["CN", "APAC"],
    openAICompatible: true,
    description: "Qwen models served from Alibaba Cloud regions.",
  },
  {
    slug: "cohere-api",
    name: "Cohere Platform",
    kind: "First-party API",
    website: "https://dashboard.cohere.com",
    regions: ["US", "EU"],
    openAICompatible: false,
    description: "Chat, embed and rerank endpoints from Cohere.",
  },
  {
    slug: "xai-api",
    name: "xAI API",
    kind: "First-party API",
    website: "https://console.x.ai",
    regions: ["US"],
    openAICompatible: true,
    description: "Direct access to Grok models.",
  },
  {
    slug: "bedrock",
    name: "Amazon Bedrock",
    kind: "Cloud platform",
    website: "https://aws.amazon.com/bedrock",
    regions: ["US", "EU", "APAC"],
    openAICompatible: false,
    description:
      "Managed access to many model families inside your AWS account.",
  },
  {
    slug: "vertex",
    name: "Google Vertex AI",
    kind: "Cloud platform",
    website: "https://cloud.google.com/vertex-ai",
    regions: ["US", "EU", "APAC"],
    openAICompatible: false,
    description:
      "Enterprise controls for Gemini and partner models on Google Cloud.",
  },
  {
    slug: "azure",
    name: "Azure AI Foundry",
    kind: "Cloud platform",
    website: "https://ai.azure.com",
    regions: ["US", "EU", "APAC"],
    openAICompatible: true,
    description:
      "OpenAI and partner models with Azure compliance and networking.",
  },
  {
    slug: "together",
    name: "Together AI",
    kind: "Inference host",
    website: "https://together.ai",
    regions: ["US"],
    openAICompatible: true,
    description: "Fast serverless inference for popular open-weights models.",
  },
  {
    slug: "fireworks",
    name: "Fireworks AI",
    kind: "Inference host",
    website: "https://fireworks.ai",
    regions: ["US"],
    openAICompatible: true,
    description:
      "Low-latency inference with fine-tuning and structured output support.",
  },
  {
    slug: "groq",
    name: "Groq",
    kind: "Inference host",
    website: "https://groq.com",
    regions: ["US", "EU"],
    openAICompatible: true,
    description:
      "Custom LPU hardware that serves supported models at very high token rates.",
  },
  {
    slug: "deepinfra",
    name: "DeepInfra",
    kind: "Inference host",
    website: "https://deepinfra.com",
    regions: ["US"],
    openAICompatible: true,
    description: "Budget-friendly hosting for open-weights models.",
  },
];

export const BENCHMARKS: Benchmark[] = [
  {
    id: "mmlu_pro",
    name: "MMLU-Pro",
    category: "Knowledge",
    unit: "%",
    max: 100,
    description:
      "Harder, 10-option version of MMLU covering 14 academic subjects.",
  },
  {
    id: "gpqa",
    name: "GPQA Diamond",
    category: "Reasoning",
    unit: "%",
    max: 100,
    description:
      "Graduate-level science questions written to resist web search.",
  },
  {
    id: "swe_bench",
    name: "SWE-bench Verified",
    category: "Coding",
    unit: "%",
    max: 100,
    description: "Share of real GitHub issues a model resolves end to end.",
  },
  {
    id: "humaneval",
    name: "HumanEval",
    category: "Coding",
    unit: "%",
    max: 100,
    description: "Function-level Python generation checked by unit tests.",
  },
  {
    id: "math500",
    name: "MATH-500",
    category: "Math",
    unit: "%",
    max: 100,
    description:
      "500 competition-style problems sampled from the MATH dataset.",
  },
  {
    id: "arena_elo",
    name: "Arena Elo",
    category: "Human preference",
    unit: "Elo",
    max: 1500,
    description: "Rating from blind head-to-head votes by human raters.",
  },
];

type B = [
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
];
const bench = (b: B): Record<string, number> => {
  const ids = [
    "mmlu_pro",
    "gpqa",
    "swe_bench",
    "humaneval",
    "math500",
    "arena_elo",
  ];
  const out: Record<string, number> = {};
  b.forEach((v, i) => {
    if (v !== null) out[ids[i]] = v;
  });
  return out;
};

const T: Modality[] = ["text"];
const TI: Modality[] = ["text", "image"];
const ALL: Capability[] = ["tools", "vision", "json", "streaming", "caching"];

export const MODELS: ModelRecord[] = [
  {
    slug: "gpt-4o",
    name: "GPT-4o",
    lab: "openai",
    type: "chat",
    releaseDate: "2024-05-13",
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 2.5,
    outputPrice: 10,
    inputModalities: ["text", "image", "audio"],
    outputModalities: T,
    capabilities: ALL,
    openWeights: false,
    parameters: null,
    description:
      "OpenAI's multimodal flagship for fast, general-purpose chat, vision and tool use.",
    providers: ["openai-api", "azure"],
    benchmarks: bench([72.6, 53.6, 33.2, 90.2, 75.9, 1285]),
  },
  {
    slug: "gpt-4o-mini",
    name: "GPT-4o mini",
    lab: "openai",
    type: "chat",
    releaseDate: "2024-07-18",
    contextWindow: 128000,
    maxOutput: 16384,
    inputPrice: 0.15,
    outputPrice: 0.6,
    inputModalities: TI,
    outputModalities: T,
    capabilities: ALL,
    openWeights: false,
    parameters: null,
    description:
      "Small, inexpensive model for high-volume classification, extraction and routing.",
    providers: ["openai-api", "azure"],
    benchmarks: bench([63.1, 40.2, null, 87.2, 70.2, 1272]),
  },
  {
    slug: "o1",
    name: "o1",
    lab: "openai",
    type: "reasoning",
    releaseDate: "2024-12-05",
    contextWindow: 200000,
    maxOutput: 100000,
    inputPrice: 15,
    outputPrice: 60,
    inputModalities: TI,
    outputModalities: T,
    capabilities: ["tools", "vision", "json", "reasoning", "caching"],
    openWeights: false,
    parameters: null,
    description:
      "Reasoning model that thinks before answering; strong on math, science and planning.",
    providers: ["openai-api", "azure"],
    benchmarks: bench([83.5, 78, 48.9, 92.4, 96.4, 1350]),
  },
  {
    slug: "o3-mini",
    name: "o3-mini",
    lab: "openai",
    type: "reasoning",
    releaseDate: "2025-01-31",
    contextWindow: 200000,
    maxOutput: 100000,
    inputPrice: 1.1,
    outputPrice: 4.4,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "reasoning", "caching", "streaming"],
    openWeights: false,
    parameters: null,
    description:
      "Cost-efficient reasoning model with adjustable reasoning effort.",
    providers: ["openai-api", "azure"],
    benchmarks: bench([79.9, 79.7, 49.3, 94, 97.9, 1320]),
  },
  {
    slug: "text-embedding-3-large",
    name: "text-embedding-3-large",
    lab: "openai",
    type: "embedding",
    releaseDate: "2024-01-25",
    contextWindow: 8191,
    maxOutput: 0,
    inputPrice: 0.13,
    outputPrice: 0,
    inputModalities: T,
    outputModalities: T,
    capabilities: [],
    openWeights: false,
    parameters: null,
    description:
      "3072-dimension embeddings with adjustable size for search and retrieval.",
    providers: ["openai-api", "azure"],
    benchmarks: {},
  },
  {
    slug: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    lab: "anthropic",
    type: "chat",
    releaseDate: "2024-10-22",
    contextWindow: 200000,
    maxOutput: 8192,
    inputPrice: 3,
    outputPrice: 15,
    inputModalities: TI,
    outputModalities: T,
    capabilities: ALL,
    openWeights: false,
    parameters: null,
    description:
      "Balanced model known for careful coding, writing and agentic tool use.",
    providers: ["anthropic-api", "bedrock", "vertex"],
    benchmarks: bench([78, 65, 49, 93.7, 78.3, 1295]),
  },
  {
    slug: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    lab: "anthropic",
    type: "chat",
    releaseDate: "2024-11-04",
    contextWindow: 200000,
    maxOutput: 8192,
    inputPrice: 0.8,
    outputPrice: 4,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming", "caching"],
    openWeights: false,
    parameters: null,
    description:
      "Fast and affordable Claude for support agents and real-time applications.",
    providers: ["anthropic-api", "bedrock", "vertex"],
    benchmarks: bench([65, 41.6, 40.6, 88.1, 69.4, 1250]),
  },
  {
    slug: "claude-3-7-sonnet",
    name: "Claude 3.7 Sonnet",
    lab: "anthropic",
    type: "reasoning",
    releaseDate: "2025-02-24",
    contextWindow: 200000,
    maxOutput: 64000,
    inputPrice: 3,
    outputPrice: 15,
    inputModalities: TI,
    outputModalities: T,
    capabilities: [
      "tools",
      "vision",
      "json",
      "reasoning",
      "caching",
      "streaming",
    ],
    openWeights: false,
    parameters: null,
    description:
      "Hybrid model that can answer instantly or think step by step with a token budget.",
    providers: ["anthropic-api", "bedrock", "vertex"],
    benchmarks: bench([80, 84.8, 62.3, 94, 96.2, 1330]),
  },
  {
    slug: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    lab: "google",
    type: "chat",
    releaseDate: "2024-05-24",
    contextWindow: 2000000,
    maxOutput: 8192,
    inputPrice: 1.25,
    outputPrice: 5,
    inputModalities: ["text", "image", "audio", "video"],
    outputModalities: T,
    capabilities: ALL,
    openWeights: false,
    parameters: null,
    description:
      "Two-million-token context for whole codebases, long videos and document sets.",
    providers: ["google-ai", "vertex"],
    benchmarks: bench([75.8, 59.1, null, 84.1, 86.5, 1260]),
  },
  {
    slug: "gemini-2-0-flash",
    name: "Gemini 2.0 Flash",
    lab: "google",
    type: "chat",
    releaseDate: "2025-02-05",
    contextWindow: 1000000,
    maxOutput: 8192,
    inputPrice: 0.1,
    outputPrice: 0.4,
    inputModalities: ["text", "image", "audio", "video"],
    outputModalities: T,
    capabilities: ALL,
    openWeights: false,
    parameters: null,
    description:
      "Low-latency multimodal model with a one-million-token window at a very low price.",
    providers: ["google-ai", "vertex"],
    benchmarks: bench([76.4, 62.1, null, 89, 90.9, 1310]),
  },
  {
    slug: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    lab: "google",
    type: "reasoning",
    releaseDate: "2025-03-25",
    contextWindow: 1048576,
    maxOutput: 65536,
    inputPrice: 1.25,
    outputPrice: 10,
    inputModalities: ["text", "image", "audio", "video"],
    outputModalities: T,
    capabilities: [
      "tools",
      "vision",
      "json",
      "reasoning",
      "caching",
      "streaming",
    ],
    openWeights: false,
    parameters: null,
    description:
      "Thinking model with long context; leads several reasoning and coding leaderboards.",
    providers: ["google-ai", "vertex"],
    benchmarks: bench([84, 84, 63.8, null, 96, 1440]),
  },
  {
    slug: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    lab: "meta",
    type: "chat",
    releaseDate: "2024-07-23",
    contextWindow: 128000,
    maxOutput: 4096,
    inputPrice: 3,
    outputPrice: 3,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: true,
    parameters: "405B",
    description:
      "Largest open-weights Llama; a common base for distillation and fine-tuning.",
    providers: ["together", "fireworks", "bedrock", "deepinfra"],
    benchmarks: bench([73.3, 51.1, null, 89, 73.8, 1266]),
  },
  {
    slug: "llama-3-3-70b",
    name: "Llama 3.3 70B Instruct",
    lab: "meta",
    type: "chat",
    releaseDate: "2024-12-06",
    contextWindow: 128000,
    maxOutput: 4096,
    inputPrice: 0.23,
    outputPrice: 0.4,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: true,
    parameters: "70B",
    description:
      "Near-405B quality at a fraction of the cost; widely hosted and very fast on Groq.",
    providers: ["groq", "together", "fireworks", "deepinfra", "bedrock"],
    benchmarks: bench([68.9, 50.5, null, 88.4, 77, 1255]),
  },
  {
    slug: "mistral-large-2",
    name: "Mistral Large 2",
    lab: "mistral",
    type: "chat",
    releaseDate: "2024-07-24",
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 2,
    outputPrice: 6,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: false,
    parameters: "123B",
    description:
      "Strong multilingual and coding model, weights available under a research license.",
    providers: ["mistral-api", "azure", "bedrock", "vertex"],
    benchmarks: bench([69.4, 48.6, null, 92, 71, 1250]),
  },
  {
    slug: "codestral",
    name: "Codestral",
    lab: "mistral",
    type: "code",
    releaseDate: "2025-01-13",
    contextWindow: 256000,
    maxOutput: 8192,
    inputPrice: 0.3,
    outputPrice: 0.9,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: false,
    parameters: "22B",
    description:
      "Code-specialised model with fill-in-the-middle support for IDE completion.",
    providers: ["mistral-api"],
    benchmarks: bench([null, null, null, 86.6, null, null]),
  },
  {
    slug: "deepseek-v3",
    name: "DeepSeek-V3",
    lab: "deepseek",
    type: "chat",
    releaseDate: "2024-12-26",
    contextWindow: 128000,
    maxOutput: 8192,
    inputPrice: 0.27,
    outputPrice: 1.1,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "caching", "streaming"],
    openWeights: true,
    parameters: "671B MoE",
    description:
      "Mixture-of-experts model that matches much pricier systems on general tasks.",
    providers: ["deepseek-api", "together", "fireworks", "deepinfra"],
    benchmarks: bench([75.9, 59.1, 42, 82.6, 90.2, 1318]),
  },
  {
    slug: "deepseek-r1",
    name: "DeepSeek-R1",
    lab: "deepseek",
    type: "reasoning",
    releaseDate: "2025-01-20",
    contextWindow: 128000,
    maxOutput: 32768,
    inputPrice: 0.55,
    outputPrice: 2.19,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["reasoning", "caching", "streaming"],
    openWeights: true,
    parameters: "671B MoE",
    description:
      "Open-weights reasoning model trained with reinforcement learning.",
    providers: ["deepseek-api", "together", "fireworks", "deepinfra"],
    benchmarks: bench([84, 71.5, 49.2, null, 97.3, 1358]),
  },
  {
    slug: "qwen-2-5-72b",
    name: "Qwen2.5 72B Instruct",
    lab: "alibaba",
    type: "chat",
    releaseDate: "2024-09-19",
    contextWindow: 131072,
    maxOutput: 8192,
    inputPrice: 0.35,
    outputPrice: 0.4,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: true,
    parameters: "72B",
    description:
      "Multilingual open model covering 29 languages with strong structured output.",
    providers: ["alibaba-cloud", "together", "deepinfra", "fireworks"],
    benchmarks: bench([71.1, 49, null, 86.6, 83.1, 1260]),
  },
  {
    slug: "qwen-2-5-coder-32b",
    name: "Qwen2.5-Coder 32B",
    lab: "alibaba",
    type: "code",
    releaseDate: "2024-11-12",
    contextWindow: 131072,
    maxOutput: 8192,
    inputPrice: 0.07,
    outputPrice: 0.16,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: true,
    parameters: "32B",
    description:
      "Open code model that rivals much larger systems on code generation.",
    providers: ["alibaba-cloud", "together", "fireworks", "deepinfra"],
    benchmarks: bench([null, null, null, 92.7, null, null]),
  },
  {
    slug: "command-r-plus",
    name: "Command R+",
    lab: "cohere",
    type: "chat",
    releaseDate: "2024-08-30",
    contextWindow: 128000,
    maxOutput: 4000,
    inputPrice: 2.5,
    outputPrice: 10,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["tools", "json", "streaming"],
    openWeights: false,
    parameters: "104B",
    description:
      "Built for retrieval-augmented generation with inline citations and tool use.",
    providers: ["cohere-api", "bedrock", "azure"],
    benchmarks: bench([null, null, null, null, null, 1220]),
  },
  {
    slug: "grok-2",
    name: "Grok-2",
    lab: "xai",
    type: "chat",
    releaseDate: "2024-08-13",
    contextWindow: 131072,
    maxOutput: 8192,
    inputPrice: 2,
    outputPrice: 10,
    inputModalities: TI,
    outputModalities: T,
    capabilities: ["tools", "vision", "json", "streaming"],
    openWeights: false,
    parameters: null,
    description:
      "xAI's general-purpose model with vision and function calling.",
    providers: ["xai-api"],
    benchmarks: bench([75.5, 56, null, 88.4, 76.1, 1288]),
  },
  {
    slug: "phi-4",
    name: "Phi-4",
    lab: "microsoft",
    type: "chat",
    releaseDate: "2024-12-12",
    contextWindow: 16000,
    maxOutput: 4096,
    inputPrice: 0.07,
    outputPrice: 0.14,
    inputModalities: T,
    outputModalities: T,
    capabilities: ["json", "streaming"],
    openWeights: true,
    parameters: "14B",
    description:
      "Compact model trained on curated synthetic data; excels at reasoning for its size.",
    providers: ["azure", "deepinfra"],
    benchmarks: bench([70.4, 56.1, null, 82.6, 80.4, null]),
  },
];
