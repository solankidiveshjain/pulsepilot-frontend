"use client"

import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SocialPlatformCardProps {
  platform: string
  icon: string
  isConnected: boolean
  onClick: () => void
}

const platformClasses = {
  YouTube: "border-youtube/30 hover:bg-youtube/10 hover:border-youtube/50",
  Instagram: "border-instagram/30 hover:bg-instagram/10 hover:border-instagram/50",
  X: "border-twitter/30 hover:bg-twitter/10 hover:border-twitter/50",
  TikTok: "border-tiktok/30 hover:bg-tiktok/10 hover:border-tiktok/50",
  Facebook: "border-facebook/30 hover:bg-facebook/10 hover:border-facebook/50",
  LinkedIn: "border-linkedin/30 hover:bg-linkedin/10 hover:border-linkedin/50",
}

const platformConnectedClasses = {
  YouTube: "bg-youtube/10 border-youtube text-youtube",
  Instagram: "bg-instagram/10 border-instagram text-instagram",
  X: "bg-twitter/10 border-twitter text-twitter",
  TikTok: "bg-tiktok/10 border-tiktok text-tiktok",
  Facebook: "bg-facebook/10 border-facebook text-facebook",
  LinkedIn: "bg-linkedin/10 border-linkedin text-linkedin",
}

export function SocialPlatformCard({ platform, icon, isConnected, onClick }: SocialPlatformCardProps) {
  return (
    <div
      className={cn(
        "platform-connect-card",
        isConnected ? platformConnectedClasses[platform] || "" : platformClasses[platform] || "",
        isConnected && "animate-pulse-slow",
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3 p-5">
        <div className="relative h-12 w-12">
          <Image src={icon || "/placeholder.svg"} alt={platform} fill className="object-contain" />
        </div>
        <span className="font-medium">{platform}</span>
        <span className="text-xs">{isConnected ? "Connected ✅" : "Not Connected"}</span>
      </div>
      {isConnected && <CheckCircle className="h-5 w-5 absolute top-2 right-2 text-current animate-scale-in" />}
    </div>
  )
}
