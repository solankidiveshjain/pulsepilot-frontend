import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PulsePilot - Unified Comment Dashboard",
  description: "Manage and respond to comments across multiple social platforms",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false}
        >
          <div className="min-h-screen flex flex-col bg-linear-to-br from-background to-secondary/30">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
