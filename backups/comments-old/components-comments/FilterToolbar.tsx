import { ContextLabel } from "@/components/ui/ContextLabel";
import { EmojiFilterChip, EmojiFilterGroup, FilterCategory } from "@/components/ui/EmojiFilterChip";
import { FilterChip, FilterChipGroup } from "@/components/ui/FilterChip";
import { PlatformPill, PlatformPillGroup } from "@/components/ui/PlatformPill";
import { SortDropdown, SortOption } from "@/components/ui/SortDropdown";
import { CommentFilters, CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// Define sort options
const SORT_OPTIONS: SortOption[] = [
  { label: "Recent", value: "recent" },
  { label: "Most Replies", value: "most-replies" },
  { label: "Oldest", value: "oldest" },
  { label: "AI Priority", value: "ai-priority" },
];

// Define emotion filter options
const EMOTION_FILTERS = [
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
const SENTIMENT_FILTERS = [
  { emoji: "👍", label: "Positive", value: "positive", category: "sentiment" },
  { emoji: "👎", label: "Negative", value: "negative", category: "sentiment" },
  { emoji: "😐", label: "Neutral", value: "neutral", category: "sentiment" },
  { emoji: "🤷", label: "Mixed", value: "mixed", category: "sentiment" },
];

// Define category filter options
const CATEGORY_FILTERS = [
  { emoji: "📦", label: "Spam", value: "spam", category: "category" },
  { emoji: "🧪", label: "Product Feedback", value: "product-feedback", category: "category" },
  { emoji: "👏", label: "Praise", value: "praise", category: "category" },
  { emoji: "⚠️", label: "Complaint", value: "complaint", category: "category" },
  { emoji: "❓", label: "Question", value: "question", category: "category" },
  { emoji: "💡", label: "Feature Request", value: "feature-request", category: "category" },
  { emoji: "🚫", label: "Irrelevant", value: "irrelevant", category: "category" },
];

// Extend CommentFilters type with our new filter properties
interface ExtendedCommentFilters extends CommentFilters {
  sortBy?: string;
  emotions?: string[];
  sentiments?: string[];
  categories?: string[];
}

export interface FilterToolbarProps {
  filters: CommentFilters;
  onFilterChange: (filters: CommentFilters) => void;
  metrics?: {
    total: number;
    flagged: number;
    unread: number;
    platformBreakdown: Record<CommentPlatform, number>;
  };
  className?: string;
}

// Legacy components kept for backwards compatibility
// They can be removed once all usages are migrated to the new components

// Platform filter option
const PlatformOption = memo(
  ({
    platform,
    count,
    selected,
    onClick,
  }: {
    platform: CommentPlatform;
    count: number;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
        selected ? "bg-primary/10 text-primary" : "hover:bg-muted"
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        {platform === "youtube" ? "▶️" : platform === "instagram" ? "📷" : "🐦"}
        <span className="capitalize">{platform}</span>
      </span>
      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {count}
      </span>
    </button>
  )
);

PlatformOption.displayName = "PlatformOption";

// Filter pill component
const FilterPill = memo(
  ({
    label,
    count,
    active,
    onClick,
  }: {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      className={cn(
        "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        active ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      {label}
      {count !== undefined && (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">{count}</span>
      )}
    </button>
  )
);

FilterPill.displayName = "FilterPill";

export const FilterToolbar = memo(function FilterToolbar({
  filters,
  onFilterChange,
  metrics,
  className,
}: FilterToolbarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortValue, setSortValue] = useState("recent");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Apply search filter with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ ...filters, search: searchValue });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, filters, onFilterChange]);

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
    setSearchValue("");
    setSelectedEmotions([]);
    setSelectedSentiments([]);
    setSelectedCategories([]);
    setSortValue("recent");
  }, [onFilterChange]);

  // Handle sort change
  const handleSortChange = useCallback(
    (value: string) => {
      setSortValue(value);
      // Here you would typically update the sort order in your API call
      // This is just a placeholder - implement actual sorting logic
      // Note: We're using any here to avoid updating CommentFilters type
      onFilterChange({
        ...filters,
        // sortBy is handled by the API but not included in the TypeScript type
      } as any);
    },
    [filters, onFilterChange]
  );

  // Toggle emoji-based filter
  const toggleEmojiFilter = useCallback(
    (value: string, category: FilterCategory) => {
      if (category === "emotion") {
        setSelectedEmotions((prev) =>
          prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
        );
      } else if (category === "sentiment") {
        setSelectedSentiments((prev) =>
          prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
        );
      } else if (category === "category") {
        setSelectedCategories((prev) =>
          prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
        );
      }

      // Currently just tracking in UI state, not sending to API
      // When API supports these filters, uncomment below
      /*
      onFilterChange({
        ...filters,
        emotions: selectedEmotions.length ? selectedEmotions : undefined,
        sentiments: selectedSentiments.length ? selectedSentiments : undefined,
        categories: selectedCategories.length ? selectedCategories : undefined,
      } as any);
      */
    },
    [filters, onFilterChange]
  );

  // Check if any filter is active
  const hasActiveFilters =
    Object.values(filters).some(
      (value) => value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== false)
    ) ||
    selectedEmotions.length > 0 ||
    selectedSentiments.length > 0 ||
    selectedCategories.length > 0;

  // Build active filters for context label
  const activeFilters = useMemo(() => {
    const result: string[] = [];

    if (filters.unread) result.push("Unread");
    if (filters.flagged) result.push("Flagged");
    if (filters.requiresAttention) result.push("Requires Attention");
    if (filters.archived) result.push("Archived");

    // Add emotion filters
    selectedEmotions.forEach((emotion) => {
      const emotionFilter = EMOTION_FILTERS.find((e) => e.value === emotion);
      if (emotionFilter) {
        result.push(`${emotionFilter.emoji} ${emotionFilter.label}`);
      }
    });

    // Add sentiment filters
    selectedSentiments.forEach((sentiment) => {
      const sentimentFilter = SENTIMENT_FILTERS.find((s) => s.value === sentiment);
      if (sentimentFilter) {
        result.push(`${sentimentFilter.emoji} ${sentimentFilter.label}`);
      }
    });

    // Add category filters
    selectedCategories.forEach((category) => {
      const categoryFilter = CATEGORY_FILTERS.find((c) => c.value === category);
      if (categoryFilter) {
        result.push(`${categoryFilter.emoji} ${categoryFilter.label}`);
      }
    });

    return result;
  }, [filters, selectedEmotions, selectedSentiments, selectedCategories]);

  return (
    <div
      className={cn(
        "sticky top-0 z-10 mb-6 space-y-3 border-b border-gray-200 bg-white pb-2 pt-4",
        "mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px]", // 12-column grid with proper margins
        className
      )}
    >
      {/* Search, Sort, and toggle filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search comments..."
            className="ring-offset-background focus-visible:ring-offset-2 h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <SortDropdown options={SORT_OPTIONS} value={sortValue} onChange={handleSortChange} />

          <button
            className={cn(
              "flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
              showFilters || hasActiveFilters
                ? "border-primary/50 bg-primary/5 text-primary"
                : "border-input bg-background hover:bg-muted"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Context label for active filters */}
      <ContextLabel
        platforms={filters.platform as CommentPlatform[]}
        filters={activeFilters}
        sortedBy={SORT_OPTIONS.find((o) => o.value === sortValue)?.label}
      />

      {/* Quick filter chips */}
      <FilterChipGroup>
        <FilterChip isSelected={!hasActiveFilters} onClick={clearFilters}>
          All
        </FilterChip>
        <FilterChip isSelected={!!filters.unread} onClick={() => toggleFilter("unread")}>
          Unread
          {metrics?.unread !== undefined && (
            <span className="ml-1 text-xs font-semibold text-gray-500">{metrics.unread}</span>
          )}
        </FilterChip>
        <FilterChip isSelected={!!filters.flagged} onClick={() => toggleFilter("flagged")}>
          Flagged
          {metrics?.flagged !== undefined && (
            <span className="ml-1 text-xs font-semibold text-gray-500">{metrics.flagged}</span>
          )}
        </FilterChip>
        <FilterChip
          isSelected={!!filters.requiresAttention}
          onClick={() => toggleFilter("requiresAttention")}
        >
          Requires Attention
        </FilterChip>
        <FilterChip isSelected={!!filters.archived} onClick={() => toggleFilter("archived")}>
          Archived
        </FilterChip>
      </FilterChipGroup>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="mt-4 rounded-md border bg-gray-50 p-4">
          {/* Platform filters */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Platform</h3>
            <PlatformPillGroup>
              {["youtube", "instagram", "twitter"].map((platform) => (
                <PlatformPill
                  key={platform}
                  platform={platform as CommentPlatform}
                  count={metrics?.platformBreakdown?.[platform as CommentPlatform] || 0}
                  isSelected={filters.platform?.includes(platform as CommentPlatform) || false}
                  onClick={() => togglePlatformFilter(platform as CommentPlatform)}
                />
              ))}
            </PlatformPillGroup>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Emotions filters */}
            <div className="mb-4">
              <EmojiFilterGroup label="Emotions">
                {EMOTION_FILTERS.map((emotion) => (
                  <EmojiFilterChip
                    key={emotion.value}
                    emoji={emotion.emoji}
                    label={emotion.label}
                    category="emotion"
                    count={Math.floor(Math.random() * 20)} /* Replace with real metrics later */
                    isSelected={selectedEmotions.includes(emotion.value)}
                    onClick={() => toggleEmojiFilter(emotion.value, "emotion")}
                  />
                ))}
              </EmojiFilterGroup>
            </div>

            {/* Sentiments filters */}
            <div className="mb-4">
              <EmojiFilterGroup label="Sentiments">
                {SENTIMENT_FILTERS.map((sentiment) => (
                  <EmojiFilterChip
                    key={sentiment.value}
                    emoji={sentiment.emoji}
                    label={sentiment.label}
                    category="sentiment"
                    count={Math.floor(Math.random() * 20)} /* Replace with real metrics later */
                    isSelected={selectedSentiments.includes(sentiment.value)}
                    onClick={() => toggleEmojiFilter(sentiment.value, "sentiment")}
                  />
                ))}
              </EmojiFilterGroup>
            </div>
          </div>

          {/* Categories filters */}
          <div className="mb-4">
            <EmojiFilterGroup label="Categories">
              {CATEGORY_FILTERS.map((category) => (
                <EmojiFilterChip
                  key={category.value}
                  emoji={category.emoji}
                  label={category.label}
                  category="category"
                  count={Math.floor(Math.random() * 20)} /* Replace with real metrics later */
                  isSelected={selectedCategories.includes(category.value)}
                  onClick={() => toggleEmojiFilter(category.value, "category")}
                />
              ))}
            </EmojiFilterGroup>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
