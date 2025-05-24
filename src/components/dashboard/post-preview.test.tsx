// src/components/dashboard/post-preview.test.tsx
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostPreview } from './post-preview'; // Adjust path as necessary
import { mockPosts } from '@/mock-data'; // Assuming mockPosts are available and typed as Post[]
import type { Post } from '@/types';

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false), // Default to not mobile
}));

const testPost: Post = {
  ...mockPosts[0], // Use a base mock post
  id: 'post-123',
  title: 'Test Post Title',
  platform: 'Instagram',
  date: '2024-05-26',
  caption: 'This is a test caption for the post preview component. It can be a bit long to test truncation and tooltips.',
  likes: 1234,
  comments: 56,
  views: 7890,
  url: 'https://instagram.com/p/post-123',
  thumbnail: '/test-thumbnail.jpg',
  // Ensure other fields from Post type are present if used by the component
  userId: mockPosts[0].userId, 
  emotion: mockPosts[0].emotion, 
  time: mockPosts[0].time,
  timeTooltip: mockPosts[0].timeTooltip,
  postThumbnail: mockPosts[0].postThumbnail, // if different from main thumbnail
  postTitle: mockPosts[0].postTitle, // if different from main title
  flagged: false,
  needsAttention: false,
  replies: 0, // Assuming these are part of the Post type
  isAiGenerated: false, 
};


describe('PostPreview Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render "No post selected" message when post prop is null', () => {
    render(<PostPreview post={null} />);
    expect(screen.getByText('No post selected')).toBeInTheDocument();
    expect(screen.getByText('Select a comment to preview the associated post')).toBeInTheDocument();
  });

  it('should display loading skeletons initially when a post is provided, then render post details', async () => {
    render(<PostPreview post={testPost} />);

    // Check for loading state (skeletons)
    // Assuming CardHeader is always rendered, look for skeletons within it for title/badge
    expect(screen.getByText('Post Details').closest('div')?.querySelector('.animate-pulse, .skeleton')).toBeInTheDocument(); // More generic skeleton check
    
    // Advance timers to simulate loading completion (800ms in component)
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Wait for loading to complete and content to appear
    await waitFor(() => {
      expect(screen.queryByText('Post Details').closest('div')?.querySelector('.animate-pulse, .skeleton')).not.toBeInTheDocument();
    });
    
    // Now check for actual content
    expect(screen.getByText(testPost.title)).toBeInTheDocument();
    expect(screen.getByText(testPost.platform)).toBeInTheDocument();
  });

  it('should render all post details correctly after loading', async () => {
    render(<PostPreview post={testPost} />);
    act(() => {
      vi.advanceTimersByTime(800); // Finish loading
    });

    await waitFor(() => expect(screen.getByText(testPost.title)).toBeInTheDocument());

    // Platform badge
    expect(screen.getByText(testPost.platform)).toBeInTheDocument();
    // Thumbnail
    const image = screen.getByAltText(testPost.title);
    expect(image).toHaveAttribute('src', testPost.thumbnail);
    // Date
    expect(screen.getByText(testPost.date)).toBeInTheDocument();
    // Caption - check for the truncated part initially displayed
    expect(screen.getByText(testPost.caption, { exact: false })).toBeInTheDocument(); // exact:false due to line-clamp
    // Stats
    expect(screen.getByText(testPost.likes.toString())).toBeInTheDocument();
    expect(screen.getByText('Likes')).toBeInTheDocument();
    expect(screen.getByText(testPost.comments.toString())).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText(testPost.views.toString())).toBeInTheDocument();
    expect(screen.getByText('Views')).toBeInTheDocument();
    // View Post button
    const viewPostButton = screen.getByRole('link', { name: /View Post/i });
    expect(viewPostButton).toHaveAttribute('href', testPost.url);
    expect(viewPostButton).toHaveAttribute('target', '_blank');
  });

  it('should display full caption in a tooltip on hover (conceptual)', async () => {
    // Testing tooltip content directly can be tricky with testing-library if it's portaled.
    // We'll check for the presence of the tooltip trigger and that interaction is possible.
    const user = userEvent.setup({ delay: null }); // delay: null for immediate hover
    render(<PostPreview post={testPost} />);
    act(() => {
      vi.advanceTimersByTime(800); // Finish loading
    });
    await waitFor(() => expect(screen.getByText(testPost.title)).toBeInTheDocument());

    const captionElement = screen.getByText(testPost.caption, { exact: false });
    // TooltipProvider and TooltipTrigger are used. TooltipContent is rendered on hover/focus.
    // We can't easily grab TooltipContent if it's in a portal.
    // Instead, we verify the trigger exists and is part of the component.
    // A more robust test would involve visual regression or specific tooltip testing libraries.
    expect(captionElement.closest('[data-radix-tooltip-trigger="true"]')).toBeInTheDocument();
    
    // Simulate hover to check if it attempts to show tooltip (actual content check is hard)
    // This doesn't guarantee the tooltip is visible or has correct content,
    // but confirms the trigger mechanism is in place.
    await user.hover(captionElement);
    // No direct assertion for tooltip content here due to potential portal rendering.
    // In a real scenario, one might add a data-testid to TooltipContent for querying if not portaled,
    // or use visual testing.
  });
});
