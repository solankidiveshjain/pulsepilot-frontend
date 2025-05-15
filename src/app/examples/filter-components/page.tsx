"use client";

import { ContextLabel } from "@/components/ui/ContextLabel";
import { EmojiFilterChip, EmojiFilterGroup } from "@/components/ui/EmojiFilterChip";
import { FilterChip, FilterChipGroup } from "@/components/ui/FilterChip";
import { PlatformPill, PlatformPillGroup } from "@/components/ui/PlatformPill";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { CommentPlatform } from "@/lib/types/comments";
import { useState } from "react";

const SORT_OPTIONS = [
  { label: "Recent", value: "recent" },
  { label: "Most Replies", value: "most-replies" },
  { label: "Oldest", value: "oldest" },
  { label: "AI Priority", value: "ai-priority" },
];

const EMOTION_FILTERS = [
  { emoji: "😡", label: "Angry", value: "angry" },
  { emoji: "❤️", label: "Positive", value: "positive" },
  { emoji: "💡", label: "Suggestion", value: "suggestion" },
  { emoji: "🛠", label: "Bug", value: "bug" },
  { emoji: "💸", label: "Pricing", value: "pricing" },
];

export default function FilterComponentsExample() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>("all");
  const [selectedPlatforms, setSelectedPlatforms] = useState<CommentPlatform[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState("recent");

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
  };

  const handlePlatformClick = (platform: CommentPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleEmotionClick = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  // Build active filters for context label
  const activeFilters = [];
  if (selectedFilter && selectedFilter !== "all") {
    activeFilters.push(selectedFilter);
  }

  selectedEmotions.forEach((emotion) => {
    const emotionFilter = EMOTION_FILTERS.find((e) => e.value === emotion);
    if (emotionFilter) {
      activeFilters.push(`${emotionFilter.emoji} ${emotionFilter.label}`);
    }
  });

  return (
    <div className="container mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-[80px]">
      <h1 className="mb-8 text-3xl font-bold">Filter Components</h1>

      {/* Header with Sort and Context */}
      <div className="mb-6 flex items-center justify-between">
        <ContextLabel
          platforms={selectedPlatforms}
          filters={activeFilters}
          sortedBy={SORT_OPTIONS.find((o) => o.value === sortValue)?.label}
        />

        <SortDropdown options={SORT_OPTIONS} value={sortValue} onChange={setSortValue} />
      </div>

      {/* Filter Chips */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Filter Chips</h2>
        <p className="mb-4 text-gray-600">
          Filter chips allow users to select from predefined filter categories.
        </p>

        <FilterChipGroup>
          <FilterChip
            isSelected={selectedFilter === "all"}
            onClick={() => handleFilterClick("all")}
          >
            All
          </FilterChip>
          <FilterChip
            isSelected={selectedFilter === "unread"}
            onClick={() => handleFilterClick("unread")}
          >
            Unread
            <span className="ml-1 text-xs font-semibold text-gray-500">24</span>
          </FilterChip>
          <FilterChip
            isSelected={selectedFilter === "flagged"}
            onClick={() => handleFilterClick("flagged")}
          >
            Flagged
            <span className="ml-1 text-xs font-semibold text-gray-500">8</span>
          </FilterChip>
          <FilterChip
            isSelected={selectedFilter === "requires-attention"}
            onClick={() => handleFilterClick("requires-attention")}
          >
            Requires Attention
          </FilterChip>
          <FilterChip
            isSelected={selectedFilter === "archived"}
            onClick={() => handleFilterClick("archived")}
          >
            Archived
          </FilterChip>
        </FilterChipGroup>
      </section>

      {/* Platform Pills */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Platform Pills</h2>
        <p className="mb-4 text-gray-600">
          Platform pills allow users to filter content by social media platform.
        </p>

        <PlatformPillGroup>
          <PlatformPill
            platform="youtube"
            count={29}
            isSelected={selectedPlatforms.includes("youtube")}
            onClick={() => handlePlatformClick("youtube")}
          />
          <PlatformPill
            platform="instagram"
            count={16}
            isSelected={selectedPlatforms.includes("instagram")}
            onClick={() => handlePlatformClick("instagram")}
          />
          <PlatformPill
            platform="twitter"
            count={42}
            isSelected={selectedPlatforms.includes("twitter")}
            onClick={() => handlePlatformClick("twitter")}
          />
        </PlatformPillGroup>
      </section>

      {/* Emoji Filters */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Emotion & Category Filters</h2>
        <p className="mb-4 text-gray-600">
          Emoji-based filters for quick categorization of content.
        </p>

        <EmojiFilterGroup label="Emotions">
          {EMOTION_FILTERS.map((emotion) => (
            <EmojiFilterChip
              key={emotion.value}
              emoji={emotion.emoji}
              label={emotion.label}
              count={Math.floor(Math.random() * 20)}
              isSelected={selectedEmotions.includes(emotion.value)}
              onClick={() => handleEmotionClick(emotion.value)}
            />
          ))}
        </EmojiFilterGroup>
      </section>

      {/* Mobile Behavior Example */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Mobile Behavior</h2>
        <p className="mb-4 text-gray-600">
          Resize your browser window to see how these components adapt to mobile viewports. On small
          screens, filter chips become horizontally scrollable.
        </p>

        <div className="max-w-sm rounded-md border border-gray-200 p-4">
          <div className="mb-2 text-sm text-gray-500">Mobile preview (constrained width)</div>
          <FilterChipGroup>
            <FilterChip isSelected={true}>All</FilterChip>
            <FilterChip isSelected={false}>Unread</FilterChip>
            <FilterChip isSelected={false}>Flagged</FilterChip>
            <FilterChip isSelected={false}>Requires Attention</FilterChip>
            <FilterChip isSelected={false}>Archived</FilterChip>
          </FilterChipGroup>
        </div>
      </section>
    </div>
  );
}
