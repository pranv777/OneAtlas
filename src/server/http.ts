import { NextResponse } from "next/server";
import { HttpError } from "./queries";

const CACHE = "public, s-maxage=60, stale-while-revalidate=300";

export function ok<T>(data: T) {
  return NextResponse.json(data, { headers: { "Cache-Control": CACHE } });
}

export function fail(err: unknown) {
  if (err instanceof HttpError) {
    return NextResponse.json(
      { error: { message: err.message } },
      { status: err.status },
    );
  }
  console.error(err);
  return NextResponse.json(
    { error: { message: "Unexpected server error" } },
    { status: 500 },
  );
}

export const csv = (v: string | null): string[] | undefined =>
  v
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

export function int(v: string | null, fallback: number): number {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}
