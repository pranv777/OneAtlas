import type { Metadata } from "next";
import { Suspense } from "react";
import ModelsExplorer from "@/components/ModelsExplorer";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Models" };

export default function ModelsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ModelsExplorer />
    </Suspense>
  );
}
