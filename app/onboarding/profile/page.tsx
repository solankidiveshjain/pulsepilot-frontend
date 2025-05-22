"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Info, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressIndicator } from "@/components/onboarding/progress-indicator"
import { ToneSelector } from "@/components/onboarding/tone-selector"
import { ActionBiasSelector } from "@/components/onboarding/action-bias-selector"
import { ModeToggle } from "@/components/mode-toggle"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [persona, setPersona] = useState("")
  const [tone, setTone] = useState("friendly")
  const [signature, setSignature] = useState("")
  const [actionBias, setActionBias] = useState("engage")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      router.push("/onboarding/connect")
    }, 1000)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-8">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-[600px] space-y-8 animate-fade-in">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="social-gradient-text">PulsePilot</span>
          </h1>
          <p className="text-muted-foreground text-lg">Let's set up your profile</p>
        </div>

        <ProgressIndicator currentStep={1} totalSteps={2} />

        <Card className="border-border/40 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                      <AvatarImage src={avatar || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {name ? name.charAt(0).toUpperCase() : "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label
                        htmlFor="avatar"
                        className="cursor-pointer flex items-center justify-center gap-2 border rounded-md p-3 hover:bg-primary/5 transition-colors text-base"
                      >
                        <Upload className="h-5 w-5 text-primary" />
                        <span>Upload Image</span>
                      </Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="persona" className="text-base">
                      Describe your persona
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-foreground text-background">
                          <p className="max-w-xs">
                            e.g., I'm a travel influencer, food vlogger, or manage a political handle
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="persona"
                    placeholder="Tell us about your content style and how you like to engage with your audience"
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    rows={3}
                    className="text-base resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Tone Style</Label>
                  <ToneSelector value={tone} onChange={setTone} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature" className="text-base">
                    Signature (Optional)
                  </Label>
                  <Input
                    id="signature"
                    placeholder="e.g., Cheers from Alex! 🚀"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Action Bias</Label>
                  <ActionBiasSelector value={actionBias} onChange={setActionBias} />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={!name || isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
