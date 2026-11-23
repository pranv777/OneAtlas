/** Display metadata for benchmark ids. The authoritative list comes from the API (/compare, /rankings). */
export const BENCHMARK_META: Record<
  string,
  { name: string; category: string; unit: string; max: number }
> = {
  mmlu_pro: { name: "MMLU-Pro", category: "Knowledge", unit: "%", max: 100 },
  gpqa: { name: "GPQA Diamond", category: "Reasoning", unit: "%", max: 100 },
  swe_bench: {
    name: "SWE-bench Verified",
    category: "Coding",
    unit: "%",
    max: 100,
  },
  humaneval: { name: "HumanEval", category: "Coding", unit: "%", max: 100 },
  math500: { name: "MATH-500", category: "Math", unit: "%", max: 100 },
  arena_elo: {
    name: "Arena Elo",
    category: "Human preference",
    unit: "Elo",
    max: 1500,
  },
};
