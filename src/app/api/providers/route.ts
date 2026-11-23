import type { NextRequest } from "next/server";
import { fail, ok } from "@/server/http";
import { listProviders } from "@/server/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams;
    return ok({
      items: listProviders(p.get("q") ?? undefined, p.get("kind") ?? undefined),
    });
  } catch (e) {
    return fail(e);
  }
}
