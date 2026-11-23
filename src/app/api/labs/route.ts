import type { NextRequest } from "next/server";
import { fail, ok } from "@/server/http";
import { listLabs } from "@/server/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    return ok({
      items: listLabs(req.nextUrl.searchParams.get("q") ?? undefined),
    });
  } catch (e) {
    return fail(e);
  }
}
