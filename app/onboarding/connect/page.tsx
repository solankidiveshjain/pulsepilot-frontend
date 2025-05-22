"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Zap, BarChart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SocialPlatformCard } from "@/components/onboarding/social-platform-card"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { ModeToggle } from "@/components/mode-toggle"

export default function ConnectPage() {
  const router = useRouter()
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConnect = (platform: string) => {
    if (connectedPlatforms.includes(platform)) {
      setConnectedPlatforms(connectedPlatforms.filter((p) => p !== platform))
    } else {
      setConnectedPlatforms([...connectedPlatforms, platform])
    }
  }

  const handleContinue = () => {
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-8">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-[700px] space-y-8 animate-fade-in">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">
            Connect Your <span className="social-gradient-text">Social Platforms</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Link your accounts to start managing all your comments in one place
          </p>
        </div>

        <ProgressIndicator currentStep={2} totalSteps={2} />

        <Card className="border-border/40 shadow-lg overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <SocialPlatformCard
                platform="YouTube"
                icon="/youtube.png"
                isConnected={connectedPlatforms.includes("YouTube")}
                onClick={() => handleConnect("YouTube")}
              />
              <SocialPlatformCard
                platform="Instagram"
                icon="/instagram.png"
                isConnected={connectedPlatforms.includes("Instagram")}
                onClick={() => handleConnect("Instagram")}
              />
              <SocialPlatformCard
                platform="X"
                icon="/twitter.png"
                isConnected={connectedPlatforms.includes("X")}
                onClick={() => handleConnect("X")}
              />
              <SocialPlatformCard
                platform="TikTok"
                icon="/tiktok.png"
                isConnected={connectedPlatforms.includes("TikTok")}
                onClick={() => handleConnect("TikTok")}
              />
              <SocialPlatformCard
                platform="Facebook"
                icon="/facebook.png"
                isConnected={connectedPlatforms.includes("Facebook")}
                onClick={() => handleConnect("Facebook")}
              />
              <SocialPlatformCard
                platform="LinkedIn"
                icon="/linkedin.png"
                isConnected={connectedPlatforms.includes("LinkedIn")}
                onClick={() => handleConnect("LinkedIn")}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-6 bg-primary/5 rounded-xl animate-float">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">Unified comment stream</h3>
              <p className="text-sm text-center text-muted-foreground mt-2">
                View and respond to all comments in one place
              </p>
            </div>

            <div
              className="flex flex-col items-center p-6 bg-primary/5 rounded-xl animate-float"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">AI smart replies</h3>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Generate personalized responses automatically
              </p>
            </div>

            <div
              className="flex flex-col items-center p-6 bg-primary/5 rounded-xl animate-float"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">Post insights</h3>
              <p className="text-sm text-center text-muted-foreground mt-2">Track engagement metrics at a glance</p>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full h-12 text-base font-medium shadow-md animate-bounce-subtle"
            disabled={connectedPlatforms.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-rotate-slow"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Continue to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
