import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Linkedin, MessageSquare, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const socialPlatforms = [
  {
    name: "Twitter",
    icon: Twitter,
    color: "text-[#1DA1F2]",
    bgColor: "bg-[#1DA1F2]/10",
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "text-[#4267B2]",
    bgColor: "bg-[#4267B2]/10",
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-[#E1306C]",
    bgColor: "bg-[#E1306C]/10",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-[#0077B5]",
    bgColor: "bg-[#0077B5]/10",
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "text-[#FF0000]",
    bgColor: "bg-[#FF0000]/10",
  },
];

export default function GetStartedPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">PulsePilot</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container flex flex-col items-center justify-center gap-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Connect Your Social Media
            </h1>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Choose the platforms you want to manage with PulsePilot
            </p>
          </div>

          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socialPlatforms.map((platform) => (
              <Card
                key={platform.name}
                className="flex cursor-pointer flex-col items-center gap-4 p-6 transition-colors hover:bg-muted/50"
              >
                <div className={cn("rounded-full p-4", platform.bgColor)}>
                  <platform.icon className={cn("h-8 w-8", platform.color)} />
                </div>
                <h3 className="text-lg font-semibold">{platform.name}</h3>
                <Button variant="outline" className="w-full">
                  Connect
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">You can always add more platforms later</p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Continue to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">PulsePilot</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
