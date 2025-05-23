"use client"

import { useState, useEffect } from "react"
import { TopNavigation } from "@/components/dashboard/top-navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { CommentsFeed } from "@/components/dashboard/comments-feed"
import { PostPreview } from "@/components/dashboard/post-preview"
import { mockComments, mockPosts } from "@/lib/mock-data"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"

export default function DashboardPage() {
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedComment, setSelectedComment] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    platforms: [],
    emotions: [],
    sentiments: [],
    categories: [],
  })
  const isMobile = useIsMobile()

  // Set preview open when a comment is selected
  useEffect(() => {
    if (selectedComment) {
      setIsPreviewOpen(true)
    }
  }, [selectedComment])

  // Close preview panel on mobile when switching to mobile view
  useEffect(() => {
    if (isMobile && isPreviewOpen) {
      setIsPreviewOpen(false)
    }
  }, [isMobile])

  const handleCommentSelect = (comment) => {
    setSelectedComment(comment)
    // Find the post associated with this comment
    const post = mockPosts.find((p) => p.id === comment.postId)
    if (post) {
      setSelectedPost(post)
    }

    // On mobile, open the preview as a modal/sheet instead of side panel
    if (isMobile) {
      setIsPreviewOpen(true)
    }
  }

  const handleClosePostPreview = () => {
    setIsPreviewOpen(false)
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters })
  }

  // Filter comments based on current filters
  const filteredComments = mockComments.filter((comment) => {
    // Search filter
    if (filters.search && !comment.text.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "flagged" && !comment.flagged) return false
      if (filters.status === "attention" && !comment.needsAttention) return false
      if (filters.status === "archived" && !comment.archived) return false
    }

    // Platform filter
    if (filters.platforms.length > 0 && !filters.platforms.includes(comment.platform)) {
      return false
    }

    // Emotion filter
    if (filters.emotions.length > 0 && !filters.emotions.includes(comment.emotion)) {
      return false
    }

    // Sentiment filter
    if (filters.sentiments.length > 0 && !filters.sentiments.includes(comment.sentiment)) {
      return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(comment.category)) {
      return false
    }

    return true
  })

  return (
    <>
      <TopNavigation />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-background to-secondary/30">
        <div className="flex h-full max-w-screen-2xl mx-auto">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <div className="w-64 border-r border-border/30 overflow-hidden">
              <DashboardSidebar filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Filters Sidebar - Mobile */}
          {isMobile && (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="absolute left-4 top-20 z-10">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 md:hidden">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] p-0 pt-8">
                <DashboardSidebar
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters)
                    // Optionally close sidebar on filter change on mobile
                    // setIsSidebarOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Comment Feed - Responsive width */}
          <div
            className={`flex-1 overflow-hidden border-r border-border/30 ${isPreviewOpen && !isMobile ? "w-[60%]" : "w-full"}`}
          >
            <CommentsFeed
              comments={filteredComments}
              selectedComment={selectedComment}
              onCommentSelect={handleCommentSelect}
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobile={isMobile}
            />
          </div>

          {/* Post Preview Panel - Desktop */}
          {!isMobile && isPreviewOpen && (
            <div className="w-[40%] relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0 z-10"
                onClick={handleClosePostPreview}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Close preview</span>
              </Button>
              <PostPreview post={selectedPost} />
            </div>
          )}

          {/* Post Preview Panel - Mobile (as a Sheet) */}
          {isMobile && (
            <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <SheetContent side="right" className="w-[90%] p-0 pt-8">
                <PostPreview post={selectedPost} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
      <Toaster />
    </>
  )
}
