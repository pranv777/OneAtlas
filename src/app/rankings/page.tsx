import type { Metadata } from "next";
import { Suspense } from "react";
import RankingsView from "@/components/RankingsView";
import { Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Rankings and benchmarks" };

export default function RankingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <RankingsView />
    </Suspense>
  );
}
