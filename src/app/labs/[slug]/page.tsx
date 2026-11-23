import { LabDetail } from "@/components/LabsViews";

export default function LabPage({ params }: { params: { slug: string } }) {
  return <LabDetail slug={params.slug} />;
}
