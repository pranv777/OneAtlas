import type { Capability, ModelType } from "./types";

export function fmtPrice(n: number): string {
  if (n === 0) return "Free";
  if (n < 0.1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

export function fmtContext(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export function fmtTokens(n: number): string {
  return n === 0 ? "n/a" : fmtContext(n);
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function fmtScore(n: number, unit: string): string {
  return unit === "%" ? `${n.toFixed(1)}%` : String(Math.round(n));
}

export const TYPE_LABEL: Record<ModelType, string> = {
  chat: "Chat",
  reasoning: "Reasoning",
  code: "Code",
  embedding: "Embedding",
};

export const CAPABILITY_LABEL: Record<Capability, string> = {
  tools: "Tool calling",
  vision: "Vision",
  json: "Structured output",
  reasoning: "Reasoning",
  caching: "Prompt caching",
  streaming: "Streaming",
};

export const ALL_CAPABILITIES: Capability[] = [
  "tools",
  "vision",
  "json",
  "reasoning",
  "caching",
  "streaming",
];

/** Input-heavy blend used for price sorting (3 parts input : 1 part output). */
export const blendedPrice = (input: number, output: number) =>
  (3 * input + output) / 4;
