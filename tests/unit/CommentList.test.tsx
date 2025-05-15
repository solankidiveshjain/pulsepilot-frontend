import { CommentList } from "@/components/comments/VirtualizedCommentList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock the hooks we use
jest.mock("@/hooks/use-comments", () => ({
  useCommentThread: () => ({
    thread: {
      commentId: "comment-1",
      totalReplies: 2,
      replies: [
        {
          replyId: "reply-1",
          text: "Test reply 1",
          postedAt: new Date().toISOString(),
          author: {
            name: "Reply User 1",
            profileImageUrl: "/images/user-reply-1.png",
            platform: "youtube",
          },
        },
        {
          replyId: "reply-2",
          text: "Test reply 2",
          postedAt: new Date().toISOString(),
          author: {
            name: "Reply User 2",
            profileImageUrl: "/images/user-reply-2.png",
            platform: "youtube",
          },
        },
      ],
    },
    isLoading: false,
  }),
}));

// Mock react-intersection-observer
jest.mock("react-intersection-observer", () => ({
  useInView: () => ({ ref: jest.fn(), inView: false }),
}));

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("CommentList", () => {
  const mockComments = Array.from({ length: 5 }, (_, i) => ({
    commentId: `comment-${i + 1}`,
    text: `Test comment ${i + 1}`,
    author: {
      name: `User ${i + 1}`,
      profileImageUrl: `/images/user-${i + 1}.png`,
      platform: "youtube",
    },
    platform: "youtube",
    likes: 10,
    repliesCount: 2,
    postedAt: new Date().toISOString(),
    read: true,
    flagged: false,
    archived: false,
    postId: `post-${i + 1}`,
    requiresAttention: false,
  }));

  it("renders comments correctly", () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={mockComments}
          isLoading={false}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={new Set()}
          onSelectComment={jest.fn()}
          onToggleThread={jest.fn()}
        />
      </QueryClientProvider>
    );

    // Check if comments are rendered
    mockComments.forEach((comment) => {
      expect(screen.getByText(comment.text)).toBeInTheDocument();
    });
  });

  it("expands threads correctly when clicked", () => {
    const queryClient = createTestQueryClient();
    const expandedThreadIds = new Set();
    const mockToggleThread = jest.fn((id) => {
      if (expandedThreadIds.has(id)) {
        expandedThreadIds.delete(id);
      } else {
        expandedThreadIds.add(id);
      }
      return expandedThreadIds;
    });

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={mockComments}
          isLoading={false}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={expandedThreadIds}
          onSelectComment={jest.fn()}
          onToggleThread={mockToggleThread}
        />
      </QueryClientProvider>
    );

    // Click on a thread toggle button
    const threadButtons = screen.getAllByText(/2 replies/i);
    fireEvent.click(threadButtons[0]);

    // Check if toggle function was called with the correct ID
    expect(mockToggleThread).toHaveBeenCalledWith("comment-1");

    // Add the comment to expanded threads and rerender
    expandedThreadIds.add("comment-1");

    rerender(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={mockComments}
          isLoading={false}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={expandedThreadIds}
          onSelectComment={jest.fn()}
          onToggleThread={mockToggleThread}
        />
      </QueryClientProvider>
    );

    // Verify replies exist in the expanded thread
    expect(screen.getByText("Test reply 1")).toBeInTheDocument();
    expect(screen.getByText("Test reply 2")).toBeInTheDocument();
  });

  it("handles selection correctly", () => {
    const queryClient = createTestQueryClient();
    const mockSelectComment = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={mockComments}
          isLoading={false}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={new Set()}
          onSelectComment={mockSelectComment}
          onToggleThread={jest.fn()}
        />
      </QueryClientProvider>
    );

    // Click on a comment to select it
    fireEvent.click(screen.getByText("Test comment 1"));
    expect(mockSelectComment).toHaveBeenCalledWith("comment-1");
  });

  it("shows loading state correctly", () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={[]}
          isLoading={true}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={new Set()}
          onSelectComment={jest.fn()}
          onToggleThread={jest.fn()}
        />
      </QueryClientProvider>
    );

    // Check if loading skeletons are rendered
    expect(screen.getAllByClassName("animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows empty state correctly", () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={[]}
          isLoading={false}
          hasNextPage={false}
          isFetchingNextPage={false}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={new Set()}
          onSelectComment={jest.fn()}
          onToggleThread={jest.fn()}
        />
      </QueryClientProvider>
    );

    // Check if empty state is rendered
    expect(screen.getByText("No comments found")).toBeInTheDocument();
  });

  it("calls onLoadMore when the load more button is clicked", () => {
    const queryClient = createTestQueryClient();
    const mockLoadMore = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={mockComments}
          isLoading={false}
          hasNextPage={true}
          isFetchingNextPage={false}
          onLoadMore={mockLoadMore}
          selectedCommentIds={new Set()}
          expandedThreadIds={new Set()}
          onSelectComment={jest.fn()}
          onToggleThread={jest.fn()}
        />
      </QueryClientProvider>
    );

    // Find and click the load more button
    const loadMoreButton = screen.getByText("Load more comments");
    fireEvent.click(loadMoreButton);

    // Check if load more function was called
    expect(mockLoadMore).toHaveBeenCalled();
  });

  it("shows proper loading state when fetching next page", () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <CommentList
          comments={mockComments}
          isLoading={false}
          hasNextPage={true}
          isFetchingNextPage={true}
          onLoadMore={jest.fn()}
          selectedCommentIds={new Set()}
          expandedThreadIds={new Set()}
          onSelectComment={jest.fn()}
          onToggleThread={jest.fn()}
        />
      </QueryClientProvider>
    );

    // Check if the loading message is shown
    expect(screen.getByText("Loading more comments...")).toBeInTheDocument();
  });
});
