import { fail, ok } from "@/server/http";
import { getStats } from "@/server/queries";

export async function GET() {
  try {
    return ok(getStats());
  } catch (e) {
    return fail(e);
  }
}
