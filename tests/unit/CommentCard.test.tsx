import { CommentCard } from "@/components/comments/CommentCard";
import * as useCommentsHooks from "@/hooks/use-comments";
import { Comment } from "@/lib/types/comments";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the usePostPreview hook
jest.mock("@/hooks/use-comments", () => ({
  usePostPreview: jest.fn(),
}));

describe("CommentCard", () => {
  const mockComment: Comment = {
    commentId: "comment-1",
    text: "This is a test comment",
    postedAt: "2023-05-15T10:00:00Z",
    likes: 10,
    repliesCount: 5,
    flagged: false,
    requiresAttention: false,
    platform: "youtube",
    author: {
      name: "Test User",
      profileImageUrl: "/test-avatar.jpg",
    },
    postId: "post-1",
    read: true,
    archived: false,
  };

  const mockSelect = jest.fn();
  const mockToggleThread = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for usePostPreview
    jest.mocked(useCommentsHooks.usePostPreview).mockReturnValue({
      postPreview: {
        postId: "post-1",
        title: "Test Post",
        caption: "Test Caption",
        thumbnailUrl: "/test-thumbnail.jpg",
        platform: "youtube",
        mediaType: "video",
        postType: "post",
      },
      isLoading: false,
      isError: false,
    });
  });

  it("renders comment with correct content", () => {
    render(
      <CommentCard
        comment={mockComment}
        isSelected={false}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    // Check if the comment text is displayed
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    // Check if author name is displayed
    expect(screen.getByText("Test User")).toBeInTheDocument();
    // Check if platform is displayed
    expect(screen.getByText("YouTube")).toBeInTheDocument();
    // Check if likes count is displayed
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("calls onSelect when clicking on the comment", () => {
    render(
      <CommentCard
        comment={mockComment}
        isSelected={false}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    fireEvent.click(screen.getByText("This is a test comment"));
    expect(mockSelect).toHaveBeenCalledWith("comment-1");
  });

  it("displays selected state when isSelected is true", () => {
    const { container } = render(
      <CommentCard
        comment={mockComment}
        isSelected={true}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    // Check if the selected class is applied
    expect(container.firstChild).toHaveClass("border-primary/30");
    expect(container.firstChild).toHaveClass("bg-primary/5");
  });

  it("displays flagged state when comment is flagged", () => {
    const flaggedComment = { ...mockComment, flagged: true };
    const { container } = render(
      <CommentCard
        comment={flaggedComment}
        isSelected={false}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    // Check if the flagged indicator is shown
    expect(container.firstChild).toHaveClass("border-l-red-500");
  });

  it("displays post preview when available", () => {
    render(
      <CommentCard
        comment={mockComment}
        isSelected={false}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    // Check if post title is displayed
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("displays loading state when post preview is loading", () => {
    // Mock loading state
    jest.mocked(useCommentsHooks.usePostPreview).mockReturnValue({
      postPreview: undefined,
      isLoading: true,
      isError: false,
    });

    const { container } = render(
      <CommentCard
        comment={mockComment}
        isSelected={false}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    // Check if loading skeleton is shown
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("calls onToggleThread when clicking on replies count", () => {
    render(
      <CommentCard
        comment={mockComment}
        isSelected={false}
        onSelect={mockSelect}
        onToggleThread={mockToggleThread}
      />
    );

    // Find and click on the replies button
    fireEvent.click(screen.getByText("5 replies"));
    expect(mockToggleThread).toHaveBeenCalledWith("comment-1");
  });
});
