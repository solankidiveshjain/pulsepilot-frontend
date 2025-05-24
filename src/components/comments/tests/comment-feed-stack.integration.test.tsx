// src/components/comments/tests/comment-feed-stack.integration.test.tsx
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'; // Added act
import userEvent from '@testing-library/user-event';
import CommentsFeedContainer from '../containers/comments-feed-container'; // Updated import path
import { useComments } from '@/lib/hooks/comments'; // Updated import path
import { mockComments as rawMockComments, mockUsers, mockReplies } from '@/mock-data'; // Updated import path
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCommentsStore, useCommentsActions } from '@/components/comments/state/comments-store';
import { useToast } from '@/hooks/use-toast';
import type { Comment } from '@/types';
import { axe } from 'vitest.setup'; // Assuming axe is exported from vitest.setup.ts

// Prepare mock comments with author details
const mockComments: Comment[] = rawMockComments.map(comment => ({
  ...comment,
  author: mockUsers.find(u => u.id === comment.userId) || mockUsers[0],
  // Ensure other required fields like postThumbnail and postTitle are present
  postThumbnail: comment.postThumbnail || '/placeholder-thumbnail.jpg',
  postTitle: comment.postTitle || 'Sample Post Title',
}));


// Mock hooks
vi.mock('@/lib/hooks/comments');
vi.mock('@/components/comments/state/comments-store');
vi.mock('@/hooks/use-toast');

const mockedUseComments = vi.mocked(useComments);
const mockedUseCommentsStore = vi.mocked(useCommentsStore);
const mockedUseCommentsActions = vi.mocked(useCommentsActions);
const mockedUseToast = vi.mocked(useToast);

// Default mock actions for the store (can be overridden in tests)
const mockDefaultActions = {
  setSelectedComment: vi.fn(),
  toggleExpandComment: vi.fn(),
  toggleExpandReply: vi.fn(),
  toggleCommentSelection: vi.fn(),
  archiveComments: vi.fn(),
  flagComment: vi.fn(),
  markCommentAsImportant: vi.fn(),
  deleteComment: vi.fn(),
  saveCommentForLater: vi.fn(),
  updateFilters: vi.fn(),
};

// A simple QueryClient provider for the tests
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for testing
      staleTime: Infinity, // Prevent immediate refetch in tests
    },
  },
});

const TestWrapper: React.FC<{ children: React.ReactNode, client?: QueryClient }> = ({ children, client }) => {
  const queryClient = client || createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Helper to provide a basic mock implementation for useComments
const mockUseCommentsImplementation = ({
  items = [],
  isLoading = false,
  isError = false,
  error = null,
  refetch = vi.fn(),
  // Add other properties like fetchNextPage, hasNextPage if your hook uses them
}: Partial<ReturnType<typeof useComments>> = {}) => {
  mockedUseComments.mockReturnValue({
    data: { items, total: items.length, page: 1, pageSize: 20, totalPages: 1 }, // Adjust based on actual structure
    isLoading,
    isError,
    error,
    refetch,
    // Mock other potentially accessed properties to avoid undefined errors
    isFetching: false,
    isSuccess: !isLoading && !isError,
    // ...any other fields your hook returns
  } as any); // Use 'as any' for brevity or ensure all hook props are mocked
};


// Helper to mock useCommentsStore state
const mockStoreState = (state: Partial<ReturnType<typeof useCommentsStore>> = {}) => {
  const defaultState = {
    filters: { status: 'all', search: '' },
    selectedComment: null,
    selectedComments: [],
    expandedComments: [],
    expandedReplies: [],
    // Add other default state properties
  };
  mockedUseCommentsStore.mockImplementation((selector: any) => {
    const currentState = { ...defaultState, ...state };
    return selector(currentState);
  });
};


describe('CommentFeed Stack Integration Tests', () => {
  let mockToastFn = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockToastFn = vi.fn();
    mockedUseToast.mockReturnValue({ toast: mockToastFn } as any);
    mockedUseCommentsActions.mockReturnValue(mockDefaultActions); // Reset actions to default
    mockStoreState(); // Reset store state to default
  });

  describe('CommentsFeedContainer Rendering and Initial State', () => {
    it('should display loading state correctly', () => {
      mockUseCommentsImplementation({ isLoading: true });
      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument(); // Assuming LoadingSpinner has role="status" and aria-label or text
    });

    it('should display empty state when no comments are returned', () => {
      mockUseCommentsImplementation({ items: [] });
      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      expect(screen.getByText(/No comments found/i)).toBeInTheDocument();
    });

    it('should display error state and allow retry', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Network Error';
      const refetchMock = vi.fn();
      mockUseCommentsImplementation({ isError: true, error: new Error(errorMessage) as any, refetch: refetchMock });
      
      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      expect(screen.getByText(`Error loading comments: ${errorMessage}`)).toBeInTheDocument();
      
      const retryButton = screen.getByRole('button', { name: /Retry/i });
      await user.click(retryButton);
      expect(refetchMock).toHaveBeenCalledTimes(1);
    });

    it('should render comments when data is successfully fetched and have no a11y violations', async () => {
      mockUseCommentsImplementation({ items: mockComments.slice(0, 2) });
      const { container } = render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      expect(screen.getByText(mockComments[0].text)).toBeInTheDocument();
      expect(screen.getByText(mockComments[1].text)).toBeInTheDocument();
      expect(screen.getByText(mockComments[0].author.name)).toBeInTheDocument();

      // Accessibility check for the rendered comments feed (which includes CommentCards)
      // Run axe after the component has settled.
      await act(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('Search and Filtering', () => {
    it('should call updateFilters on search input and submit', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: mockComments }); // Provide some initial data
      const updateFiltersMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, updateFilters: updateFiltersMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/Search comments.../i);
      await user.type(searchInput, 'test search');
      // The search happens on form submit in the component
      const form = screen.getByRole('form'); // Assuming the search input is in a form
      fireEvent.submit(form); // userEvent.submit also works if form has a submit button

      expect(updateFiltersMock).toHaveBeenCalledWith({ search: 'test search' });
    });

    it('should clear search when clear button is clicked', async () => {
        const user = userEvent.setup();
        mockUseCommentsImplementation({ items: mockComments });
        const updateFiltersMock = vi.fn();
        mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, updateFilters: updateFiltersMock });
        // Initialize store with a search value to make the clear button visible
        mockStoreState({ filters: { status: 'all', search: 'initial search' } });
  
        render(
          <TestWrapper>
            <CommentsFeedContainer />
          </TestWrapper>
        );
        
        // Set initial value for controlled input
        const searchInput = screen.getByPlaceholderText(/Search comments.../i);
        await user.clear(searchInput); // Clear any pre-filled value if necessary
        await user.type(searchInput, 'initial search'); // Simulate user typing or component setting initial value

        const clearButton = screen.getByRole('button', { name: /Clear search/i });
        await user.click(clearButton);
  
        expect(updateFiltersMock).toHaveBeenCalledWith({ search: "" });
        // Also check if the input field is cleared. This depends on searchValue state being updated.
        // To test this properly, the searchValue state in CommentsFeedContainer should be updated
        // upon clearSearch, which it is.
        expect(searchInput).toHaveValue("");
      });
  });

  describe('Keyboard Navigation', () => {
    it('should select next/previous comment on ArrowDown/ArrowUp', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: mockComments.slice(0, 3) });
      const setSelectedCommentMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, setSelectedComment: setSelectedCommentMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      
      // Focus the container or an element within it to enable keyboard shortcuts
      // Here, we assume the body or a top-level div can catch these events.
      // In a real scenario, ensure the component or its parent has focus.
      document.body.focus();

      await user.keyboard('{ArrowDown}');
      expect(setSelectedCommentMock).toHaveBeenCalledWith(mockComments[0]);
      
      // Simulate selectedComment being updated in the store for the next selection
      mockStoreState({ selectedComment: mockComments[0] });
      await user.keyboard('{ArrowDown}');
      expect(setSelectedCommentMock).toHaveBeenCalledWith(mockComments[1]);

      mockStoreState({ selectedComment: mockComments[1] });
      await user.keyboard('{ArrowUp}');
      expect(setSelectedCommentMock).toHaveBeenCalledWith(mockComments[0]);
    });
  });
  
  describe('CommentCard Interactions via CommentsFeedContainer', () => {
    it('should call toggleCommentSelection when checkbox is clicked', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      const toggleCommentSelectionMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, toggleCommentSelection: toggleCommentSelectionMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      // Assuming checkbox is identifiable by role or a test-id.
      // Let's assume the checkbox is part of the button structure or has a specific role.
      // If it's just a visual SVG, we might need to click its container button.
      // The current CommentCard has a button wrapper for the checkbox.
      const checkboxButton = screen.getByRole('button', { name: "" }); // This might be too generic, refine selector
      // A better way if SVGs are used: find the button that toggles selection.
      // The button is inside CommentCard, we need to find it.
      // Let's assume the checkbox is the first interactive element in the card for selection.
      // This part is tricky without a specific test-id on the checkbox button.
      // The structure is: Card -> CardContent -> div -> div (selection & thumbnail) -> Button (for checkbox)
      
      // Let's find the card first
      const commentCard = screen.getByText(mockComments[0].text).closest('div[role="button"]'); // Assuming card itself is clickable for selection
      // If the checkbox is a separate button:
      const selectionButton = screen.getByText(mockComments[0].author.name) // Find an element in the card
                                  .closest('article') // Assuming CommentCard is an article or similar landmark
                                  ?.querySelector('button[aria-label*="elect comment"]'); // Hypothetical aria-label

      // Given the current structure, the selection button is not distinctly labeled.
      // Let's try finding it by its visual representation or a more specific structural query.
      // The button is the first child button in the div that contains the avatar.
      // This is fragile. Adding a test-id or specific aria-label to the checkbox button is recommended.
      
      // For now, let's assume we can find it by its position relative to the avatar.
      // This is not ideal:
      // const avatar = screen.getByAltText(mockComments[0].author.name);
      // const selectionButtonContainer = avatar.previousElementSibling; 
      // The button is the first child of the div that's a sibling to the main content area of the card.
      // Let's find the card, then navigate.
      const commentTextElement = screen.getByText(mockComments[0].text);
      const cardRoot = commentTextElement.closest('article'); // Assuming CommentCard's root is <Card> which might render as <article> or <div>
      expect(cardRoot).toBeInTheDocument();

      // The checkbox button is inside the first child div of CardContent, then inside the first child div of that.
      // <CardContent> -> <div class="flex gap-2"> -> <div class="flex flex-col items-center ..."> -> <Button for checkbox />
      const flexGap2Div = cardRoot?.querySelector('.flex.gap-2');
      const firstInnerDiv = flexGap2Div?.firstElementChild;
      const selectionButton = firstInnerDiv?.querySelector('button'); // First button in that div

      if (selectionButton) {
        await user.click(selectionButton);
        expect(toggleCommentSelectionMock).toHaveBeenCalledWith(mockComments[0].id);
      } else {
        throw new Error("Could not find the selection checkbox button with current selectors. Consider adding a data-testid.");
      }
    });

    it('should call onSelect when the card body is clicked', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      const setSelectedCommentMock = vi.fn();
      // Note: onSelect in CommentCard calls setSelectedComment from the store actions
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, setSelectedComment: setSelectedCommentMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      
      // Click on the comment text to select the card
      const commentTextElement = screen.getByText(mockComments[0].text);
      await user.click(commentTextElement); 
      
      expect(setSelectedCommentMock).toHaveBeenCalledWith(mockComments[0]);
    });


    it('should call onAction with "archive" when archive action is clicked in dropdown', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      const archiveCommentsMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, archiveComments: archiveCommentsMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      const moreOptionsButton = screen.getByRole('button', { name: /more horizontal/i });
      await user.click(moreOptionsButton);

      const archiveButton = await screen.findByRole('menuitem', { name: /Archive/i });
      await user.click(archiveButton);

      expect(archiveCommentsMock).toHaveBeenCalledWith([mockComments[0].id]);
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Comment archived",
      }));
    });
    
    it('should call onAction with "flag" when flag action is clicked in dropdown', async () => {
        const user = userEvent.setup();
        mockUseCommentsImplementation({ items: [mockComments[0]] });
        const flagCommentMock = vi.fn();
        mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, flagComment: flagCommentMock });
  
        render(
          <TestWrapper>
            <CommentsFeedContainer />
          </TestWrapper>
        );
  
        const moreOptionsButton = screen.getByRole('button', { name: /more horizontal/i }); // Lucide icon name
        await user.click(moreOptionsButton);
  
        const flagButton = await screen.findByRole('menuitem', { name: /Flag comment/i });
        await user.click(flagButton);
  
        expect(flagCommentMock).toHaveBeenCalledWith(mockComments[0].id, true); // As per handleCommentAction
        expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
          title: "Comment flagged for review",
        }));
      });

    it('should call toggleExpandReply when "View replies" is clicked', async () => {
        const user = userEvent.setup();
        const commentWithReplies = { ...mockComments[0], replies: 5 };
        mockUseCommentsImplementation({ items: [commentWithReplies] }); // This comment has 5 replies
        const toggleExpandReplyMock = vi.fn();
        mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, toggleExpandReply: toggleExpandReplyMock });
  
        render(
          <TestWrapper>
            <CommentsFeedContainer />
          </TestWrapper>
        );
  
        // Find the button by its text content which includes the number of replies
        const viewRepliesButton = screen.getByRole('button', { name: (content, element) => content.startsWith(String(commentWithReplies.replies)) });
        await user.click(viewRepliesButton);
  
        expect(toggleExpandReplyMock).toHaveBeenCalledWith(commentWithReplies.id);
      });

    it('should call onReply when reply button is clicked', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      // onReply in CommentCard calls handleReply in CommentsFeedContainer, which shows a toast
      // No specific store action is called directly by onReply, so we check the toast.

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      
      const replyButton = screen.getByRole('button', { name: /Reply/i });
      await user.click(replyButton);

      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Reply Dialog",
        description: `Replying to ${mockComments[0].author.name}`,
      }));
    });

    it('should call toggleExpandComment when "See more" is clicked for long comments', async () => {
      const user = userEvent.setup();
      const longComment = { ...mockComments[0], text: "This is a very long comment that definitely exceeds the one hundred and eighty character limit for truncation and therefore should display a see more button to allow the user to expand it and read the full content." };
      mockUseCommentsImplementation({ items: [longComment] });
      const toggleExpandCommentMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, toggleExpandComment: toggleExpandCommentMock });
      
      // Initial state: comment is not expanded
      mockStoreState({ expandedComments: [] });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      const seeMoreButton = screen.getByRole('button', { name: /See more/i });
      await user.click(seeMoreButton);

      expect(toggleExpandCommentMock).toHaveBeenCalledWith(longComment.id);
      
      // Simulate comment being expanded in store to show "Show less"
      mockStoreState({ expandedComments: [longComment.id] });
      // Re-render or update component state if necessary. Here, CommentsFeedContainer should re-render based on store change.
      // We need to ensure the component re-renders with the new state for "Show less" to appear.
      // In a real app, this would happen automatically. For testing, if `rerender` is needed, use it.
      // For now, let's assume CommentsFeedContainer re-renders from store update.
      // The text of the button itself doesn't change in CommentCard, it's always "See more" or "Show less" based on `isExpanded`.
      // The actual text shown is determined by `isExpanded`.
      // The button text itself is "See more" or "Show less" based on `isExpanded` prop.
      // `CommentCard` receives `isExpanded` from `CommentsFeedContainer` which reads from `expandedComments` store.
      // So, if `toggleExpandComment` is called, and the store updates, the prop `isExpanded` would change.
      // The button text is "See more" / "Show less", not "See more" / "ChevronRight".
      // The test should check that `toggleExpandComment` is called. The visual change is secondary for this unit of interaction.
    });

    it('should have no a11y violations when a comment card is fully interactive', async () => {
      // This test focuses on a single CommentCard's a11y after interactions
      const singleComment = { ...mockComments[0], replies: 2 };
      mockUseCommentsImplementation({ items: [singleComment] });
      mockStoreState({ 
        selectedComment: singleComment, 
        expandedComments: [singleComment.id], // Assume it's expanded
        expandedReplies: [singleComment.id], // And replies are shown
      });
      
      // Mock replies for the CommentReplies component if it fetches them
      // (CommentReplies in the provided code uses a timeout and mockReplies)
      if (!mockReplies[singleComment.id] || mockReplies[singleComment.id].length === 0) {
        mockReplies[singleComment.id] = [
          { id: 'reply-axe-1', text: 'Axe test reply 1', author: mockUsers[1], time: '1m', likes: 0 },
        ];
      }

      const { container } = render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      // Wait for replies to render if CommentReplies has async aspects
      await waitFor(() => expect(screen.getByText('Axe test reply 1')).toBeInTheDocument());

      // Open dropdown menu on the comment card
      const user = userEvent.setup();
      const moreOptionsButton = screen.getByRole('button', { name: /more horizontal/i });
      await user.click(moreOptionsButton);
      await screen.findByRole('menuitem', { name: /Flag comment/i }); // Wait for menu to be open

      // Accessibility check with open dropdown and replies visible
      await act(async () => {
        const results = await axe(container, {
          // Optionally, configure rules for this specific check if needed
          // e.g., to ignore color-contrast if it's problematic in JSDOM
        });
        expect(results).toHaveNoViolations();
      });
    });

    it('should call onAction with "save" when save action is clicked', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      const saveCommentForLaterMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, saveCommentForLater: saveCommentForLaterMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      const moreOptionsButton = screen.getByRole('button', { name: /more horizontal/i });
      await user.click(moreOptionsButton);

      const saveButton = await screen.findByRole('menuitem', { name: /Save for later/i });
      await user.click(saveButton);

      expect(saveCommentForLaterMock).toHaveBeenCalledWith(mockComments[0].id);
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Comment saved for later",
      }));
    });

    it('should call onAction with "delete" when delete action is clicked', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      const deleteCommentMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, deleteComment: deleteCommentMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      const moreOptionsButton = screen.getByRole('button', { name: /more horizontal/i });
      await user.click(moreOptionsButton);

      const deleteButton = await screen.findByRole('menuitem', { name: /Delete/i });
      await user.click(deleteButton);

      expect(deleteCommentMock).toHaveBeenCalledWith(mockComments[0].id);
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Comment deleted",
      }));
    });

    it('should call onAction with "important" when mark as important action is clicked', async () => {
      const user = userEvent.setup();
      mockUseCommentsImplementation({ items: [mockComments[0]] });
      const markCommentAsImportantMock = vi.fn();
      mockedUseCommentsActions.mockReturnValue({ ...mockDefaultActions, markCommentAsImportant: markCommentAsImportantMock });

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );

      const moreOptionsButton = screen.getByRole('button', { name: /more horizontal/i });
      await user.click(moreOptionsButton);

      const importantButton = await screen.findByRole('menuitem', { name: /Mark as important/i });
      await user.click(importantButton);

      expect(markCommentAsImportantMock).toHaveBeenCalledWith(mockComments[0].id);
      expect(mockToastFn).toHaveBeenCalledWith(expect.objectContaining({
        title: "Comment marked as important",
      }));
    });
  });

  describe('CommentReplies Rendering', () => {
    it('should render CommentReplies when a comment is expanded for replies', async () => {
      const commentIdWithReplies = mockComments[0].id;
      mockUseCommentsImplementation({ items: mockComments }); // All comments
      // Simulate that this specific comment has its replies expanded in the store
      mockStoreState({ expandedReplies: [commentIdWithReplies] }); 
      
      // Assuming mockReplies has entries for this commentId
      if (!mockReplies[commentIdWithReplies] || mockReplies[commentIdWithReplies].length === 0) {
        // Add mock replies if not present for this test
        mockReplies[commentIdWithReplies] = [
          { id: 'reply1', text: 'This is a reply', author: mockUsers[1], time: '2m ago', likes: 0 },
        ];
      }

      render(
        <TestWrapper>
          <CommentsFeedContainer />
        </TestWrapper>
      );
      
      // Wait for replies to be potentially loaded (CommentReplies has its own internal loading)
      // Check for text from one of the replies
      await waitFor(() => {
        expect(screen.getByText('This is a reply')).toBeInTheDocument();
      });
      // Check for the author of the reply
      expect(screen.getByText(mockUsers[1].name)).toBeInTheDocument();
    });

    it('should display "No replies" message if replies are expanded but none exist', async () => {
        const commentIdWithNoReplies = mockComments[1].id; // Assume this comment has no replies
        mockUseCommentsImplementation({ items: mockComments });
        mockStoreState({ expandedReplies: [commentIdWithNoReplies] });
  
        // Ensure mockReplies is empty for this commentId
        mockReplies[commentIdWithNoReplies] = []; 
  
        render(
          <TestWrapper>
            <CommentsFeedContainer />
          </TestWrapper>
        );
  
        await waitFor(() => {
          expect(screen.getByText(/No replies to this comment yet/i)).toBeInTheDocument();
        });
      });
  });

});
