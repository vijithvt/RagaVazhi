import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "RagaVazhi — Find the song. Follow the raga.", template: "%s · RagaVazhi" },
  description: "Discover Malayalam songs, Carnatic compositions, ragas and trusted learning paths in Malayalam and English.",
  openGraph: { title: "RagaVazhi", description: "Find the song. Follow the raga.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header /><main>{children}</main><Footer /></body></html>;
}
