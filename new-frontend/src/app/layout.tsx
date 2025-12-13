import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Flow Survey | Visual Flowchart Survey Builder & Interactive Decision Trees",
    template: "%s | Flow Survey",
  },
  description:
    "Create complex logic flows, interactive decision trees, and advanced surveys with Flow Survey's visual builder. The enterprise standard for flowchart-based data collection.",
  keywords: [
    "flowchart surveys",
    "visual form builder",
    "decision tree software",
    "interactive surveys",
    "logic forms",
    "survey flows",
    "data collection tool",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flowchartsurvey.online",
    title: "Flow Survey | Visual Flowchart Survey Builder",
    description: "Build complex logic flows and interactive decision trees visually.",
    siteName: "Flow Survey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow Survey | Visual Flowchart Survey Builder",
    description: "Build complex logic flows and interactive decision trees visually.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="https://cloud.umami.is/script.js" data-website-id="91d96cd7-1760-46b3-9ef7-c347ca11aa88" />
        <Script src="/viewer.min.js" strategy="afterInteractive" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-WYQ1XX1ZR6" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WYQ1XX1ZR6');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
