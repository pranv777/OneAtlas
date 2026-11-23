import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import CompareTray from "@/components/CompareTray";
import { CompareProvider } from "@/components/CompareProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import QueryProvider from "@/components/QueryProvider";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OneAtlas: find, compare and rank AI models",
    template: "%s · OneAtlas",
  },
  description:
    "Discover AI models across labs and providers. Compare pricing, context windows, capabilities and benchmark scores side by side.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <QueryProvider>
          <CompareProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            <Header />
            <main
              id="main"
              className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"
            >
              {children}
            </main>
            <Footer />
            <CompareTray />
          </CompareProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
