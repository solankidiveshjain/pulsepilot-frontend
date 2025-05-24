"use client"

import Image from "next/image"
import * as React from "react"
import { useState, useEffect } from "react"
import { mockReplies } from "@/lib/mock-data"
import type { CommentReply } from "@/types"
import { useToast } from "@/hooks/use-toast"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, MoreHorizontal, ThumbsUp } from "lucide-react"

export function CommentReplies({ commentId }: { commentId: string }) {
  const [replies, setReplies] = useState<CommentReply[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      const relevantReplies = (mockReplies as Record<string, CommentReply[]>)[commentId] || []
      setReplies(relevantReplies)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [commentId])

  return (
    <div className="space-y-2 py-1">
      {loading ? (
        <div className="text-center py-3 text-sm text-muted-foreground">Loading replies...</div>
      ) : replies.length === 0 ? (
        <div className="text-center py-3 text-sm text-muted-foreground">No replies yet</div>
      ) : (
        replies.map((reply) => (
          <Card
            key={reply.id}
            className={`border-border/30 transition-all hover:border-border/60 ${
              reply.author.isOwner ? "bg-primary/5" : ""
            }`}
          >
            <CardContent className="p-2">
              <div className="flex gap-2">
                <Avatar className="h-6 w-6 border border-border/60">
                  <Image
                    src={reply.author.avatar || "/placeholder.svg"}
                    alt={reply.author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-xs">{reply.author.name}</span>
                      {reply.author.isOwner && (
                        <Badge className="h-4 px-1 text-[9px] bg-primary/10 text-primary flex items-center gap-0.5">
                          <CheckCircle className="h-2 w-2" />
                          <span>Official</span>
                        </Badge>
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground">{reply.time}</span>
                  </div>

                  <p className="text-xs leading-tight mb-1">{reply.text}</p>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.likes}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={5} className="w-40 comment-menu">
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={(e) => {
                            e.preventDefault()
                            // TODO: Implement copy text functionality
                            toast({ title: "Text copied (not implemented)", description: "Reply text copy action."})
                          }}
                        >
                          <svg // Using SVG directly as lucide-react doesn't have a direct 'copy' icon in this context
                            className="mr-2 h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                          <span>Copy text</span>
                        </DropdownMenuItem>
                        {reply.author.isOwner ? (
                          <>
                            <DropdownMenuItem
                              className="text-xs"
                              onClick={(e) => {
                                e.preventDefault()
                                // TODO: Implement edit functionality
                                toast({ title: "Edit action (not implemented)", description: "Edit reply action."})
                              }}
                            >
                              <svg // Using SVG for edit
                                className="mr-2 h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-xs text-destructive"
                              onClick={(e) => {
                                e.preventDefault()
                                // TODO: Implement delete functionality
                                toast({ title: "Delete action (not implemented)", description: "Delete reply action."})
                              }}
                            >
                              <svg // Using SVG for delete
                                className="mr-2 h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            className="text-xs"
                            onClick={(e) => {
                              e.preventDefault()
                              // TODO: Implement report functionality
                              toast({ title: "Report action (not implemented)", description: "Report reply action."})
                            }}
                          >
                            <svg // Using SVG for report
                              className="mr-2 h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span>Report</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
