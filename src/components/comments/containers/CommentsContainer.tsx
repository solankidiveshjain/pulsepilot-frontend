import { useComments } from "@/hooks/useComments";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/comments";
import React from "react";
import { CommentDetails } from "../ui/molecules/CommentDetails";
import { CommentFilters, type FilterOption, type SortOption } from "../ui/molecules/CommentFilters";
import { CommentList } from "../ui/molecules/CommentList";

interface CommentsContainerProps {
  className?: string;
}

export function CommentsContainer({ className }: CommentsContainerProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSort, setSelectedSort] = React.useState<SortOption>("newest");
  const [selectedFilters, setSelectedFilters] = React.useState<FilterOption[]>(["all"]);
  const [selectedCommentId, setSelectedCommentId] = React.useState<string>();

  const { comments = [], isLoading, error, updateStatus } = useComments();

  const filteredComments = React.useMemo(() => {
    let result = [...comments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (comment) =>
          comment.text.toLowerCase().includes(query) ||
          comment.author.name.toLowerCase().includes(query)
      );
    }

    // Apply status and sentiment filters
    if (selectedFilters.length > 0 && selectedFilters[0] !== "all") {
      result = result.filter((comment) =>
        selectedFilters.some((filter) => comment.status === filter || comment.sentiment === filter)
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "most-liked":
        result.sort((a, b) => b.metadata.likes - a.metadata.likes);
        break;
      case "most-replied":
        result.sort((a, b) => b.metadata.replies - a.metadata.replies);
        break;
    }

    return result;
  }, [comments, searchQuery, selectedFilters, selectedSort]);

  const selectedComment = React.useMemo(
    () => comments.find((c: Comment) => c.id === selectedCommentId),
    [comments, selectedCommentId]
  );

  const handleCommentSelect = React.useCallback((comment: Comment) => {
    setSelectedCommentId(comment.id);
  }, []);

  const handleReply = React.useCallback(() => {
    // TODO: Implement reply functionality
    console.log("Reply to comment:", selectedCommentId);
  }, [selectedCommentId]);

  const handleArchive = React.useCallback(() => {
    if (!selectedCommentId) return;
    updateStatus({ id: selectedCommentId, status: "archived" });
  }, [selectedCommentId, updateStatus]);

  const handleFlag = React.useCallback(() => {
    if (!selectedCommentId) return;
    // TODO: Implement flag functionality
    console.log("Flag comment:", selectedCommentId);
  }, [selectedCommentId]);

  const handleResolve = React.useCallback(() => {
    if (!selectedCommentId) return;
    updateStatus({ id: selectedCommentId, status: "resolved" });
  }, [selectedCommentId, updateStatus]);

  if (error) {
    return (
      <div className={cn("flex h-full items-center justify-center", className)}>
        <p className="text-destructive">Error loading comments</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("flex h-full items-center justify-center", className)}>
        <p className="text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <CommentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedFilters={selectedFilters}
        onFilterChange={setSelectedFilters}
      />
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-2">
        <div className="h-full overflow-hidden">
          <CommentList
            comments={filteredComments}
            selectedCommentId={selectedCommentId}
            onCommentSelect={handleCommentSelect}
          />
        </div>
        {selectedComment && (
          <div className="h-full overflow-auto">
            <CommentDetails
              comment={selectedComment}
              onReply={handleReply}
              onArchive={handleArchive}
              onFlag={handleFlag}
              onResolve={handleResolve}
            />
          </div>
        )}
      </div>
    </div>
  );
}
