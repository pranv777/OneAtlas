import type { Metadata } from "next";
import { Suspense } from "react";
import CompareView from "@/components/CompareView";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Compare models" };

export default function ComparePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <CompareView />
    </Suspense>
  );
}
