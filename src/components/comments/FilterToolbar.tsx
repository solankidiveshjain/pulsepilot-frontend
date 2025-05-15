import { CommentFilters, CommentPlatform } from "@/lib/types/comments";
import { cn } from "@/lib/utils";
import { Filter, Search } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

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
  }, [onFilterChange]);

  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && (Array.isArray(value) ? value.length > 0 : value !== false)
  );

  return (
    <div className={cn("mb-6 space-y-3", className)}>
      {/* Search and toggle filters */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search comments..."
            className="ring-offset-background focus-visible:ring-offset-2 h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

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
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Quick filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill label="All" active={!hasActiveFilters} onClick={clearFilters} />
        <FilterPill
          label="Unread"
          count={metrics?.unread}
          active={!!filters.unread}
          onClick={() => toggleFilter("unread")}
        />
        <FilterPill
          label="Flagged"
          count={metrics?.flagged}
          active={!!filters.flagged}
          onClick={() => toggleFilter("flagged")}
        />
        <FilterPill
          label="Requires Attention"
          active={!!filters.requiresAttention}
          onClick={() => toggleFilter("requiresAttention")}
        />
        <FilterPill
          label="Archived"
          active={!!filters.archived}
          onClick={() => toggleFilter("archived")}
        />
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <div className="mt-4 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Platform</h3>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-3">
            {["youtube", "instagram", "twitter"].map((platform) => (
              <PlatformOption
                key={platform}
                platform={platform as CommentPlatform}
                count={metrics?.platformBreakdown?.[platform as CommentPlatform] || 0}
                selected={filters.platform?.includes(platform as CommentPlatform) || false}
                onClick={() => togglePlatformFilter(platform as CommentPlatform)}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-end">
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
