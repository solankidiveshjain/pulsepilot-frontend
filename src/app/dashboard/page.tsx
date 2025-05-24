"use client";

import { CommentsFeed } from "@/components/dashboard/comments-feed";
import { PostPreview } from "@/components/dashboard/post-preview";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useComments } from "@/lib/hooks/comments";
import { usePosts } from "@/lib/hooks/posts";
import type { Comment, FilterState, Post } from "@/types";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const teamId = "mock-team";
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    platforms: [],
    emotions: [],
    sentiments: [],
    categories: [],
  });
  // Fetch posts and comments
  const { data: postsData, isLoading: postsLoading } = usePosts(teamId, { page: 1, pageSize: 20 });
  const posts = postsData?.items ?? [];
  const { data: commentsData, isLoading: commentsLoading } = useComments(teamId, {
    archived: filters.status === "archived",
    flagged: filters.status === "flagged",
    page: 1,
    pageSize: 50,
  });
  const rawComments = commentsData?.items ?? [];
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Set preview open when a comment is selected
  useEffect(() => {
    if (selectedComment) {
      setIsPreviewOpen(true);
    }
  }, [selectedComment]);

  // Close preview panel on mobile when switching to mobile view
  useEffect(() => {
    if (isMobile && isPreviewOpen) {
      setIsPreviewOpen(false);
    }
  }, [isMobile, isPreviewOpen]);

  const handleCommentSelect = (comment: Comment) => {
    setSelectedComment(comment);
    // Find the post associated with this comment
    const post = posts.find((p) => p.id === comment.postId);
    if (post) {
      setSelectedPost(post);
    }

    // On mobile, open the preview as a modal/sheet instead of side panel
    if (isMobile) {
      setIsPreviewOpen(true);
    }
  };

  const handleClosePostPreview = () => {
    setIsPreviewOpen(false);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Filter comments based on current filters
  const filteredComments = rawComments.filter((comment) => {
    // Search filter
    if (filters.search && !comment.text.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "flagged" && !comment.flagged) return false;
      if (filters.status === "attention" && !comment.needsAttention) return false;
      if (filters.status === "archived" && !comment.archived) return false;
    }

    // Platform filter
    if (filters.platforms.length > 0 && !filters.platforms.includes(comment.platform)) {
      return false;
    }

    // Emotion filter
    if (filters.emotions.length > 0 && !filters.emotions.includes(comment.emotion)) {
      return false;
    }

    // Sentiment filter
    if (filters.sentiments.length > 0 && !filters.sentiments.includes(comment.sentiment)) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(comment.category)) {
      return false;
    }

    return true;
  });

  return (
    <>
      <TopNavigation />
      <div className="from-background to-secondary/30 h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br">
        <div className="mx-auto flex h-full max-w-[theme(screens.2xl)]">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <div className="border-border/30 w-64 overflow-hidden border-r">
              <DashboardSidebar filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Filters Sidebar - Mobile */}
          {isMobile && (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="absolute top-20 left-4 z-10">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 md:hidden">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] p-0 pt-8">
                <DashboardSidebar
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters);
                    // Optionally close sidebar on filter change on mobile
                    // setIsSidebarOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Comment Feed - Responsive width */}
          <div
            className={`border-border/30 flex-1 overflow-hidden border-r ${isPreviewOpen && !isMobile ? "w-[60%]" : "w-full"}`}
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
            <div className="relative w-[40%]">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
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
    </>
  );
}
