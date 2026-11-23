import type { Metadata } from "next";
import ModelDetail from "@/components/ModelDetail";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const name = params.slug.replace(/-/g, " ");
  return { title: `${name} specs, pricing and benchmarks` };
}

export default function ModelPage({ params }: { params: { slug: string } }) {
  return <ModelDetail slug={params.slug} />;
}
