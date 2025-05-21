"use client";

import { usePostPreview } from "@/hooks/use-comments";
import { CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ExternalLink, Share, ThumbsUp, X } from "lucide-react";
import Image from "next/image";
import { memo, useEffect } from "react";

interface PostDetailsPanelProps {
  postId: string;
  onClose: () => void;
  className?: string;
}

export const PostDetailsPanel = memo(function PostDetailsPanel({
  postId,
  onClose,
  className,
}: PostDetailsPanelProps) {
  const { postPreview, isLoading } = usePostPreview(postId);
  // Uncomment and use this for fetching extra data when needed
  // const [fullPostData, setFullPostData] = useState<PostPreview | null>(null);

  // Simulate fetching additional post data
  useEffect(() => {
    if (postPreview) {
      // In a real app, you would fetch full post data from an API
      // For now, just use a delay to simulate loading
      const timer = setTimeout(() => {
        // This would be where you'd set the full post data
        // setFullPostData(postPreview);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [postPreview]);

  // Platform-specific styles
  const getPlatformStyles = (platform: CommentPlatform) => {
    switch (platform) {
      case "youtube":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "instagram":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "twitter":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Platform display name
  const getPlatformName = (platform: CommentPlatform) => {
    switch (platform) {
      case "youtube":
        return "YouTube";
      case "instagram":
        return "Instagram";
      case "twitter":
        return "X";
      default:
        return platform;
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: CommentPlatform) => {
    switch (platform) {
      case "youtube":
        return "🎬";
      case "instagram":
        return "📸";
      case "twitter":
        return "🐦";
      default:
        return "📱";
    }
  };

  if (isLoading || !postPreview) {
    return (
      <div className={cn("h-full space-y-4 border-l border-border bg-card p-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Post Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            aria-label="Close post details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="h-40 w-full animate-pulse rounded-lg bg-muted"></div>
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full overflow-auto bg-card p-4", className)}>
      {/* Header with platform info and close button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              getPlatformStyles(postPreview.platform)
            )}
          >
            {getPlatformIcon(postPreview.platform)} {getPlatformName(postPreview.platform)}
          </span>
          <span className="text-xs text-muted-foreground">
            {postPreview.mediaType === "video"
              ? "Video"
              : postPreview.mediaType === "image"
                ? "Image"
                : "Text"}{" "}
            Post
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close post details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Post thumbnail/image */}
      {postPreview.thumbnailUrl && (
        <div className="aspect-video relative mb-4 w-full overflow-hidden rounded-lg bg-muted/30 shadow-sm">
          <Image
            src={postPreview.thumbnailUrl}
            alt={postPreview.title || "Post thumbnail"}
            fill
            className="object-cover"
          />
          {postPreview.mediaType === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white shadow-md">
                <span className="text-2xl">▶️</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post title and metadata */}
      <h2 className="mb-2 text-xl font-semibold">
        {postPreview.title ||
          postPreview.caption ||
          `Post from ${getPlatformName(postPreview.platform)}`}
      </h2>

      <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          {Math.floor(Math.random() * 1000)} {/* Placeholder like count */}
        </span>
        <span>{format(new Date(), "MMM d, yyyy")}</span> {/* Placeholder date */}
      </div>

      {/* Post content/caption */}
      {postPreview.caption && (
        <div className="mb-6 whitespace-pre-line rounded-md bg-muted/10 p-3 text-sm">
          {postPreview.caption}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex items-center gap-3">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View on {getPlatformName(postPreview.platform)}</span>
        </a>

        <button className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted">
          <Share className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Related comments section */}
      <div className="mt-8 border-t border-border pt-4">
        <h3 className="mb-3 text-sm font-medium">Related Comments</h3>
        <div className="space-y-3">
          {/* Placeholder for related comments - would be populated in a real app */}
          <div className="rounded-md border bg-muted/10 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted"></div>
              <span className="text-xs font-medium">User123</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Great content as always! Looking forward to more.
            </p>
          </div>
          <div className="rounded-md border bg-muted/10 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted"></div>
              <span className="text-xs font-medium">AnotherUser</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              This is exactly what I&apos;ve been looking for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
