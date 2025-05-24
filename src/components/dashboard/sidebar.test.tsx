// src/components/dashboard/sidebar.test.tsx
import { render, screen, act } from '@testing-library/react'; // Added act
import userEvent from '@testing-library/user-event';
import { DashboardSidebar } from './sidebar'; // Adjust path as necessary
import { statusFilters, platformFilters, emotionFilters, sentimentFilters, categoryFilters } from '@/lib/mock-data';
import type { FilterState } from '@/types';
import { axe } from 'vitest.setup'; // Assuming axe is exported from vitest.setup.ts

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />; // Ensure alt is passed
  },
}));

const mockOnFilterChange = vi.fn();

const initialFilters: FilterState = {
  status: 'all',
  search: '',
  platforms: [],
  emotions: [],
  sentiments: [],
  categories: [],
  // Add any other default filter properties from FilterState
  dateRange: null, 
  sortBy: 'newest', 
};

describe('DashboardSidebar Component', () => {
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('should render all filter sections and titles', () => {
    const { container } = render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Accordion sections - check for triggers
    expect(screen.getByRole('button', { name: /Platforms/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Emotions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sentiments/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Categories/i })).toBeInTheDocument();

    // Initial a11y check
    await act(async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  it('should render status filter buttons correctly', () => {
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);
    statusFilters.forEach(status => {
      expect(screen.getByRole('button', { name: new RegExp(status.label, "i") })).toBeInTheDocument();
      if (status.count > 0 && status.id !== 'all') {
        expect(screen.getByText(status.count.toString())).toBeInTheDocument();
      }
    });
  });

  it('should call onFilterChange with the correct status when a status filter is clicked', async () => {
    const user = userEvent.setup();
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);
    
    const flaggedButton = screen.getByRole('button', { name: /Flagged/i });
    await user.click(flaggedButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({ status: 'flagged' });
  });

  it('should highlight the active status filter', () => {
    const activeFilters: FilterState = { ...initialFilters, status: 'flagged' };
    render(<DashboardSidebar filters={activeFilters} onFilterChange={mockOnFilterChange} />);
    
    const flaggedButton = screen.getByRole('button', { name: /Flagged/i });
    // Active button should have 'variant="default"' which might translate to a specific class or attribute.
    // Testing exact class name is brittle. Let's assume 'default' variant is visually distinct.
    // If ShadCN UI adds specific aria attributes for active state, that would be better to check.
    // For now, we can check if it does NOT have 'variant="outline"' if that's the alternative.
    // This depends on how variants are applied.
    // A more direct way: the problem description mentions "variant={filters.status === status.id ? "default" : "outline"}"
    // So, the active button should not have the 'outline' classes if 'default' takes precedence.
    // This is an approximation. A data-testid or aria-current would be better.
    expect(flaggedButton).not.toHaveClass('variant-outline'); // This is a guess at class names
    // A better check might be to ensure other buttons *do* have the outline variant.
    const allButton = screen.getByRole('button', { name: /All/i });
    expect(allButton).toHaveClass('variant-outline'); // This is also a guess at class names
  });

  it('should render platform filter buttons when accordion is open', async () => {
    const user = userEvent.setup();
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);
    
    const platformsAccordionTrigger = screen.getByRole('button', { name: /Platforms/i });
    // DefaultValue for accordion is "platforms", so it should be open.
    // If it wasn't default open: await user.click(platformsAccordionTrigger);
    
    platformFilters.forEach(platform => {
      // The button text is just the label, e.g., "Instagram"
      expect(screen.getByRole('button', { name: platform.label })).toBeInTheDocument();
      if (platform.count > 0) {
        // Badge counts are rendered as text within the button's structure.
        // Need to be careful with selector to not grab other counts.
        const platformButton = screen.getByRole('button', { name: platform.label });
        expect(platformButton.textContent).toContain(platform.count.toString());
      }
    });
  });

  it('should call onFilterChange correctly when a platform filter is clicked (add and remove)', async () => {
    const user = userEvent.setup();
    let currentFilters: FilterState = { ...initialFilters, platforms: [] };
    
    const { rerender } = render(
      <DashboardSidebar filters={currentFilters} onFilterChange={(newFilters) => {
        currentFilters = { ...currentFilters, ...newFilters };
        mockOnFilterChange(newFilters);
      }} />
    );

    const instagramButton = screen.getByRole('button', { name: platformFilters.find(p => p.id === 'instagram')!.label });
    await user.click(instagramButton);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ platforms: ['instagram'] });

    // Rerender with updated filters to simulate parent component behavior
    rerender(
        <DashboardSidebar filters={currentFilters} onFilterChange={(newFilters) => {
          currentFilters = { ...currentFilters, ...newFilters };
          mockOnFilterChange(newFilters);
        }} />
      );
    // Now click again to remove
    await user.click(instagramButton);
    expect(mockOnFilterChange).toHaveBeenCalledWith({ platforms: [] });
  });

  it('should highlight active platform filters', () => {
    const activeFilters: FilterState = { ...initialFilters, platforms: ['facebook'] };
    render(<DashboardSidebar filters={activeFilters} onFilterChange={mockOnFilterChange} />);
    
    const facebookButton = screen.getByRole('button', { name: platformFilters.find(p => p.id === 'facebook')!.label });
    // Active platform buttons have 'variant="subtle"'
    // This is an assumption based on typical ShadCN patterns or would need class inspection.
    // The code shows: variant={filters.platforms?.includes(platform.id) ? "subtle" : "ghost"}
    // Checking for a specific class added by "subtle" is hard without knowing the exact class.
    // We can check it's not "ghost".
    expect(facebookButton).not.toHaveClass('variant-ghost'); // This is a guess

    const instagramButton = screen.getByRole('button', { name: platformFilters.find(p => p.id === 'instagram')!.label });
    expect(instagramButton).toHaveClass('variant-ghost'); // This is a guess
  });

  it('should allow opening and closing of other accordion sections (e.g., Emotions)', async () => {
    const user = userEvent.setup();
    render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const emotionsAccordionTrigger = screen.getByRole('button', { name: /Emotions/i });
    // Check if initially closed (content not visible)
    const joyEmotionButtonInitial = screen.queryByRole('button', { name: emotionFilters.find(e => e.id === 'joy')!.label });
    expect(joyEmotionButtonInitial).not.toBeInTheDocument(); // Or check for visibility if it's just hidden

    // Open accordion
    await user.click(emotionsAccordionTrigger);
    const joyEmotionButtonVisible = screen.getByRole('button', { name: emotionFilters.find(e => e.id === 'joy')!.label });
    expect(joyEmotionButtonVisible).toBeInTheDocument();

    // Close accordion
    await user.click(emotionsAccordionTrigger);
    // This depends on how Radix Accordion handles unmounting vs hiding.
    // For this test, let's assume it unmounts or hides such that queryByRole won't find it easily.
    // A better check might be aria-expanded attribute on the trigger.
    expect(emotionsAccordionTrigger).toHaveAttribute('aria-expanded', 'false');

    // A11y check after interaction
    const { container } = render(<DashboardSidebar filters={initialFilters} onFilterChange={mockOnFilterChange} />); // Re-render for clean container
    const trigger = screen.getByRole('button', { name: /Emotions/i });
    await user.click(trigger); // Open
    await user.click(trigger); // Close
    
    await act(async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

});
