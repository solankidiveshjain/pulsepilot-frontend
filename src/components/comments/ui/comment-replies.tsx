"use client"

import { memo, useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { mockReplies } from "@/lib/mock-data"

interface CommentRepliesProps {
  commentId: string
}

function CommentRepliesComponent({ commentId }: CommentRepliesProps) {
  const [loading, setLoading] = useState(true)
  const [replies, setReplies] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading replies
    const timer = setTimeout(() => {
      setReplies(mockReplies[commentId] || [])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [commentId])

  if (loading) {
    return (
      <div className="pl-8 space-y-1.5 animate-pulse">
        <div className="h-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md shimmer-effect"></div>
        <div
          className="h-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md shimmer-effect"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="h-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md shimmer-effect"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    )
  }

  if (replies.length === 0) {
    return (
      <div className="pl-8 py-2 text-center text-[10px] text-muted-foreground">No replies to this comment yet.</div>
    )
  }

  // Colors for the gradient animations
  const gradientColors = [
    "from-blue-500/20 via-purple-500/20 to-pink-500/20",
    "from-green-500/20 via-teal-500/20 to-blue-500/20",
    "from-yellow-500/20 via-orange-500/20 to-red-500/20",
    "from-pink-500/20 via-purple-500/20 to-indigo-500/20",
    "from-indigo-500/20 via-blue-500/20 to-cyan-500/20",
  ]

  return (
    <div className="pl-8 space-y-1 animate-fade-in">
      {replies.map((reply, index) => (
        <Card
          key={reply.id}
          className={`border-border/40 shadow-sm bg-gradient-to-r animate-gradient-x ${gradientColors[index % gradientColors.length]}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-2">
            <div className="flex gap-1.5">
              <Avatar className="h-5 w-5 border border-border/60">
                <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-[10px]">{reply.author.name}</span>
                    {reply.author.isOwner && (
                      <span className="text-[8px] px-1 py-0.5 bg-primary/10 text-primary rounded-full">You</span>
                    )}
                    {reply.isAiGenerated && (
                      <span className="text-[8px] px-1 py-0.5 bg-purple-500/10 text-purple-500 rounded-full flex items-center gap-0.5 ai-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                        AI
                      </span>
                    )}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-[8px] text-muted-foreground">{reply.time}</span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        {reply.timeTooltip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <p className="text-[10px] ultra-compact line-clamp-2">{reply.text}</p>

                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                  <ThumbsUp className="h-2 w-2" />
                  <span>{reply.likes}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const CommentReplies = memo(CommentRepliesComponent)
