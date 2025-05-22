"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock replies data
const mockReplies = {
  comment1: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "Thank you so much for your kind words! I'm glad the productivity tips were helpful. I'll be sharing more content like this soon!",
      time: "1 hour ago",
      timeTooltip: "Today at 2:45 PM",
      likes: 3,
      isAiGenerated: true,
    },
    {
      id: "reply2",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "Looking forward to it! Your content is always so helpful.",
      time: "45 minutes ago",
      timeTooltip: "Today at 3:00 PM",
      likes: 1,
    },
  ],
  comment2: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "That's a fair point! Tip #7 definitely works better for some people than others. I'll make a follow-up video with alternative approaches.",
      time: "4 hours ago",
      timeTooltip: "Today at 11:30 AM",
      likes: 2,
      isAiGenerated: true,
    },
  ],
  comment3: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "Great suggestion! I've actually been using the Pomodoro technique for years. I'll definitely make a dedicated video about it soon.",
      time: "20 hours ago",
      timeTooltip: "Yesterday at 7:15 PM",
      likes: 8,
    },
    {
      id: "reply2",
      author: {
        name: "Mike Thompson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "Awesome, can't wait to see it!",
      time: "19 hours ago",
      timeTooltip: "Yesterday at 8:30 PM",
      likes: 2,
    },
    {
      id: "reply3",
      author: {
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "I'd love to see that too. The Pomodoro technique changed my work habits completely.",
      time: "18 hours ago",
      timeTooltip: "Yesterday at 9:45 PM",
      likes: 3,
    },
  ],
  comment4: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "Consistency is definitely the hardest part! Try setting your alarm for the same time every day and put it across the room so you have to get up to turn it off. After a couple of weeks, it becomes much easier!",
      time: "2 days ago",
      timeTooltip: "Monday at 10:15 AM",
      likes: 5,
      isAiGenerated: true,
    },
  ],
  comment6: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "For indoor shots, I use f/2.8, ISO 400, and a shutter speed of 1/60. I also have two softbox lights positioned at 45-degree angles. I'll do a lighting setup tutorial soon!",
      time: "5 days ago",
      timeTooltip: "Last Friday at 3:20 PM",
      likes: 12,
    },
  ],
  comment7: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "I'm really sorry to hear about your experience. The battery life can be improved with some settings adjustments. Please email me directly and I'll help troubleshoot the issues you're having.",
      time: "6 days ago",
      timeTooltip: "Last Thursday at 2:10 PM",
      likes: 3,
      isAiGenerated: true,
    },
    {
      id: "reply2",
      author: {
        name: "Ryan Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "Thanks, I'll send you an email today.",
      time: "6 days ago",
      timeTooltip: "Last Thursday at 4:45 PM",
      likes: 1,
    },
  ],
  comment8: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "I'm so glad my content has been helpful! I'm actually planning to launch coaching sessions next month. I'll announce all the details soon!",
      time: "5 days ago",
      timeTooltip: "Last Friday at 11:30 AM",
      likes: 8,
    },
  ],
  comment10: [
    {
      id: "reply1",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "I personally use Notion for notes and tasks, and it syncs beautifully across all devices. For quick notes, Google Keep is fantastic. Both have great mobile apps!",
      time: "6 days ago",
      timeTooltip: "Last Thursday at 9:15 AM",
      likes: 7,
    },
    {
      id: "reply2",
      author: {
        name: "Sophia Martinez",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      text: "Thanks! I'll check out Notion. I've been using Evernote but looking for something better.",
      time: "6 days ago",
      timeTooltip: "Last Thursday at 10:30 AM",
      likes: 2,
    },
    {
      id: "reply3",
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        isOwner: true,
      },
      text: "Notion is definitely worth trying! The learning curve is a bit steeper than Evernote, but the flexibility is amazing.",
      time: "5 days ago",
      timeTooltip: "Last Friday at 8:45 AM",
      likes: 3,
      isAiGenerated: true,
    },
  ],
}

// Colors for the gradient animations
const gradientColors = [
  "from-blue-500/20 via-purple-500/20 to-pink-500/20",
  "from-green-500/20 via-teal-500/20 to-blue-500/20",
  "from-yellow-500/20 via-orange-500/20 to-red-500/20",
  "from-pink-500/20 via-purple-500/20 to-indigo-500/20",
  "from-indigo-500/20 via-blue-500/20 to-cyan-500/20",
]

export function CommentReplies({ commentId }) {
  const [loading, setLoading] = useState(true)
  const [replies, setReplies] = useState([])

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
                <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
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
