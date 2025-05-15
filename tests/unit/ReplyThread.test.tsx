import { ReplyThread } from "@/components/comments/ReplyThread";
import * as useCommentsHooks from "@/hooks/use-comments";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the useCommentThread hook
jest.mock("@/hooks/use-comments", () => ({
  useCommentThread: jest.fn(),
}));

// Mock the scrollIntoView functionality which isn't available in JSDOM
Element.prototype.scrollIntoView = jest.fn();

describe("ReplyThread", () => {
  const mockToggle = jest.fn();
  const mockReplyToComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementation for useCommentThread
    jest.mocked(useCommentsHooks.useCommentThread).mockReturnValue({
      thread: {
        commentId: "comment-1",
        totalReplies: 3,
        replies: [
          {
            replyId: "reply-1",
            text: "This is a reply",
            postedAt: "2023-05-15T11:00:00Z",
            author: {
              name: "Reply User",
              profileImageUrl: "/reply-avatar.jpg",
              platform: "youtube",
            },
          },
          {
            replyId: "reply-2",
            text: "This is another reply",
            postedAt: "2023-05-15T12:00:00Z",
            author: {
              name: "Another User",
              profileImageUrl: "/another-avatar.jpg",
              platform: "instagram",
            },
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
  });

  it("renders collapsed state when not expanded", () => {
    render(
      <ReplyThread
        commentId="comment-1"
        repliesCount={3}
        isExpanded={false}
        onToggle={mockToggle}
      />
    );

    // Check if the collapsed view is shown
    expect(screen.getByText("3 replies → Expand thread")).toBeInTheDocument();
    // Replies shouldn't be visible
    expect(screen.queryByText("This is a reply")).not.toBeInTheDocument();
  });

  it("renders expanded state with replies when expanded", () => {
    render(
      <ReplyThread commentId="comment-1" repliesCount={3} isExpanded={true} onToggle={mockToggle} />
    );

    // Check if the expanded view is shown
    expect(screen.getByText("Thread open")).toBeInTheDocument();
    // Replies should be visible
    expect(screen.getByText("This is a reply")).toBeInTheDocument();
    expect(screen.getByText("This is another reply")).toBeInTheDocument();
    // Check if author names are displayed
    expect(screen.getByText("Reply User")).toBeInTheDocument();
    expect(screen.getByText("Another User")).toBeInTheDocument();
  });

  it("calls onToggle when clicking on thread toggle button", () => {
    render(
      <ReplyThread
        commentId="comment-1"
        repliesCount={3}
        isExpanded={false}
        onToggle={mockToggle}
      />
    );

    fireEvent.click(screen.getByText("3 replies → Expand thread"));
    expect(mockToggle).toHaveBeenCalledWith("comment-1");
  });

  it("shows loading state when thread is loading", () => {
    // Mock loading state
    jest.mocked(useCommentsHooks.useCommentThread).mockReturnValue({
      thread: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
    });

    render(
      <ReplyThread commentId="comment-1" repliesCount={3} isExpanded={true} onToggle={mockToggle} />
    );

    // Check if loading skeletons are shown
    expect(screen.getAllByTestId("loading-skeleton")).toHaveLength(3);
  });

  it("renders reply to thread button when onReplyToComment is provided", () => {
    render(
      <ReplyThread
        commentId="comment-1"
        repliesCount={3}
        isExpanded={true}
        onToggle={mockToggle}
        onReplyToComment={mockReplyToComment}
      />
    );

    const replyButton = screen.getByText("Reply to thread");
    expect(replyButton).toBeInTheDocument();

    // Test click handler
    fireEvent.click(replyButton);
    expect(mockReplyToComment).toHaveBeenCalledWith("comment-1");
  });

  it("does not render anything when repliesCount is 0", () => {
    const { container } = render(
      <ReplyThread
        commentId="comment-1"
        repliesCount={0}
        isExpanded={false}
        onToggle={mockToggle}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
