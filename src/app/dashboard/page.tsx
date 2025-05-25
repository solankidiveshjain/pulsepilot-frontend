"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useComments } from "@/lib/hooks/comments";
import { usePosts } from "@/lib/hooks/posts";
import type { Comment, FilterState, Post } from "@/types";
import { Filter, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

// Dynamically import CommentsFeed
const DynamicCommentsFeed = dynamic(
  () => import("@/components/dashboard/comments-feed").then((mod) => mod.CommentsFeed),
  {
    loading: () => (
      <div className="flex h-full flex-1 items-center justify-center">
        <p>Loading comments...</p>
      </div>
    ),
    ssr: false,
  }
);

// Dynamically import PostPreview
const DynamicPostPreview = dynamic(
  () => import("@/components/dashboard/post-preview").then((mod) => mod.PostPreview),
  {
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p>Loading preview...</p>
      </div>
    ),
    ssr: false,
  }
);

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
    pageSize: 50, // Fetching a larger set for client-side filtering example
  });
  const rawComments = commentsData?.items ?? [];
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Set preview open when a comment is selected
  useEffect(() => {
    if (selectedComment && !isMobile) {
      // Only auto-open preview panel on desktop
      setIsPreviewOpen(true);
    }
  }, [selectedComment, isMobile]);

  // Close preview panel on mobile when switching to mobile view
  useEffect(() => {
    if (isMobile && isPreviewOpen) {
      // This logic is tricky for mobile sheets. Typically, sheets are modal.
      // If the intent is to close a *sidebar-like* preview, this is okay.
      // But for a sheet, it's usually user-dismissed.
      // Let's assume for now it's about ensuring it's closed if it was a desktop-style panel.
      // setIsPreviewOpen(false); // This might be too aggressive if it's a sheet.
    }
  }, [isMobile, isPreviewOpen]);

  const handleCommentSelect = (comment: Comment) => {
    setSelectedComment(comment);
    const post = posts.find((p) => p.id === comment.postId);
    if (post) {
      setSelectedPost(post);
    }
    // For both desktop and mobile, ensure the preview state is explicitly set to open.
    // The rendering logic will decide whether it's a panel or a sheet.
    setIsPreviewOpen(true);
  };

  const handleClosePostPreview = () => {
    setIsPreviewOpen(false);
    setSelectedComment(null);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  // Client-side filtering:
  // This remains here as an example, but in a real-world scenario with pagination/virtualization,
  // filtering would ideally be done server-side or debounced heavily if client-side on large datasets.
  // The `CommentsFeed` component itself now handles its own display of these comments.
  const filteredComments = useMemo(() => {
    return rawComments.filter((comment) => {
      if (
        filters.search &&
        !comment.text.toLowerCase().includes(filters.search.toLowerCase()) &&
        !(
          comment.author.name &&
          comment.author.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      ) {
        return false;
      }
      if (filters.status !== "all") {
        if (filters.status === "flagged" && !comment.flagged) return false;
        if (filters.status === "attention" && !comment.needsAttention) return false;
        if (filters.status === "archived" && !comment.archived) return false;
        // Assuming "unread" might be a status. If not, this needs adjustment.
        // For now, "unread" is handled by sorting in CommentsFeed.
      }
      if (filters.platforms.length > 0 && !filters.platforms.includes(comment.platform)) {
        return false;
      }
      if (filters.emotions.length > 0 && !filters.emotions.includes(comment.emotion)) {
        return false;
      }
      if (filters.sentiments.length > 0 && !filters.sentiments.includes(comment.sentiment)) {
        return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(comment.category)) {
        return false;
      }
      return true;
    });
  }, [rawComments, filters]);

  return (
    <>
      <TopNavigation />
      <div className="from-background to-secondary/30 h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br">
        <div className="mx-auto flex h-full max-w-[theme(screens.2xl)]">
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <div className="border-border/30 w-64 flex-shrink-0 overflow-y-auto border-r">
              {" "}
              {/* Added flex-shrink-0 and overflow-y-auto */}
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
                    setIsSidebarOpen(false); // Close sidebar on filter change on mobile
                  }}
                />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Comment Feed - Responsive width */}
          {/* Use flex-1 on the parent and ensure CommentsFeed can take up that space */}
          <div className={`border-border/30 flex flex-1 flex-col overflow-hidden border-r`}>
            <DynamicCommentsFeed
              comments={filteredComments}
              selectedComment={selectedComment}
              onCommentSelect={handleCommentSelect}
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobile={isMobile}
            />
          </div>

          {/* Post Preview Panel - Desktop */}
          {!isMobile && isPreviewOpen && selectedPost && (
            <div className="border-border/30 relative w-[24rem] flex-shrink-0 overflow-y-auto border-l">
              {" "}
              {/* Added flex-shrink-0 and overflow-y-auto */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
                onClick={handleClosePostPreview}
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Close preview</span>
              </Button>
              <DynamicPostPreview post={selectedPost} />
            </div>
          )}

          {/* Post Preview Panel - Mobile (as a Sheet) */}
          {isMobile && selectedPost && (
            <Sheet
              open={isPreviewOpen}
              onOpenChange={(open) => {
                setIsPreviewOpen(open);
                if (!open) setSelectedComment(null);
              }}
            >
              <SheetContent side="right" className="w-[90%] p-0 pt-8 sm:max-w-lg">
                {" "}
                {/* Added sm:max-w-lg for better responsiveness */}
                <DynamicPostPreview post={selectedPost} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </>
  );
}
