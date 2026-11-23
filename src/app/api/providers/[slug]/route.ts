import { fail, ok } from "@/server/http";
import { getProvider } from "@/server/queries";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    return ok(getProvider(params.slug));
  } catch (e) {
    return fail(e);
  }
}
