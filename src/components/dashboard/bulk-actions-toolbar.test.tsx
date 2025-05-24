// @ts-nocheck
/// <reference types="vitest" />
import { beforeEach, describe, expect, it, vi } from "vitest";
// src/components/dashboard/bulk-actions-toolbar.test.tsx
import { useCommentsActions, useCommentsStore } from "@/components/comments/state/comments-store"; // Path to the actual store
import { useToast } from "@/hooks/use-toast";
import { mockComments } from "@/lib/mock-data"; // Updated import path to actual mock-data location
import type { Comment } from "@/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";

// Mock the store and actions
vi.mock("@/components/comments/state/comments-store", () => ({
  useCommentsStore: vi.fn(),
  useCommentsActions: vi.fn(),
}));

// Mock useToast
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

// Mock lucide-react icons for easier checking
vi.mock("lucide-react", async (importOriginal: any) => {
  const original = await importOriginal();
  return {
    ...original,
    CheckSquare: (props: any) => <svg {...props} data-testid="check-square-icon" />,
    Square: (props: any) => <svg {...props} data-testid="square-icon" />,
    X: (props: any) => <svg {...props} data-testid="x-icon" />,
    // Other icons like Reply, Archive, BookmarkIcon will be identified by button text.
  };
});

const mockedUseCommentsStore = vi.mocked(useCommentsStore);
const mockedUseCommentsActions = vi.mocked(useCommentsActions);
const mockedUseToast = vi.mocked(useToast);

// Prepare some mock comments
const testComments: Comment[] = mockComments
  .slice(0, 5)
  .map((c, i) => ({ ...c, id: `comment-${i}` }));

describe("BulkActionsToolbar Integration Tests", () => {
  let mockToastFn: ReturnType<typeof vi.fn>;
  let mockArchiveComments: ReturnType<typeof vi.fn>;
  let mockSaveCommentsForLater: ReturnType<typeof vi.fn>;
  let mockClearSelection: ReturnType<typeof vi.fn>;
  let mockToggleSelectAll: ReturnType<typeof vi.fn>;
  // Add a mock for bulk reply if needed for dialog logic later
  // let mockBulkReplyAction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();

    mockToastFn = vi.fn();
    mockedUseToast.mockReturnValue({ toast: mockToastFn } as any);

    mockArchiveComments = vi.fn();
    mockSaveCommentsForLater = vi.fn();
    mockClearSelection = vi.fn();
    mockToggleSelectAll = vi.fn();
    // mockBulkReplyAction = vi.fn();

    // Setup default mock implementation for useCommentsActions
    mockedUseCommentsActions.mockReturnValue({
      archiveComments: mockArchiveComments,
      saveCommentForLater: mockSaveCommentsForLater, // Assuming this is the action for multiple saves
      clearSelection: mockClearSelection,
      toggleSelectAll: mockToggleSelectAll,
      // Mock other actions used by the component or its parent context if necessary
      // For BulkActionsToolbar props, we'll pass these mocked actions directly or wrapped.
      // e.g. onBulkArchive will call archiveComments([id1, id2])
      // setSelectedComment: vi.fn(), etc.
    } as any); // Use 'as any' for brevity, ensure all used actions are mocked if needed by other parts
  });

  const renderToolbarWithSelection = (selectedIds: string[], totalInFeed = testComments.length) => {
    // Mock store state
    mockedUseCommentsStore.mockImplementation((selector: any) => {
      // This selector is how the parent would get selected IDs to pass to the toolbar's action handlers
      // For selectedCommentsCount, we pass it directly as a prop.
      // The toolbar itself doesn't call useCommentsStore.
      // This mock is more for verifying the *effects* of actions (like clearSelection).
      if (selector === ((state: any) => state.selectedComments)) return selectedIds;
      return undefined;
    });

    // Props for BulkActionsToolbar
    const props = {
      selectedCommentsCount: selectedIds.length,
      totalCommentsInFeed: totalInFeed,
      onToggleSelectAll: mockToggleSelectAll, // Directly pass the store action mock
      onBulkReply: vi.fn(() => {
        /* Placeholder for bulk reply logic */
      }), // Placeholder for now
      onBulkArchive: () => {
        // This function is what the toolbar calls
        mockArchiveComments(selectedIds); // Simulate parent calling store action with current selection
        mockToastFn({ title: "Comments archived" });
        mockClearSelection();
      },
      onBulkSaveForLater: () => {
        mockSaveCommentsForLater(selectedIds); // Assuming a similar pattern
        mockToastFn({ title: "Comments saved" });
        mockClearSelection();
      },
      onClearSelection: mockClearSelection, // Directly pass the store action mock
      isMobile: false,
    };

    return render(<BulkActionsToolbar {...props} />);
  };

  it("should not be visible when no comments are selected", () => {
    // We don't need to mock the store for this, as selectedCommentsCount is a prop
    const { container } = render(
      <BulkActionsToolbar
        selectedCommentsCount={0}
        totalCommentsInFeed={10}
        onToggleSelectAll={vi.fn()}
        onBulkReply={vi.fn()}
        onBulkArchive={vi.fn()}
        onClearSelection={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should be visible and show correct count when comments are selected", () => {
    renderToolbarWithSelection([testComments[0].id, testComments[1].id]);
    expect(screen.getByText("2 selected")).toBeInTheDocument();
  });

  it("should call onToggleSelectAll (wired to store action) when select-all button is clicked", async () => {
    const user = userEvent.setup();
    renderToolbarWithSelection([testComments[0].id]); // Some selected, but not all

    const selectAllButton = screen.getByTestId("square-icon").closest("button")!;
    expect(selectAllButton).toBeInTheDocument();
    await user.click(selectAllButton);

    expect(mockToggleSelectAll).toHaveBeenCalledTimes(1);
  });

  describe("Bulk Action Button Interactions", () => {
    const selectedIds = [testComments[0].id, testComments[1].id];

    beforeEach(() => {
      renderToolbarWithSelection(selectedIds);
    });

    it('should call archive action, show toast, and clear selection on "Archive" click', async () => {
      const user = userEvent.setup();
      const archiveButton = screen.getByRole("button", { name: /Archive/i });
      await user.click(archiveButton);

      expect(mockArchiveComments).toHaveBeenCalledWith(selectedIds);
      expect(mockToastFn).toHaveBeenCalledWith({ title: "Comments archived" });
      expect(mockClearSelection).toHaveBeenCalledTimes(1);
    });

    it('should call save action, show toast, and clear selection on "Save for Later" click', async () => {
      const user = userEvent.setup();
      const saveButton = screen.getByRole("button", { name: /Save for Later/i });
      await user.click(saveButton);

      expect(mockSaveCommentsForLater).toHaveBeenCalledWith(selectedIds);
      expect(mockToastFn).toHaveBeenCalledWith({ title: "Comments saved" });
      expect(mockClearSelection).toHaveBeenCalledTimes(1); // Should be 1 for this action
    });

    it('should call onClearSelection (wired to store action) when "X" button is clicked', async () => {
      const user = userEvent.setup();
      const clearButton = screen.getByTestId("x-icon").closest("button")!;
      expect(clearButton).toBeInTheDocument();
      await user.click(clearButton);

      expect(mockClearSelection).toHaveBeenCalledTimes(1);
      // Note: toast and other side effects are not part of onClearSelection prop itself
    });
  });

  // Test for "Save for Later" button visibility (already well-covered by unit tests, but can be included)
  it('"Save for Later" button should not be visible on mobile', () => {
    mockedUseCommentsStore.mockReturnValue([testComments[0].id]); // Simulate selection
    const props = {
      selectedCommentsCount: 1,
      totalCommentsInFeed: 5,
      onToggleSelectAll: vi.fn(),
      onBulkReply: vi.fn(),
      onBulkArchive: vi.fn(),
      onBulkSaveForLater: vi.fn(), // Provide the handler
      onClearSelection: vi.fn(),
      isMobile: true, // Set to mobile
    };
    render(<BulkActionsToolbar {...props} />);
    expect(screen.queryByRole("button", { name: /Save for Later/i })).not.toBeInTheDocument();
  });

  // Bulk Reply Dialog:
  // The BulkActionsToolbar only calls the onBulkReply prop.
  // Testing the dialog itself would require a separate test for the component that *renders* the dialog.
  // For this file, we just ensure the prop is called.
  it('should call onBulkReply prop when "Bulk Reply" button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnBulkReplyProp = vi.fn();
    const props = {
      selectedCommentsCount: 2,
      totalCommentsInFeed: 5,
      onToggleSelectAll: vi.fn(),
      onBulkReply: mockOnBulkReplyProp, // Test this specific prop
      onBulkArchive: vi.fn(),
      onClearSelection: vi.fn(),
      isMobile: false,
    };
    render(<BulkActionsToolbar {...props} />);

    const bulkReplyButton = screen.getByRole("button", { name: /Bulk Reply/i });
    await user.click(bulkReplyButton);
    expect(mockOnBulkReplyProp).toHaveBeenCalledTimes(1);
  });
});
