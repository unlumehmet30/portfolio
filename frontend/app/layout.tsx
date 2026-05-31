import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/app/providers";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mehmet Ünlü | Portfolio",
    template: "%s | Mehmet Ünlü"
  },
  description:
    "Portfolio of Mehmet Ünlü, an ITU engineering student working on forecasting, computer vision, optimization, speech workflows, and Flutter product ideas.",
  keywords: [
    "Mehmet Ünlü",
    "Machine Learning",
    "Forecasting",
    "Computer Vision",
    "Visual Odometry",
    "Whisper NLP",
    "Flutter",
    "Istanbul Technical University"
  ],
  authors: [{ name: "Mehmet Ünlü" }],
  openGraph: {
    title: "Mehmet Ünlü | Portfolio",
    description:
      "Forecasting, computer vision, optimization, speech-processing, and Flutter projects by Mehmet Ünlü.",
    url: siteUrl,
    siteName: "Mehmet Ünlü Portfolio",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Mehmet Ünlü portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehmet Ünlü | Portfolio",
    description:
      "Forecasting, computer vision, optimization, speech-processing, and Flutter projects.",
    images: ["/og.svg"]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AnimatedBackground />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
