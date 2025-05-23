"use client"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { X, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface ReplyDialogProps {
  comment: {
    id?: string
    text: string
    author: {
      name: string
      avatar?: string
    }
    platform: string
  }
  onClose: () => void
  isBulkReply?: boolean
  selectedComments?: string[]
}

export function ReplyDialog({ comment, onClose, isBulkReply = false, selectedComments = [] }: ReplyDialogProps) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [activeTab, setActiveTab] = useState("ai-suggestions")
  const { toast } = useToast()

  // AI suggestions
  const aiSuggestions = [
    "Thanks so much for your comment! I really appreciate you taking the time to share your thoughts.",
    "Thank you for the feedback! It means a lot to hear from viewers like you.",
  ]

  useEffect(() => {
    // Set the first suggestion as the reply text initially
    setReplyText(aiSuggestions[0])
  }, [])

  // Handle escape key to close dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = () => {
    if (!replyText.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Reply sent",
        description: `Your reply to ${comment.author.name} has been sent.`,
        variant: "default",
      })
      onClose()
    }, 1000)
  }

  const selectSuggestion = (index: number) => {
    setSelectedSuggestion(index)
    setReplyText(aiSuggestions[index])
  }

  const handleQuickReply = (type: string) => {
    let response = ""

    switch (type) {
      case "thank":
        response = "Thank you for sharing your thoughts! I appreciate your feedback."
        break
      case "clarify":
        response = "I'd like to clarify that point. What I meant was..."
        break
      case "redirect":
        response = "That's an interesting perspective. Have you considered trying..."
        break
      case "acknowledge":
        response = "I acknowledge your concern and will take it into consideration."
        break
    }

    setReplyText(response)
    setActiveTab("editor")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="z-50 w-full max-w-lg rounded-lg border bg-background shadow-lg animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-medium">Reply to Comment</h3>
            <p className="text-sm text-muted-foreground">Craft a personalized response to this comment</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Original comment */}
        <div className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              {comment.author.avatar ? (
                <img src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
              ) : (
                <div className="bg-muted h-full w-full rounded-full flex items-center justify-center text-muted-foreground">
                  {comment.author.name.charAt(0)}
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author.name}</span>
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0 h-5 bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30"
                >
                  {comment.platform.toLowerCase()}
                </Badge>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>

          {/* Quick reply buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
              onClick={() => handleQuickReply("thank")}
            >
              🙏 Thank
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-gray-100 border-gray-200"
              onClick={() => handleQuickReply("clarify")}
            >
              👉 Clarify
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-gray-100 border-gray-200"
              onClick={() => handleQuickReply("redirect")}
            >
              🔄 Redirect
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white text-black hover:bg-gray-100 border-gray-200"
              onClick={() => handleQuickReply("acknowledge")}
            >
              👍 Acknowledge
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ai-suggestions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList className="bg-transparent border-b-0 h-12 p-0">
              <TabsTrigger
                value="ai-suggestions"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                AI Suggestions
              </TabsTrigger>
              <TabsTrigger
                value="editor"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                Editor
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ai-suggestions" className="p-4 space-y-3 mt-0">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${selectedSuggestion === index ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-200 hover:border-blue-300 dark:border-gray-700"} cursor-pointer`}
                onClick={() => selectSuggestion(index)}
              >
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                  {selectedSuggestion === index && (
                    <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="editor" className="p-4 mt-0">
            <Textarea
              placeholder="Write your reply..."
              className="min-h-[120px] resize-none text-sm user-invalid:border-red-500 user-valid:border-green-500"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSubmitting}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!replyText.trim() || isSubmitting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
