/// <reference types="vitest" />
import { beforeEach, describe, expect, it, vi } from "vitest";
// src/components/dashboard/sidebar.test.tsx
import { categoryFilters, emotionFilters, platformFilters, sentimentFilters, statusFilters } from "@/lib/mock-data";
import type { FilterCounts, FilterState } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react"; // Added act and waitFor
import userEvent from "@testing-library/user-event"; // ensure this package is installed
import { axe } from "../../../vitest.setup"; // Import axe from root vitest.setup.ts
import { DashboardSidebar } from "./sidebar"; // Adjust path as necessary

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />; // Ensure alt is passed
  },
}));

// Mock fetch
vi.stubGlobal('fetch', vi.fn());

const mockFilterCounts: FilterCounts = {
  platforms: { youtube: 5, instagram: 3, tiktok: 0, twitter: 2, facebook: 2, linkedin: 0 },
  emotions: { excited: 3, angry: 2, curious: 4, happy: 3, sad: 1 },
  sentiments: { positive: 6, negative: 3, neutral: 4 },
  categories: { product: 5, vip: 2, spam: 1, general: 5 },
  status: { all: 20, flagged: 3, attention: 2, archived: 5 },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for tests
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const defaultProps = {
  filters: {
    status: "all",
    search: "",
    platforms: [],
    emotions: [],
    sentiments: [],
    categories: [],
  } as FilterState,
  onFilterChange: vi.fn(),
};

describe("DashboardSidebar Component", () => {
  beforeEach(() => {
    defaultProps.onFilterChange.mockClear();
    (fetch as vi.Mock).mockReset();
    queryClient.clear(); // Clear query cache before each test
  });

  it("should render all filter sections and titles", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFilterCounts });
    const { container } = render(
      <DashboardSidebar {...defaultProps} />
      , { wrapper: TestWrapper });

    expect(screen.getByText("Filters")).toBeInTheDocument();
    await waitFor(() => { // Ensure data is loaded before checking sections
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Platforms/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Emotions/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Sentiments/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Categories/i })).toBeInTheDocument();
    });

    // Initial a11y check, ignoring redundant-alt for platform icons
    await act(async () => {
      const results = await axe(container);
      const filteredResults = results.violations.filter((v: any) => v.id !== "image-redundant-alt");
      expect(filteredResults).toHaveLength(0);
    });
  });

  it('should display loading skeletons while fetching counts', async () => {
    (fetch as vi.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    render(<DashboardSidebar {...defaultProps} />, { wrapper: TestWrapper });

    // Check for skeleton loaders in status section (example: "Flagged")
    // Status buttons are always visible, so we look for skeletons within them
    const flaggedButton = screen.getByRole('button', { name: /Flagged/i });
    expect(flaggedButton.querySelector('.ml-1.h-3\\.5.w-6')).toBeInTheDocument(); // SkeletonLoader class

    // For accordion sections, they might be closed initially.
    // We can check that count numbers are not present.
    // Example for platform "youtube" which should have count 5 if loaded:
    expect(screen.queryByText(mockFilterCounts.platforms.youtube.toString())).toBeNull();
    // Example for emotion "excited" which should have count 3 if loaded:
    expect(screen.queryByText(mockFilterCounts.emotions.excited.toString())).toBeNull();
  });

  it('should display fetched counts in badges after loading', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFilterCounts,
    });
    render(<DashboardSidebar {...defaultProps} />, { wrapper: TestWrapper });

    // Example for status "Flagged" (count: 3)
    await waitFor(() => {
      const flaggedFilterButton = screen.getByText('Flagged').closest('button');
      expect(flaggedFilterButton).not.toBeNull();
      // The badge is a child of the button, look for text content '3'
      const badge = Array.from(flaggedFilterButton!.querySelectorAll('span')).find(span => span.textContent === '3');
      expect(badge).toBeInTheDocument();
    });

    // Example for platform "youtube" (count: 5)
    // Accordions are open by default in this component.
    await waitFor(() => {
      const youtubePlatformButton = screen.getByText('YouTube').closest('button');
      expect(youtubePlatformButton).not.toBeNull();
      const badge = Array.from(youtubePlatformButton!.querySelectorAll('span')).find(span => span.textContent === '5');
      expect(badge).toBeInTheDocument();
    });
    
    // Example for emotion "Curious" (count: 4)
    await waitFor(() => {
      const curiousEmotionButton = screen.getByText('Curious').closest('button');
      expect(curiousEmotionButton).not.toBeNull();
      const badge = Array.from(curiousEmotionButton!.querySelectorAll('span')).find(span => span.textContent === '4');
      expect(badge).toBeInTheDocument();
    });

    // Example for sentiment "Positive" (count: 6)
    await waitFor(() => {
      const positiveSentimentButton = screen.getByText('Positive').closest('button');
      expect(positiveSentimentButton).not.toBeNull();
      const badge = Array.from(positiveSentimentButton!.querySelectorAll('span')).find(span => span.textContent === '6');
      expect(badge).toBeInTheDocument();
    });
    
    // Example for category "Product Feedback" (count: 5)
    await waitFor(() => {
      const productCategoryButton = screen.getByText('Product Feedback').closest('button');
      expect(productCategoryButton).not.toBeNull();
      const badge = Array.from(productCategoryButton!.querySelectorAll('span')).find(span => span.textContent === '5');
      expect(badge).toBeInTheDocument();
    });
  });

  it('should not render badges for filters with zero count', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFilterCounts, // uses mockFilterCounts where tiktok is 0
    });
    render(<DashboardSidebar {...defaultProps} />, { wrapper: TestWrapper });

    // Example for platform "TikTok" (count: 0)
    await waitFor(() => {
      const tiktokPlatformButton = screen.getByText('TikTok').closest('button');
      expect(tiktokPlatformButton).not.toBeNull();
      // Check that no span with text '0' or any number is present as a badge.
      // The badge itself (the component) might still exist but be empty or styled differently.
      // Current implementation: no badge rendered if count is 0.
      const badge = Array.from(tiktokPlatformButton!.querySelectorAll('span')).find(span => /^\d+$/.test(span.textContent!));
      expect(badge).toBeUndefined();
    });
  });

  it('should handle API error gracefully', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal Server Error" }), // Mock error response
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<DashboardSidebar {...defaultProps} />, { wrapper: TestWrapper });

    await waitFor(() => {
      // Check that no counts are displayed. Example for "youtube"
      const youtubePlatformButton = screen.getByText('YouTube').closest('button');
      const badge = Array.from(youtubePlatformButton!.querySelectorAll('span')).find(span => /^\d+$/.test(span.textContent!));
      expect(badge).toBeUndefined();
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });


  // --- Existing tests adapted for QueryClientProvider and async loading ---

  it("should call onFilterChange with the correct status when a status filter is clicked", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFilterCounts });
    const user = userEvent.setup();
    render(<DashboardSidebar {...defaultProps} />, { wrapper: TestWrapper });

    await waitFor(() => { // Ensure buttons are rendered with counts
      expect(screen.getByText('Flagged').closest('button')).toBeInTheDocument();
    });
    
    const flaggedButton = screen.getByRole("button", { name: /Flagged/i });
    await user.click(flaggedButton);

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ status: "flagged" });
  });

  it("should highlight the active status filter", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFilterCounts });
    const activeFilters: FilterState = { ...defaultProps.filters, status: "flagged" };
    render(<DashboardSidebar {...defaultProps} filters={activeFilters} />, { wrapper: TestWrapper });

    await waitFor(() => {
      const flaggedButton = screen.getByRole("button", { name: /Flagged/i });
      expect(flaggedButton).toHaveClass("bg-primary");
      const allButton = screen.getByRole("button", { name: /All/i });
      expect(allButton).toHaveClass("border");
      expect(allButton).toHaveClass("bg-background");
    });
  });

  it("should call onFilterChange correctly when a platform filter is clicked (add and remove)", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFilterCounts });
    const user = userEvent.setup();
    let currentFilters: FilterState = { ...defaultProps.filters, platforms: [] };
    const onFilterChangeWithStateUpdate = (newFilters: Partial<FilterState>) => {
        currentFilters = { ...currentFilters, ...newFilters };
        defaultProps.onFilterChange(newFilters); // Call the original mock
      };


    const { rerender } = render(
      <DashboardSidebar
        filters={currentFilters}
        onFilterChange={onFilterChangeWithStateUpdate}
      />, { wrapper: TestWrapper }
    );
    
    const instagramLabel = platformFilters.find((p) => p.id === "instagram")!.label;
    await waitFor(() => {
        expect(screen.getByRole("button", { name: new RegExp(instagramLabel, "i")})).toBeInTheDocument();
    });
    const instagramButton = screen.getByRole("button", { name: new RegExp(instagramLabel, "i") });

    await user.click(instagramButton);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ platforms: ["instagram"] });

    // Rerender with updated filters to simulate parent component behavior
    queryClient.setQueryData(['filterCounts'], mockFilterCounts); // Ensure data is still there
    rerender(
      <DashboardSidebar
        filters={currentFilters} // currentFilters is updated by onFilterChangeWithStateUpdate
        onFilterChange={onFilterChangeWithStateUpdate}
      />
    );
     // Now click again to remove
    await user.click(instagramButton);
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({ platforms: [] });
  });

  it("should highlight active platform filters", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFilterCounts });
    const activeFilters: FilterState = { ...defaultProps.filters, platforms: ["facebook"] };
    render(<DashboardSidebar {...defaultProps} filters={activeFilters} />, { wrapper: TestWrapper });

    await waitFor(() => {
      const facebookButton = screen.getByRole("button", { name: /Facebook/i });
      expect(facebookButton).toHaveClass("bg-primary/10");

      const instagramButton = screen.getByRole("button", { name: /Instagram/i });
      expect(instagramButton).not.toHaveClass("bg-primary/10");
    });
  });

  it("should allow opening and closing of other accordion sections (e.g., Emotions)", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: true, json: async () => mockFilterCounts });
    const user = userEvent.setup();
    const { container } = render(
      <DashboardSidebar {...defaultProps} />, { wrapper: TestWrapper }
    );

    const emotionsAccordionTrigger = screen.getByRole("button", { name: /Emotions/i });
    // Accordion items are rendered but hidden by default via parent `div[hidden]`
    // So we check for visibility after click.
    
    // Open accordion
    await user.click(emotionsAccordionTrigger);
    await waitFor(() => {
        const excitedLabel = emotionFilters.find((e) => e.id === "excited")!.label;
        const excitedEmotionButtonVisible = screen.getByRole("button", { name: new RegExp(excitedLabel, "i") });
        expect(excitedEmotionButtonVisible).toBeVisible();
    });


    // Close accordion
    await user.click(emotionsAccordionTrigger);
    await waitFor(() => {
        expect(emotionsAccordionTrigger).toHaveAttribute("aria-expanded", "false");
    });


    // A11y check, ignoring redundant alt violations
    await act(async () => {
      const results = await axe(container);
      const filtered = results.violations.filter((v: any) => v.id !== "image-redundant-alt");
      expect(filtered).toHaveLength(0);
    });
  });
});
