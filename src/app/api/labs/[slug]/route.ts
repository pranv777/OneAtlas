import { fail, ok } from "@/server/http";
import { getLab } from "@/server/queries";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    return ok(getLab(params.slug));
  } catch (e) {
    return fail(e);
  }
}
