"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { TopNavigation } from "@/components/dashboard/top-navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { useCommentsStore } from "@/components/comments/state/comments-store"
import { KeyboardShortcutsGuide } from "@/components/keyboard-shortcuts-guide"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

// Dynamically import components for better performance
const CommentsFeedContainer = dynamic(
  () => import("@/components/comments/containers/comments-feed-container").then((mod) => mod.CommentsFeedContainer),
  { ssr: false },
)

const PostPreview = dynamic(() => import("@/components/dashboard/post-preview").then((mod) => mod.PostPreview), {
  ssr: false,
})

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const selectedPost = useCommentsStore((state) => state.selectedPost)
  const isPreviewOpen = useCommentsStore((state) => state.isPreviewOpen)
  const setIsPreviewOpen = useCommentsStore((state) => state.setIsPreviewOpen)

  const isMobile = useIsMobile()

  const handleClosePostPreview = () => {
    setIsPreviewOpen(false)
  }

  // Set up keyboard shortcut to open shortcuts guide
  useKeyboardShortcuts([
    {
      keys: { key: "?" },
      handler: () => setIsShortcutsOpen(true),
    },
  ])

  return (
    <ErrorBoundary>
      <TopNavigation />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-background to-secondary/30">
        <div className="flex h-full max-w-screen-2xl mx-auto">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <div className="w-64 border-r border-border/30 overflow-hidden">
              <DashboardSidebar />
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
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Comment Feed - Responsive width */}
          <div
            className={`flex-1 overflow-hidden border-r border-border/30 ${isPreviewOpen && !isMobile ? "w-[60%]" : "w-full"}`}
          >
            {/* Keyboard Shortcuts Button */}
            <div className="absolute right-4 top-20 z-10">
              <KeyboardShortcutsGuide />
            </div>

            <CommentsFeedContainer />
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
    </ErrorBoundary>
  )
}
