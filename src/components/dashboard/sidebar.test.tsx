/// <reference types="vitest" />
import { beforeEach, describe, expect, it, vi } from "vitest";
// src/components/dashboard/sidebar.test.tsx
import { emotionFilters, platformFilters, statusFilters } from "@/lib/mock-data";
import type { FilterState } from "@/types";
import { act, render, screen } from "@testing-library/react"; // Added act
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

const mockOnFilterChange = vi.fn();

// Ensure initialFilters only includes properties defined in FilterState
const initialFilters: FilterState = {
  status: "all",
  search: "",
  platforms: [],
  emotions: [],
  sentiments: [],
  categories: [],
};

describe("DashboardSidebar Component", () => {
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it("should render all filter sections and titles", async () => {
    const { container } = render(
      <DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Accordion sections - check for triggers
    expect(screen.getByRole("button", { name: /Platforms/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Emotions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sentiments/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Categories/i })).toBeInTheDocument();

    // Initial a11y check, ignoring redundant-alt for platform icons
    await act(async () => {
      const results = await axe(container);
      const filtered = results.violations.filter((v: any) => v.id !== "image-redundant-alt");
      expect(filtered).toHaveLength(0);
    });
  });

  it("should render status filter buttons correctly", () => {
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);
    statusFilters.forEach((status) => {
      const statusButton = screen.getByRole("button", { name: new RegExp(status.label, "i") });
      expect(statusButton).toBeInTheDocument();
      if (status.count > 0 && status.id !== "all") {
        expect(statusButton.textContent).toContain(status.count.toString());
      }
    });
  });

  it("should call onFilterChange with the correct status when a status filter is clicked", async () => {
    const user = userEvent.setup();
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const flaggedButton = screen.getByRole("button", { name: /Flagged/i });
    await user.click(flaggedButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: "flagged" });
  });

  it("should highlight the active status filter", () => {
    const activeFilters: FilterState = { ...initialFilters, status: "flagged" };
    render(<DashboardSidebar filters={activeFilters} onFilterChange={mockOnFilterChange} />);

    const flaggedButton = screen.getByRole("button", { name: /Flagged/i });
    // Active button has default variant styling
    expect(flaggedButton).toHaveClass("bg-primary");
    const allButton = screen.getByRole("button", { name: /All/i });
    // Inactive 'All' uses outline variant styling
    expect(allButton).toHaveClass("border");
    expect(allButton).toHaveClass("bg-background");
  });

  it("should render platform filter buttons when accordion is open", async () => {
    const user = userEvent.setup();
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);
    const platformsAccordionTrigger = screen.getByRole("button", { name: /Platforms/i });
    platformFilters.forEach((platform) => {
      const matcher = new RegExp(platform.label, "i");
      expect(screen.getByRole("button", { name: matcher })).toBeInTheDocument();
      if (platform.count > 0) {
        const platformButton = screen.getByRole("button", { name: matcher });
        expect(platformButton.textContent).toContain(platform.count.toString());
      }
    });
  });

  it("should call onFilterChange correctly when a platform filter is clicked (add and remove)", async () => {
    const user = userEvent.setup();
    let currentFilters: FilterState = { ...initialFilters, platforms: [] };

    const { rerender } = render(
      <DashboardSidebar
        filters={currentFilters}
        onFilterChange={(newFilters) => {
          currentFilters = { ...currentFilters, ...newFilters };
          mockOnFilterChange(newFilters);
        }}
      />
    );

    const instagramLabel = platformFilters.find((p) => p.id === "instagram")!.label;
    const instagramButton = screen.getByRole("button", { name: new RegExp(instagramLabel, "i") });
    await user.click(instagramButton);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ platforms: ["instagram"] });

    // Rerender with updated filters to simulate parent component behavior
    rerender(
      <DashboardSidebar
        filters={currentFilters}
        onFilterChange={(newFilters) => {
          currentFilters = { ...currentFilters, ...newFilters };
          mockOnFilterChange(newFilters);
        }}
      />
    );
    // Now click again to remove
    await user.click(instagramButton);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ platforms: [] });
  });

  it("should highlight active platform filters", () => {
    const activeFilters: FilterState = { ...initialFilters, platforms: ["facebook"] };
    render(<DashboardSidebar filters={activeFilters} onFilterChange={mockOnFilterChange} />);

    const facebookButton = screen.getByRole("button", { name: /Facebook/i });
    // Active platform uses subtle variant styling
    expect(facebookButton).toHaveClass("bg-primary/10");

    const instagramButton = screen.getByRole("button", { name: /Instagram/i });
    // Inactive platform should not have subtle background
    expect(instagramButton).not.toHaveClass("bg-primary/10");
  });

  it("should allow opening and closing of other accordion sections (e.g., Emotions)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />
    );

    const emotionsAccordionTrigger = screen.getByRole("button", { name: /Emotions/i });
    const excitedLabel = emotionFilters.find((e) => e.id === "excited")!.label;
    const excitedEmotionButtonInitial = screen.queryByRole("button", {
      name: new RegExp(excitedLabel, "i"),
    });
    expect(excitedEmotionButtonInitial).not.toBeInTheDocument();

    // Open accordion
    await user.click(emotionsAccordionTrigger);
    const excitedEmotionButtonVisible = screen.getByRole("button", {
      name: new RegExp(excitedLabel, "i"),
    });
    expect(excitedEmotionButtonVisible).toBeInTheDocument();

    // Close accordion
    await user.click(emotionsAccordionTrigger);
    expect(emotionsAccordionTrigger).toHaveAttribute("aria-expanded", "false");

    // A11y check, ignoring redundant alt violations
    await act(async () => {
      const results = await axe(container);
      const filtered = results.violations.filter((v: any) => v.id !== "image-redundant-alt");
      expect(filtered).toHaveLength(0);
    });
  });
});
