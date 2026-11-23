import type { Metadata } from "next";
import { ProvidersDirectory } from "@/components/ProvidersViews";

export const metadata: Metadata = { title: "Providers" };

export default function ProvidersPage() {
  return <ProvidersDirectory />;
}
