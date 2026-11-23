import type { NextRequest } from "next/server";
import { fail, ok } from "@/server/http";
import { getRankings } from "@/server/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams;
    return ok(
      getRankings(p.get("benchmark") ?? "overall", p.get("type") ?? undefined),
    );
  } catch (e) {
    return fail(e);
  }
}
