"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink, ThumbsUp, MessageSquare, Eye, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"

const platformColors = {
  YouTube: "platform-badge-youtube",
  Instagram: "platform-badge-instagram",
  X: "platform-badge-twitter",
  TikTok: "platform-badge-tiktok",
  Facebook: "platform-badge-facebook",
  LinkedIn: "platform-badge-linkedin",
}

export function PostPreview({ post }) {
  const [loading, setLoading] = useState(post ? true : false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (post) {
      // Simulate loading post details
      setLoading(true)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [post])

  if (!post) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full border-dashed border-2 border-border/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary/60" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">No post selected</h3>
              <p className="text-sm text-muted-foreground">Select a comment to preview the associated post</p>
            </div>
            <div className="flex items-center text-primary text-sm mt-2">
              <span>Select a comment</span>
              <ArrowRight className="h-4 w-4 ml-1 animate-bounce-subtle" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full overflow-auto py-2 px-3">
        <div className="sticky top-0 space-y-3">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="p-3 pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <Skeleton className="h-14 rounded-md" />
                <Skeleton className="h-14 rounded-md" />
                <Skeleton className="h-14 rounded-md" />
              </div>
              <Skeleton className="h-8 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const platformClass = platformColors[post.platform] || ""

  return (
    <div className={`h-full overflow-auto py-2 ${isMobile ? "px-2" : "px-3"}`}>
      <div className="sticky top-0 space-y-3">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Post Details</span>
              <Badge variant="outline" className={`text-[10px] ${platformClass}`}>
                {post.platform}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-sm">
              <Image
                src={post.thumbnail || "/placeholder.svg?height=200&width=360"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{post.date}</span>
              </div>

              <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">{post.caption}</p>
                  </TooltipTrigger>
                  <TooltipContent side={isMobile ? "bottom" : "left"} className="max-w-xs">
                    <p className="text-xs">{post.caption}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div className="flex flex-col items-center justify-center p-1.5 bg-muted/30 rounded-md">
                <ThumbsUp className="h-3 w-3 text-primary mb-0.5" />
                <span className="font-semibold text-xs">{post.likes}</span>
                <span className="text-[8px] text-muted-foreground">Likes</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 bg-muted/30 rounded-md">
                <MessageSquare className="h-3 w-3 text-primary mb-0.5" />
                <span className="font-semibold text-xs">{post.comments}</span>
                <span className="text-[8px] text-muted-foreground">Comments</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1.5 bg-muted/30 rounded-md">
                <Eye className="h-3 w-3 text-primary mb-0.5" />
                <span className="font-semibold text-xs">{post.views}</span>
                <span className="text-[8px] text-muted-foreground">Views</span>
              </div>
            </div>

            <Button className="w-full shadow-sm text-xs h-7" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1.5" />
                View Post
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
