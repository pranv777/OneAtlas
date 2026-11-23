import { fail, ok } from "@/server/http";
import { getModel } from "@/server/queries";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    return ok(getModel(params.slug));
  } catch (e) {
    return fail(e);
  }
}
