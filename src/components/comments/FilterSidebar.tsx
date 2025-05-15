"use client";

import { EmojiFilterChip, FilterCategory } from "@/components/ui/EmojiFilterChip";
import { FilterChip } from "@/components/ui/FilterChip";
import { PlatformPill } from "@/components/ui/PlatformPill";
import { CommentFilters, CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// Define filter option type
type FilterOption = {
  emoji: string;
  label: string;
  value: string;
  category: FilterCategory;
};

// Define emotion filter options
const EMOTION_FILTERS: FilterOption[] = [
  { emoji: "😡", label: "Anger", value: "anger", category: "emotion" },
  { emoji: "😂", label: "Joy", value: "joy", category: "emotion" },
  { emoji: "😢", label: "Sadness", value: "sadness", category: "emotion" },
  { emoji: "😱", label: "Fear", value: "fear", category: "emotion" },
  { emoji: "😲", label: "Surprise", value: "surprise", category: "emotion" },
  { emoji: "❤️", label: "Love", value: "love", category: "emotion" },
  { emoji: "🤢", label: "Disgust", value: "disgust", category: "emotion" },
  { emoji: "😐", label: "Neutral", value: "neutral", category: "emotion" },
];

// Define sentiment filter options
const SENTIMENT_FILTERS: FilterOption[] = [
  { emoji: "👍", label: "Positive", value: "positive", category: "sentiment" },
  { emoji: "👎", label: "Negative", value: "negative", category: "sentiment" },
  { emoji: "😐", label: "Neutral", value: "neutral", category: "sentiment" },
  { emoji: "🤷", label: "Mixed", value: "mixed", category: "sentiment" },
];

// Define category filter options
const CATEGORY_FILTERS: FilterOption[] = [
  { emoji: "📦", label: "Spam", value: "spam", category: "category" },
  { emoji: "🧪", label: "Product Feedback", value: "product-feedback", category: "category" },
  { emoji: "👏", label: "Praise", value: "praise", category: "category" },
  { emoji: "⚠️", label: "Complaint", value: "complaint", category: "category" },
  { emoji: "❓", label: "Question", value: "question", category: "category" },
  { emoji: "💡", label: "Feature Request", value: "feature-request", category: "category" },
  { emoji: "🚫", label: "Irrelevant", value: "irrelevant", category: "category" },
];

export interface FilterSidebarProps {
  filters: CommentFilters;
  onFilterChange: (filters: CommentFilters) => void;
  metrics?: {
    total: number;
    flagged: number;
    unread: number;
    platformBreakdown: Record<CommentPlatform, number>;
  };
  className?: string;
  isMobile?: boolean;
  onCloseMobile?: () => void;
  selectedEmotions?: string[];
  selectedSentiments?: string[];
  selectedCategories?: string[];
  selectedCommentIds?: string[];
  onEmotionChange?: (emotions: string[]) => void;
  onSentimentChange?: (sentiments: string[]) => void;
  onCategoryChange?: (categories: string[]) => void;
  onToggleSidebar?: () => void;
}

// Sidebar section component for accordion behavior
interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: number;
  categoryColor?: string;
}

const AccordionSection = ({
  title,
  defaultOpen = false,
  children,
  badge,
  categoryColor = "text-gray-600 dark:text-gray-300",
}: AccordionSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Load from localStorage on mount if available
  useEffect(() => {
    const savedState = localStorage.getItem(`filter-section-${title.toLowerCase()}`);
    if (savedState !== null) {
      setIsOpen(savedState === "true");
    }
  }, [title]);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(`filter-section-${title.toLowerCase()}`, String(isOpen));
  }, [isOpen, title]);

  return (
    <div className="border-b border-gray-200 py-2 dark:border-gray-700/50">
      <button
        className="flex w-full items-center justify-between py-1 text-xs font-medium uppercase tracking-wide"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={cn("flex items-center gap-1.5", categoryColor)}>{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {badge}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="pb-1 pt-2">{children}</div>
      </div>
    </div>
  );
};

export const FilterSidebar = memo(function FilterSidebar({
  filters,
  onFilterChange,
  metrics,
  className,
  isMobile = false,
  onCloseMobile,
  selectedEmotions: externalSelectedEmotions,
  selectedSentiments: externalSelectedSentiments,
  selectedCategories: externalSelectedCategories,
  selectedCommentIds = [],
  onEmotionChange,
  onSentimentChange,
  onCategoryChange,
}: FilterSidebarProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const emotions = externalSelectedEmotions || selectedEmotions;
  const sentiments = externalSelectedSentiments || selectedSentiments;
  const categories = externalSelectedCategories || selectedCategories;

  // Update handlers based on whether external handlers are provided
  const updateEmotions = useCallback(
    (newEmotions: string[]) => {
      if (onEmotionChange) {
        onEmotionChange(newEmotions);
      } else {
        setSelectedEmotions(newEmotions);
      }
    },
    [onEmotionChange]
  );

  const updateSentiments = useCallback(
    (newSentiments: string[]) => {
      if (onSentimentChange) {
        onSentimentChange(newSentiments);
      } else {
        setSelectedSentiments(newSentiments);
      }
    },
    [onSentimentChange]
  );

  const updateCategories = useCallback(
    (newCategories: string[]) => {
      if (onCategoryChange) {
        onCategoryChange(newCategories);
      } else {
        setSelectedCategories(newCategories);
      }
    },
    [onCategoryChange]
  );

  // Toggle platform filter
  const togglePlatformFilter = useCallback(
    (platform: CommentPlatform) => {
      const currentPlatforms = filters.platform || [];
      const newPlatforms = currentPlatforms.includes(platform)
        ? currentPlatforms.filter((p) => p !== platform)
        : [...currentPlatforms, platform];

      onFilterChange({
        ...filters,
        platform: newPlatforms.length ? newPlatforms : undefined,
      });
    },
    [filters, onFilterChange]
  );

  // Toggle boolean filters
  const toggleFilter = useCallback(
    (key: keyof CommentFilters) => {
      onFilterChange({
        ...filters,
        [key]: !filters[key],
      });
    },
    [filters, onFilterChange]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    onFilterChange({});
    updateEmotions([]);
    updateSentiments([]);
    updateCategories([]);
  }, [onFilterChange, updateEmotions, updateSentiments, updateCategories]);

  // Toggle emoji-based filter
  const toggleEmojiFilter = useCallback(
    (value: string, category: FilterCategory) => {
      if (category === "emotion") {
        const currentEmotions = emotions;
        updateEmotions(
          currentEmotions.includes(value)
            ? currentEmotions.filter((e) => e !== value)
            : [...currentEmotions, value]
        );
      } else if (category === "sentiment") {
        const currentSentiments = sentiments;
        updateSentiments(
          currentSentiments.includes(value)
            ? currentSentiments.filter((s) => s !== value)
            : [...currentSentiments, value]
        );
      } else if (category === "category") {
        const currentCategories = categories;
        updateCategories(
          currentCategories.includes(value)
            ? currentCategories.filter((c) => c !== value)
            : [...currentCategories, value]
        );
      }

      // Currently just tracking in UI state, not sending to API
      // When API supports these filters, uncomment below
      /*
      onFilterChange({
        ...filters,
        emotions: emotions.length ? emotions : undefined,
        sentiments: sentiments.length ? sentiments : undefined,
        categories: categories.length ? categories : undefined,
      } as any);
      */
    },
    [
      filters,
      onFilterChange,
      emotions,
      sentiments,
      categories,
      updateEmotions,
      updateSentiments,
      updateCategories,
    ]
  );

  // Check if any filter is active
  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(
        (value) =>
          value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== false)
      ) ||
      emotions.length > 0 ||
      sentiments.length > 0 ||
      categories.length > 0,
    [filters, emotions, sentiments, categories]
  );

  return (
    <div
      className={cn(
        "h-[calc(100vh-80px)] w-[280px] bg-white dark:bg-gray-900",
        isMobile
          ? "fixed inset-0 z-50 h-full w-full sm:w-[280px]"
          : "flex-shrink-0 border-r border-gray-200 dark:border-gray-800",
        !isMobile && "sticky top-[80px] self-start overflow-hidden",
        className
      )}
      aria-label="Filters panel"
      role="region"
    >
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onCloseMobile}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-gray-800"
            aria-label="Close filter panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Desktop header */}
      {!isMobile && (
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center">
            <span className="text-xs font-medium uppercase tracking-wide">FILTERS</span>
          </div>
        </div>
      )}

      {/* Filter content */}
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-16">
          {/* Selected comment count indicator */}
          {selectedCommentIds && selectedCommentIds.length > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-medium">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <span>{selectedCommentIds.length}</span>
              </div>
              <span>
                {selectedCommentIds.length} comment{selectedCommentIds.length !== 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
          )}

          {/* Filter drawer toggle button */}
          <button
            onClick={() => setFilterDrawerOpen(!isFilterDrawerOpen)}
            className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium uppercase tracking-wide hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Advanced Filters</span>
            </div>
            {isFilterDrawerOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Quick Filters - always visible */}
          <AccordionSection title="Quick Filters" defaultOpen={true} categoryColor="text-primary">
            <div className="space-y-1.5">
              <FilterChip
                isSelected={!hasActiveFilters}
                onClick={clearFilters}
                className="w-full justify-start py-1"
              >
                All Comments
              </FilterChip>
              <FilterChip
                isSelected={!!filters.unread}
                onClick={() => toggleFilter("unread")}
                className="w-full justify-start py-1"
              >
                Unread
                {metrics?.unread !== undefined && (
                  <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {metrics.unread}
                  </span>
                )}
              </FilterChip>
              <FilterChip
                isSelected={!!filters.flagged}
                onClick={() => toggleFilter("flagged")}
                className="w-full justify-start py-1"
              >
                Flagged
                {metrics?.flagged !== undefined && (
                  <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    {metrics.flagged}
                  </span>
                )}
              </FilterChip>
              <FilterChip
                isSelected={!!filters.requiresAttention}
                onClick={() => toggleFilter("requiresAttention")}
                className="w-full justify-start py-1"
              >
                Requires Attention
              </FilterChip>
              <FilterChip
                isSelected={!!filters.archived}
                onClick={() => toggleFilter("archived")}
                className="w-full justify-start py-1"
              >
                Archived
              </FilterChip>
            </div>
          </AccordionSection>

          {/* Platform filters - always visible */}
          <AccordionSection
            title="Platforms"
            defaultOpen={true}
            badge={filters.platform?.length || 0}
            categoryColor="text-blue-600 dark:text-blue-400"
          >
            <div className="space-y-1.5">
              {["youtube", "instagram", "twitter"].map((platform) => (
                <PlatformPill
                  key={platform}
                  platform={platform as CommentPlatform}
                  count={metrics?.platformBreakdown?.[platform as CommentPlatform] || 0}
                  isSelected={filters.platform?.includes(platform as CommentPlatform) || false}
                  onClick={() => togglePlatformFilter(platform as CommentPlatform)}
                  className="w-full justify-start py-1"
                />
              ))}
            </div>
          </AccordionSection>

          {/* Advanced filters - collapse by default */}
          <div
            className={cn(
              "space-y-2 transition-all duration-300",
              isFilterDrawerOpen
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 overflow-hidden opacity-0"
            )}
          >
            {/* Emotions filters */}
            <AccordionSection
              title="Emotions"
              defaultOpen={false}
              badge={emotions.length || 0}
              categoryColor="text-pink-600 dark:text-pink-400"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {EMOTION_FILTERS.map((emotion) => (
                  <EmojiFilterChip
                    key={emotion.value}
                    emoji={emotion.emoji}
                    label={emotion.label}
                    category="emotion"
                    isSelected={emotions.includes(emotion.value)}
                    onClick={() => toggleEmojiFilter(emotion.value, "emotion")}
                    className="py-1"
                  />
                ))}
              </div>
            </AccordionSection>

            {/* Sentiments filters */}
            <AccordionSection
              title="Sentiments"
              defaultOpen={false}
              badge={sentiments.length || 0}
              categoryColor="text-green-600 dark:text-green-400"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {SENTIMENT_FILTERS.map((sentiment) => (
                  <EmojiFilterChip
                    key={sentiment.value}
                    emoji={sentiment.emoji}
                    label={sentiment.label}
                    category="sentiment"
                    isSelected={sentiments.includes(sentiment.value)}
                    onClick={() => toggleEmojiFilter(sentiment.value, "sentiment")}
                    className="py-1"
                  />
                ))}
              </div>
            </AccordionSection>

            {/* Categories filters */}
            <AccordionSection
              title="Categories"
              defaultOpen={false}
              badge={categories.length || 0}
              categoryColor="text-indigo-600 dark:text-indigo-400"
            >
              <div
                className={cn(
                  "space-y-1.5",
                  CATEGORY_FILTERS.length > 10 && "max-h-[280px] overflow-y-auto pr-2"
                )}
              >
                {CATEGORY_FILTERS.map((category) => (
                  <EmojiFilterChip
                    key={category.value}
                    emoji={category.emoji}
                    label={category.label}
                    category="category"
                    isSelected={categories.includes(category.value)}
                    onClick={() => toggleEmojiFilter(category.value, "category")}
                    className="w-full justify-start py-1"
                  />
                ))}
              </div>
            </AccordionSection>
          </div>
        </div>

        {/* Clear filters - fixed at bottom */}
        {hasActiveFilters && (
          <div className="sticky bottom-0 border-t border-gray-200 bg-card p-3 shadow-md dark:border-gray-800">
            <button
              className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
