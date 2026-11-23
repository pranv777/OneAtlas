import { ProviderDetail } from "@/components/ProvidersViews";

export default function ProviderPage({ params }: { params: { slug: string } }) {
  return <ProviderDetail slug={params.slug} />;
}
