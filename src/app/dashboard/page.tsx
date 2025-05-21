"use client";

import { CommentContainer } from "@/components/comments/containers/CommentContainer";
import { Button } from "@/components/ui/button";
import { Instagram, MessageSquare, Play, Youtube } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-brand-primary" />
            <span className="text-xl font-bold text-brand-primary">PulsePilot</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Settings</Button>
            <Button variant="ghost">Help</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full space-y-2 border-r bg-muted/40 p-4 md:w-64">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Youtube className="h-4 w-4 text-red-500" />
            YouTube
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Instagram className="h-4 w-4 text-pink-500" />
            Instagram
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Play className="h-4 w-4 text-green-600" />
            Play Store
          </Button>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 bg-background p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Comments Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage comments across your social media platforms
            </p>
          </div>

          <div className="grid gap-6">
            <CommentContainer postId="youtube-post-1" title="YouTube Comments" />
            <CommentContainer postId="instagram-post-1" title="Instagram Comments" />
            <CommentContainer postId="playstore-post-1" title="Play Store Reviews" />
          </div>
        </main>
      </div>
    </div>
  );
}
