import { test, expect, Page } from '@playwright/test';
import { mockComments, mockUsers, platformFilters, statusFilters, mockReplies } from '../src/lib/mock-data'; // Adjust path as necessary

// Helper function to delay execution for observation or to wait for async UI updates
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe('Critical User Flow - Dashboard', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Create a new page instance for the entire test suite run
    // This ensures that if one test fails, subsequent tests still run on a fresh page.
    // However, for true E2E sequence, state might need to be managed or tests run serially.
    // For this critical flow, we'll use one page instance to follow the sequence.
    page = await browser.newPage();
    // Navigate to the dashboard (assuming it's the root or a specific path)
    // The app should be running with NEXT_PUBLIC_USE_MOCK=true
    await page.goto('/'); 
    // Wait for the main content of the dashboard to be indicative of loaded state
    // e.g., wait for the comments feed container or sidebar to be present.
    await expect(page.getByText('Filters')).toBeVisible({ timeout: 10000 }); // Sidebar title
    await expect(page.getByPlaceholderText('Search comments...')).toBeVisible({ timeout: 10000 }); // Comments feed search
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should allow filtering comments, selecting a comment, replying, and viewing the reply', async () => {
    // --- 1. Apply Filters ---
    // Open the "Platforms" accordion in the sidebar
    await page.getByRole('button', { name: /Platforms/i }).click();
    
    // Select a platform (e.g., Instagram)
    const instagramPlatform = platformFilters.find(p => p.id === 'instagram');
    expect(instagramPlatform).toBeDefined();
    await page.getByRole('button', { name: instagramPlatform!.label }).click();
    
    // Select a status (e.g., Flagged)
    const flaggedStatus = statusFilters.find(s => s.id === 'flagged');
    expect(flaggedStatus).toBeDefined();
    await page.getByRole('button', { name: new RegExp(flaggedStatus!.label, "i") }).click();

    // Verification for filtering: 
    // This is complex. For now, we'll assume filters are applied and proceed.
    // A robust check would involve verifying that displayed comments match the criteria.
    // We can check if at least one comment is visible after filtering (if data supports it)
    // For this test, we'll assume mockComments[0] is compatible with these filters or use a known one.
    // Let's pick a comment that is known to be flagged from mock data.
    const targetComment = mockComments.find(c => c.flagged && c.platform.toLowerCase() === 'instagram');
    
    // If no such comment, let's pick a default comment for selection to ensure flow continues
    // This part needs careful handling based on actual mock data & filtering logic.
    // For now, let's use mockComments[0] and assume it becomes visible or remains visible.
    // A better E2E would have specific data setup for this.
    const commentToSelect = targetComment || mockComments[0];
    const commentAuthor = mockUsers.find(u => u.id === commentToSelect.userId)?.name;
    expect(commentAuthor).toBeDefined();

    // Wait for the feed to potentially update after filtering
    await page.waitForTimeout(1000); // Give time for UI to re-render

    // --- 2. Select a Comment ---
    // Locate the comment in the feed (e.g., by its text or author)
    // We need to ensure this comment is rendered by FixedSizeList. This can be tricky.
    // Clicking on the text of the comment.
    // If CommentCard has a data-testid or specific role, that would be better.
    // For now, using text. This assumes comment text is unique enough.
    const commentTextLocator = page.getByText(commentToSelect.text, { exact: false });
    await expect(commentTextLocator.first()).toBeVisible({timeout: 15000}); // Ensure it's visible before clicking
    await commentTextLocator.first().click();

    // Verify PostPreview updates
    // Assuming PostPreview shows the post title or author name from the selected comment's post
    await expect(page.getByText(commentToSelect.postTitle, { exact: false })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Post Details')).toBeVisible(); // Header of PostPreview

    // --- 3. Reply to Comment ---
    // In PostPreview or CommentCard, find the "Reply" button.
    // This reply button might be on the CommentCard itself, even when shown in PostPreview context,
    // or PostPreview might have its own reply mechanism.
    // Based on `CommentCard.tsx`, it has a reply button.
    // The `CommentsFeedContainer` renders `CommentCard` which includes the reply button.
    // Let's assume the selected comment is now prominent and its reply button is accessible.
    
    // The structure might be complex. The click above selected the card.
    // Now, find the reply button *within the context of the selected and previewed comment*.
    // If PostPreview re-renders the card, or if the main feed card is still the target:
    const replyButtonLocator = page.getByRole('article', { name: new RegExp(commentToSelect.author.name) }) // Find the card by author
                                   .getByRole('button', { name: /Reply/i }); 
                                   
    // A more direct approach if PostPreview has a specific structure:
    // const postPreviewPanel = page.locator('div:has-text("Post Details")').locator('..'); // Find PostPreview panel
    // const replyButtonInPreview = postPreviewPanel.getByRole('button', { name: /Reply/i });

    // For now, let's try to find a general reply button that becomes active/relevant.
    // This might need adjustment based on how focus/selection changes the UI.
    // The most reliable Reply button would be the one associated with the *selected* comment.
    // Let's assume the selected card in the main feed is still the one to interact with for reply action.
    // Or, if PostPreview has its own reply button. The current app structure seems to use a dialog.
    // The `CommentCard`'s onReply prop triggers `handleReply` in `CommentsFeedContainer`, which shows a toast (not a dialog).
    // The subtask implies a `ReplyDialog`. This means the `handleReply` or a similar mechanism
    // must be configured to open `ReplyDialog`.
    // Let's assume clicking "Reply" on the card (wherever it is most clearly identified post-selection) opens this dialog.
    
    // Try locating the reply button associated with the selected comment's card.
    // This could be inside the main feed, or if PostPreview duplicates the card.
    // Let's assume the main feed's card is still the primary interaction point for this.
    const cardLocator = page.locator(`article:has-text("${commentToSelect.text}")`); // Find the card
    await cardLocator.getByRole('button', { name: /Reply/i }).click();

    // A ReplyDialog should appear.
    // (Assuming ReplyDialog is correctly implemented and gets mounted)
    await expect(page.getByRole('dialog', { name: /Reply to/i })).toBeVisible({ timeout: 10000 });
    
    const replyTextarea = page.getByRole('dialog').getByPlaceholder(/Write a reply.../i);
    await expect(replyTextarea).toBeVisible();
    
    const uniqueReplyMessage = `This is an E2E test reply at ${new Date().toISOString()}`;
    await replyTextarea.fill(uniqueReplyMessage);
    
    await page.getByRole('dialog').getByRole('button', { name: /Send Reply/i }).click();

    // --- 4. Verify Reply ---
    // Check that the ReplyDialog closes.
    await expect(page.getByRole('dialog', { name: /Reply to/i })).not.toBeVisible({ timeout: 10000 });

    // Verify the new reply appears in the CommentReplies section.
    // This requires the CommentCard to expand its replies section.
    // First, ensure replies are expanded for the target comment.
    // The click to reply might not auto-expand. Let's try clicking "view replies".
    const viewRepliesButton = cardLocator.getByRole('button', { name: new RegExp(`${commentToSelect.replies + 1}`) }); // Replies count should increase
    // Or, if it doesn't auto-update count, find by text "replies"
    // const viewRepliesButton = cardLocator.getByRole('button', { name: /replies/i });
    
    // It's possible the reply count doesn't update immediately or the button text is just number.
    // Let's find button that toggles replies.
    // The `CommentCard` has `onToggleReplies` which has `MessageSquare` icon.
    // Let's assume replies are visible or can be made visible.
    // For mockReplies, they load with a timeout.
    // If `CommentReplies` auto-expands or shows after a reply, this is simpler.
    // The test data `mockReplies` is used by `CommentReplies`. We need to ensure our new reply is conceptually added there.
    // The E2E test won't modify `mockReplies` in the backend, but the UI should reflect the new reply.

    // Click to expand replies if not already expanded
    const repliesToggle = cardLocator.locator('button:has(svg[lucide="message-square"])'); // Lucide icon name
    const isRepliesExpanded = await repliesToggle.getAttribute('aria-expanded') === 'true'; // Assuming it has aria-expanded
    if (!isRepliesExpanded && await repliesToggle.isVisible()) { // Check visibility before clicking
        await repliesToggle.click();
    }
    
    // Wait for reply to appear
    const newReplyLocator = page.getByText(uniqueReplyMessage, { exact: true });
    await expect(newReplyLocator).toBeVisible({ timeout: 15000 }); // Increased timeout for potential async rendering of reply

    // (Optional) Check for success toast message
    // This depends on how toasts are implemented. If using Sonner (from package.json), it might be `data-sonner-toast`
    await expect(page.locator('[data-sonner-toast][data-type="success"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-sonner-toast][data-type="success"]').getByRole('button', {name: /Close|Dismiss/i }).click(); // Dismiss toast


    // --- 5. Close Post Preview ---
    // Assuming PostPreview has a close button.
    // This is not explicitly in the provided PostPreview.tsx.
    // If PostPreview is part of a drawer/modal, that would have a close button.
    // For now, let's assume selecting another comment or clearing selection would "close" it.
    // Or, if there's a specific close button added to the layout that contains PostPreview.
    // Let's assume for now that clicking the "Clear Selection" button in BulkActionsToolbar (if visible)
    // or selecting another item would implicitly close/hide the current PostPreview.
    // Or, if PostPreview is simply a section that gets replaced, selecting "All" comments might clear it.
    
    // As a placeholder, let's try to clear the selection by clicking the "All" status filter again,
    // which should reset the view and implicitly hide/reset PostPreview.
    // This is a workaround if a direct close button for PostPreview isn't obvious.
    const allStatusFilter = statusFilters.find(s => s.id === 'all');
    expect(allStatusFilter).toBeDefined();
    await page.getByRole('button', { name: new RegExp(allStatusFilter!.label, "i") }).click();
    
    // Verify PostPreview is hidden or shows "No post selected"
    await expect(page.getByText('No post selected')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(commentToSelect.postTitle, { exact: false })).not.toBeVisible();
  });
});
