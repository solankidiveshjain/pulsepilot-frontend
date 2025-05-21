import { RootProvider } from "@/components/providers/root-provider";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PulsePilot - Social Media Comment Management",
  description: "Manage and respond to social media comments efficiently",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-gray-100", inter.className)}>
        <div className="m-4 rounded-lg bg-blue-500 p-4 text-white shadow-lg">
          IF YOU SEE THIS BLUE BOX WITH SHADOW, TAILWIND WORKS!
        </div>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
