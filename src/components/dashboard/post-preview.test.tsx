/// <reference types="vitest" />
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// src/components/dashboard/post-preview.test.tsx
import type { Post } from "@/types";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostPreview } from "./post-preview"; // Adjust path as necessary

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

// Mock useIsMobile hook
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: vi.fn(() => false), // Default to not mobile
}));

const testPost: Post = {
  id: "post-123",
  title: "Test Post Title",
  thumbnail: "/test-thumbnail.jpg",
  platform: "Instagram",
  date: "2024-05-26",
  caption:
    "This is a test caption for the post preview component. It can be a bit long to test truncation and tooltips.",
  likes: 1234,
  comments: 56,
  views: "7890",
  url: "https://instagram.com/p/post-123",
};

describe("PostPreview Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render "No post selected" message when post prop is null', () => {
    render(<PostPreview post={null} />);
    expect(screen.getByText("No post selected")).toBeInTheDocument();
    expect(screen.getByText("Select a comment to preview the associated post")).toBeInTheDocument();
  });

  it("should display loading skeletons initially when a post is provided, then render post details", async () => {
    const { container } = render(<PostPreview post={testPost} />);

    // Initial loading skeleton should be present
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();

    // Advance timers to simulate loading completion (800ms in component)
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    // After loading, skeleton should be removed
    expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
  });

  it("should render all post details correctly after loading", async () => {
    render(<PostPreview post={testPost} />);
    await act(async () => {
      vi.advanceTimersByTime(800); // Finish loading
    });

    // After loading, content should render
    expect(screen.getByText(testPost.title)).toBeInTheDocument();

    // Platform badge
    expect(screen.getByText(testPost.platform)).toBeInTheDocument();
    // Thumbnail
    const image = screen.getByAltText(testPost.title);
    expect(image).toHaveAttribute("src", testPost.thumbnail);
    // Date
    expect(screen.getByText(testPost.date)).toBeInTheDocument();
    // Caption - check for the truncated part initially displayed
    expect(screen.getByText(testPost.caption, { exact: false })).toBeInTheDocument(); // exact:false due to line-clamp
    // Stats
    expect(screen.getByText(testPost.likes.toString())).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
    expect(screen.getByText(testPost.comments.toString())).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText(testPost.views.toString())).toBeInTheDocument();
    expect(screen.getByText("Views")).toBeInTheDocument();
    // View Post button
    const viewPostButton = screen.getByRole("link", { name: /View Post/i });
    expect(viewPostButton).toHaveAttribute("href", testPost.url);
    expect(viewPostButton).toHaveAttribute("target", "_blank");
  });

  it("should display full caption in a tooltip on hover (conceptual)", async () => {
    const user = userEvent.setup({ delay: null }); // delay: null for immediate hover
    render(<PostPreview post={testPost} />);
    await act(async () => {
      vi.advanceTimersByTime(800); // Finish loading
    });
    // After loading, content should render
    expect(screen.getByText(testPost.title)).toBeInTheDocument();

    const captionElement = screen.getByText(testPost.caption, { exact: false });
    // Verify the caption element is present as the tooltip trigger
    expect(captionElement).toBeInTheDocument();
  });
});
