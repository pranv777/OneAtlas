"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "./api";
import type { ModelFilters } from "./types";

export function useDebounced<T>(value: T, delay = 300): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export const useModels = (f: ModelFilters) =>
  useQuery({
    queryKey: ["models", f],
    queryFn: ({ signal }) => api.models(f, signal),
    placeholderData: keepPreviousData,
  });

export const useModel = (slug: string) =>
  useQuery({ queryKey: ["model", slug], queryFn: () => api.model(slug) });

export const useCompare = (slugs: string[]) =>
  useQuery({
    queryKey: ["compare", slugs],
    queryFn: () => api.compare(slugs),
    enabled: slugs.length > 0,
    placeholderData: keepPreviousData,
  });

export const useRankings = (benchmark: string, type?: string) =>
  useQuery({
    queryKey: ["rankings", benchmark, type],
    queryFn: () => api.rankings(benchmark, type),
    placeholderData: keepPreviousData,
  });

export const useLabs = (q?: string) =>
  useQuery({
    queryKey: ["labs", q],
    queryFn: () => api.labs(q),
    placeholderData: keepPreviousData,
  });

export const useLab = (slug: string) =>
  useQuery({ queryKey: ["lab", slug], queryFn: () => api.lab(slug) });

export const useProviders = (q?: string, kind?: string) =>
  useQuery({
    queryKey: ["providers", q, kind],
    queryFn: () => api.providers(q, kind),
    placeholderData: keepPreviousData,
  });

export const useProvider = (slug: string) =>
  useQuery({ queryKey: ["provider", slug], queryFn: () => api.provider(slug) });

export const useFacets = () =>
  useQuery({
    queryKey: ["facets"],
    queryFn: api.facets,
    staleTime: 10 * 60_000,
  });

export const useStats = () =>
  useQuery({ queryKey: ["stats"], queryFn: api.stats, staleTime: 10 * 60_000 });

export const useSearch = (q: string) =>
  useQuery({
    queryKey: ["search", q],
    queryFn: ({ signal }) => api.search(q, signal),
    enabled: q.trim().length > 0,
    placeholderData: keepPreviousData,
  });
