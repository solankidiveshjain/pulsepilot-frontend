"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton-loader"

interface CommentRepliesProps {
  commentId: string
}

// Mock replies data
const mockReplies = {
  comment1: [
    {
      id: "reply1",
      text: "Thank you for your feedback! We're working on improving that feature in our next update.",
      author: {
        name: "PulsePilot Support",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "1 hour ago",
      likes: 3,
      isOfficial: true,
    },
    {
      id: "reply2",
      text: "I've had the same issue. Hope they fix it soon!",
      author: {
        name: "Jane Cooper",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "45 minutes ago",
      likes: 1,
    },
  ],
  comment3: [
    {
      id: "reply3",
      text: "We appreciate your enthusiasm! The new dashboard will be available to all users next week.",
      author: {
        name: "PulsePilot Support",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "3 hours ago",
      likes: 5,
      isOfficial: true,
    },
  ],
  comment7: [
    {
      id: "reply4",
      text: "Thanks for reporting this. Our team is investigating the issue.",
      author: {
        name: "PulsePilot Support",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      time: "2 hours ago",
      likes: 2,
      isOfficial: true,
    },
  ],
}

export function CommentReplies({ commentId }: CommentRepliesProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-2 py-1 animate-pulse">
        <div className="flex items-start gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 py-1">
      <Card className="border-border/30">
        <CardContent className="p-2">
          <p className="text-xs">Reply for comment ID: {commentId}</p>
        </CardContent>
      </Card>
    </div>
  )
}
