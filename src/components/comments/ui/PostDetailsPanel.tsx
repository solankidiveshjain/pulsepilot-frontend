"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, MessageSquare, Share2, ThumbsUp, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Post } from "../models";

interface PostDetailsPanelProps {
  postId: string;
  onClose: () => void;
}

export function PostDetailsPanel({ postId, onClose }: PostDetailsPanelProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPostDetails() {
      setLoading(true);
      setError(null);

      try {
        // Replace with actual API call
        const response = await fetch(`/api/posts/${postId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch post details: ${response.statusText}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Unable to load post details. Please try again later.");

        // For demo purposes, create a mock post after a delay
        setTimeout(() => {
          setPost({
            postId,
            title: "Sample post title",
            content:
              "This is a sample post content for demonstration purposes. In a real application, this would be fetched from the API.",
            platform: "instagram",
            timestamp: new Date().toISOString(),
            author: {
              id: "author-1",
              name: "Sample Author",
              avatarUrl: "https://via.placeholder.com/150",
            },
            likes: 125,
            comments: 24,
            shares: 12,
            thumbnailUrl: "https://via.placeholder.com/640x360",
            url: "https://example.com/post/sample",
          });
          setError(null);
        }, 1000);
      } finally {
        setLoading(false);
      }
    }

    fetchPostDetails();
  }, [postId]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-base font-semibold">Post Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="mt-6 h-40 w-full rounded-md" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-base font-semibold">Post Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[calc(100%-60px)] items-center justify-center p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-900/30 dark:bg-red-900/10">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show post details
  if (!post) return null;

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-4">
        <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-base font-semibold">Post Details</h3>
        <button onClick={onClose} className="rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        {/* Post title */}
        <h2 className="text-xl font-bold">{post.title}</h2>

        {/* Post author and metadata */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={`${post.author.name}'s profile`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {post.author?.name?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.author?.name}</span>
              <Badge variant="outline" className="text-xs">
                {post.platform}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Post image/thumbnail if available */}
        {post.thumbnailUrl && (
          <div className="mt-4 overflow-hidden rounded-md">
            <Image
              src={post.thumbnailUrl}
              alt="Post thumbnail"
              width={400}
              height={225}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Post content */}
        <div className="mt-4 whitespace-pre-wrap text-sm">{post.content}</div>

        {/* Post engagement metrics */}
        <div className="mt-6 flex items-center gap-6 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>{post.shares || 0}</span>
          </div>
        </div>

        {/* Link to original post */}
        {post.url && (
          <div className="mt-4">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View original post
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
