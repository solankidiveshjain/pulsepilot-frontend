import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import type { WebVitalsMetric } from "next/dist/compiled/web-vitals";
import { Inter } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

// Import the web vitals function
import { sendWebVitalsToAnalytics } from "@/lib/utils/web-vitals";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PulsePilot - Social Media Management Platform",
  description: "Optimize your social media presence with PulsePilot",
  authors: [{ name: "PulsePilot Team" }],
  keywords: ["social media", "management", "analytics", "scheduling"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Report web vitals
export function reportWebVitals(metric: WebVitalsMetric) {
  sendWebVitalsToAnalytics(metric);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
