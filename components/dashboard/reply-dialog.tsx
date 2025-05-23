"use client"

import { useState, useEffect } from "react"
import { Check, RefreshCw, Zap, Edit, MessageSquare, ChevronDown, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"

const platformColors = {
  youtube: "platform-badge-youtube",
  instagram: "platform-badge-instagram",
  twitter: "platform-badge-twitter",
  tiktok: "platform-badge-tiktok",
  facebook: "platform-badge-facebook",
  linkedin: "platform-badge-linkedin",
}

const platformIcons = {
  youtube: "/youtube.png",
  instagram: "/instagram.png",
  twitter: "/twitter.png",
  tiktok: "/tiktok.png",
  facebook: "/facebook.png",
  linkedin: "/linkedin.png",
}

const mockReplies = {
  thank: [
    "Thanks so much for your comment! I really appreciate you taking the time to share your thoughts.",
    "Thank you for the feedback! It means a lot to hear from viewers like you.",
  ],
  clarify: [
    "Great question! To clarify, what I meant in the video was that...",
    "I understand your confusion. Let me explain in more detail what I was trying to convey.",
  ],
  redirect: [
    "I actually covered this topic in more detail in my previous video. Check it out here: [link]",
    "For more information on this, I recommend checking out the resources I've linked in the description.",
  ],
  acknowledge: [
    "I appreciate your feedback on this. I'll definitely take this into consideration for future content.",
    "You've raised some valid points. I'll be addressing these concerns in an upcoming video.",
  ],
}

const replyTools = [
  { id: "rephrase", label: "Rephrase", icon: RefreshCw },
  { id: "shorten", label: "Shorten", icon: MessageSquare },
  { id: "expand", label: "Expand", icon: Edit },
  { id: "casual", label: "Casual", icon: MessageSquare },
  { id: "professional", label: "Professional", icon: MessageSquare },
]

// Mock data for bulk reply recipients
const mockBulkRecipients = [
  { id: "user1", name: "Alex Johnson", platform: "youtube" },
  { id: "user2", name: "Sarah Miller", platform: "instagram" },
  { id: "user3", name: "Mike Thompson", platform: "youtube" },
  { id: "user4", name: "Emily Chen", platform: "facebook" },
  { id: "user5", name: "David Wilson", platform: "twitter" },
]

export function ReplyDialog({ comment, onClose, isBulkReply = false, selectedComments = [] }) {
  const [selectedIntent, setSelectedIntent] = useState("thank")
  const [selectedReply, setSelectedReply] = useState(mockReplies.thank[0])
  const [editedReply, setEditedReply] = useState(mockReplies.thank[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRecipients, setShowRecipients] = useState(false)
  const { toast } = useToast()

  const platformClass = platformColors[comment.platform] || ""
  const platformIcon = platformIcons[comment.platform] || ""

  // For demo purposes, use mock recipients
  const recipients = mockBulkRecipients.slice(0, isBulkReply ? 5 : 1)

  const handleReplySelect = (reply) => {
    setSelectedReply(reply)
    setEditedReply(reply)
  }

  const handleIntentChange = (intent) => {
    setSelectedIntent(intent)
    setSelectedReply(mockReplies[intent][0])
    setEditedReply(mockReplies[intent][0])
  }

  const handleToolClick = (tool) => {
    // Simulate AI transformations
    let newReply = editedReply

    switch (tool) {
      case "rephrase":
        newReply = "I've rephrased this: " + editedReply
        break
      case "shorten":
        newReply =
          editedReply
            .split(" ")
            .slice(0, editedReply.split(" ").length / 2)
            .join(" ") + "..."
        break
      case "expand":
        newReply = editedReply + " I hope this helps clarify things. Let me know if you have any other questions!"
        break
      case "casual":
        newReply = "Hey there! " + editedReply.replace(".", "!") + " Thanks for reaching out!"
        break
      case "professional":
        newReply = "Thank you for your comment. " + editedReply + " We appreciate your engagement."
        break
    }

    setEditedReply(newReply)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)

      // Show toast notification
      toast({
        title: isBulkReply ? "Bulk Reply Sent" : "Reply Sent",
        description: isBulkReply
          ? `Your reply has been sent to ${recipients.length} recipients.`
          : `Your reply to ${comment.author.name} has been sent.`,
        variant: "default",
      })

      onClose()
    }, 1000)
  }

  // Handle keyboard shortcut for submission
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (editedReply && !isSubmitting) {
          handleSubmit()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [editedReply, isSubmitting])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <DialogTitle className="text-xl">{isBulkReply ? "Bulk Reply" : "Reply to Comment"}</DialogTitle>
            <DialogDescription>
              {isBulkReply
                ? "Create a single response to send to multiple comments"
                : "Craft a personalized response to this comment"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="py-4">
          <Card className="mb-4 p-3 bg-muted/30 border-border/40">
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-8 w-8 border border-border/60">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="relative h-4 w-4 platform-icon">
                  <Image
                    src={platformIcon || "/placeholder.svg"}
                    alt={comment.platform}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author.name}</span>
                  <Badge variant="outline" className={`text-xs ${platformClass}`}>
                    {comment.platform}
                  </Badge>
                </div>
                <p className="text-xs">{comment.text}</p>

                {/* Recipients list for bulk reply */}
                {isBulkReply && (
                  <Collapsible open={showRecipients} onOpenChange={setShowRecipients} className="mt-2">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs w-full flex items-center justify-between"
                      >
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{recipients.length} Recipients</span>
                        </div>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${showRecipients ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-1.5 animate-slide-down">
                      {recipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="flex items-center gap-2 p-1.5 bg-muted/20 rounded-md text-xs"
                        >
                          <div className="relative h-3 w-3">
                            <Image
                              src={platformIcons[recipient.platform] || "/placeholder.svg"}
                              alt={recipient.platform}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span>{recipient.name}</span>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedIntent === "thank" ? "default" : "outline"}
                className="h-8 text-xs animate-scale-in"
                onClick={() => handleIntentChange("thank")}
              >
                🙏 Thank
              </Button>
              <Button
                variant={selectedIntent === "clarify" ? "default" : "outline"}
                className="h-8 text-xs animate-scale-in"
                style={{ animationDelay: "0.1s" }}
                onClick={() => handleIntentChange("clarify")}
              >
                💡 Clarify
              </Button>
              <Button
                variant={selectedIntent === "redirect" ? "default" : "outline"}
                className="h-8 text-xs animate-scale-in"
                style={{ animationDelay: "0.2s" }}
                onClick={() => handleIntentChange("redirect")}
              >
                🔗 Redirect
              </Button>
              <Button
                variant={selectedIntent === "acknowledge" ? "default" : "outline"}
                className="h-8 text-xs animate-scale-in"
                style={{ animationDelay: "0.3s" }}
                onClick={() => handleIntentChange("acknowledge")}
              >
                👍 Acknowledge
              </Button>
            </div>

            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggestions" className="text-sm">
                  AI Suggestions
                </TabsTrigger>
                <TabsTrigger value="editor" className="text-sm">
                  Editor
                </TabsTrigger>
              </TabsList>
              <TabsContent value="suggestions" className="space-y-3 pt-4">
                {mockReplies[selectedIntent].map((reply, index) => (
                  <div
                    key={index}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedReply === reply
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-primary/30 hover:bg-primary/5"
                    }`}
                    onClick={() => handleReplySelect(reply)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 ai-pulse">
                        <Zap className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-xs">{reply}</p>
                    </div>
                    {selectedReply === reply && (
                      <div className="flex justify-end mt-2">
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="editor" className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {replyTools.map((tool) => (
                      <Button
                        key={tool.id}
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-border/40 hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => handleToolClick(tool.id)}
                      >
                        <tool.icon className="h-3 w-3 mr-2" />
                        {tool.label}
                      </Button>
                    ))}
                  </div>

                  <Textarea
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                    placeholder="Write your reply..."
                    className="min-h-[120px] text-sm resize-none border-border/40"
                  />

                  <div className="text-xs text-muted-foreground text-right">
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/40">Cmd</kbd> +{" "}
                    <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border/40">Enter</kbd> to send
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-border/40 text-xs h-8">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!editedReply || isSubmitting} className="gap-2 text-xs h-8">
            {isSubmitting ? (
              <>
                <div className="h-3 w-3 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <span>{isBulkReply ? "Send Bulk Reply" : "Send Reply"}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
