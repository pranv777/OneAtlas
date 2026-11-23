import { fail, ok } from "@/server/http";
import { getFacets } from "@/server/queries";

export async function GET() {
  try {
    return ok(getFacets());
  } catch (e) {
    return fail(e);
  }
}
