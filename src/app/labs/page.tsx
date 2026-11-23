import type { Metadata } from "next";
import { LabsDirectory } from "@/components/LabsViews";

export const metadata: Metadata = { title: "AI labs" };

export default function LabsPage() {
  return <LabsDirectory />;
}
