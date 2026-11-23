import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-72" />
    </div>
  );
}
