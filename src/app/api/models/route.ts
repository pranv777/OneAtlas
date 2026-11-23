import type { NextRequest } from "next/server";
import { csv, fail, int, ok } from "@/server/http";
import { HttpError, isSortKey, listModels } from "@/server/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams;
    const sort = p.get("sort") ?? "newest";
    if (!isSortKey(sort)) throw new HttpError(400, `Invalid sort "${sort}"`);
    return ok(
      listModels({
        q: p.get("q") ?? undefined,
        labs: csv(p.get("labs")),
        providers: csv(p.get("providers")),
        types: csv(p.get("types")),
        capabilities: csv(p.get("capabilities")),
        modalities: csv(p.get("modalities")),
        openWeights: p.get("openWeights") === "true",
        sort,
        page: int(p.get("page"), 1),
        pageSize: int(p.get("pageSize"), 12),
      }),
    );
  } catch (e) {
    return fail(e);
  }
}
