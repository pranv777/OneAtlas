import type { NextRequest } from "next/server";
import { csv, fail, ok } from "@/server/http";
import { compareModels } from "@/server/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    return ok(compareModels(csv(req.nextUrl.searchParams.get("models")) ?? []));
  } catch (e) {
    return fail(e);
  }
}
