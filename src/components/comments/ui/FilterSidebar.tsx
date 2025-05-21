"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useState } from "react";
import { CommentMetrics } from "../models";

interface FilterSidebarProps {
  filters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
  metrics: CommentMetrics;
  selectedEmotions: string[];
  selectedSentiments: string[];
  selectedCategories: string[];
  onEmotionChange: (emotions: string[]) => void;
  onSentimentChange: (sentiments: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  filters,
  onFilterChange,
  metrics,
  selectedEmotions,
  selectedSentiments,
  selectedCategories,
  onEmotionChange,
  onSentimentChange,
  onCategoryChange,
  isMobile = false,
  onCloseMobile,
}: FilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Available platforms for filtering
  const platforms = [
    { id: "youtube", name: "YouTube" },
    { id: "instagram", name: "Instagram" },
    { id: "twitter", name: "Twitter" },
    { id: "facebook", name: "Facebook" },
  ];

  // Available sentiments for filtering
  const sentiments = [
    { id: "positive", name: "Positive" },
    { id: "negative", name: "Negative" },
    { id: "neutral", name: "Neutral" },
  ];

  // Available emotions for filtering
  const emotions = [
    { id: "joy", name: "Joy" },
    { id: "sadness", name: "Sadness" },
    { id: "anger", name: "Anger" },
    { id: "fear", name: "Fear" },
    { id: "surprise", name: "Surprise" },
    { id: "disgust", name: "Disgust" },
  ];

  // Available categories for filtering
  const categories = [
    { id: "question", name: "Question" },
    { id: "feedback", name: "Feedback" },
    { id: "praise", name: "Praise" },
    { id: "complaint", name: "Complaint" },
    { id: "bug", name: "Bug Report" },
    { id: "feature", name: "Feature Request" },
  ];

  // Available time ranges for filtering
  const timeRanges = [
    { id: "today", name: "Today" },
    { id: "yesterday", name: "Yesterday" },
    { id: "week", name: "Last 7 days" },
    { id: "month", name: "Last 30 days" },
    { id: "all", name: "All time" },
  ];

  // Handler for platform selection
  const handlePlatformChange = (platformId: string) => {
    const currentPlatforms = filters.platform || [];
    const newPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter((p) => p !== platformId)
      : [...currentPlatforms, platformId];
    onFilterChange({ platform: newPlatforms });
  };

  // Handler for sentiment selection
  const handleSentimentChange = (sentimentId: string) => {
    const newSentiments = selectedSentiments.includes(sentimentId)
      ? selectedSentiments.filter((s) => s !== sentimentId)
      : [...selectedSentiments, sentimentId];
    onSentimentChange(newSentiments);
  };

  // Handler for emotion selection
  const handleEmotionChange = (emotionId: string) => {
    const newEmotions = selectedEmotions.includes(emotionId)
      ? selectedEmotions.filter((e) => e !== emotionId)
      : [...selectedEmotions, emotionId];
    onEmotionChange(newEmotions);
  };

  // Handler for category selection
  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryChange(newCategories);
  };

  // Handler for search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm });
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="mb-4 text-lg font-semibold">Filters</h2>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search comments..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Status filters */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium">Status</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="unread"
              checked={filters.read === false}
              onChange={() => onFilterChange({ read: filters.read === false ? undefined : false })}
            />
            <Label htmlFor="unread" className="flex items-center">
              <span>Unread</span>
              {metrics?.unread ? (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {metrics.unread}
                </Badge>
              ) : null}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="flagged"
              checked={filters.flagged === true}
              onChange={() =>
                onFilterChange({ flagged: filters.flagged === true ? undefined : true })
              }
            />
            <Label htmlFor="flagged" className="flex items-center">
              <span>Flagged</span>
              {metrics?.flagged ? (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {metrics.flagged}
                </Badge>
              ) : null}
            </Label>
          </div>
        </div>
      </div>

      {/* Platforms section */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary">
          <span>Platforms</span>
          <Badge variant="outline" className="ml-2 text-xs">
            {filters.platform?.length || 0}
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center space-x-2">
              <Checkbox
                id={`platform-${platform.id}`}
                checked={filters.platform?.includes(platform.id) || false}
                onChange={() => handlePlatformChange(platform.id)}
              />
              <Label htmlFor={`platform-${platform.id}`} className="flex items-center">
                <span>{platform.name}</span>
                {metrics?.platforms?.[platform.id] ? (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {metrics.platforms[platform.id]}
                  </Badge>
                ) : null}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Time range section */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary">
          <span>Time Range</span>
          {filters.timeRange && (
            <Badge variant="outline" className="ml-2 text-xs">
              Active
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {timeRanges.map((range) => (
            <div key={range.id} className="flex items-center space-x-2">
              <Checkbox
                id={`timerange-${range.id}`}
                checked={filters.timeRange === range.id}
                onChange={() =>
                  onFilterChange({
                    timeRange: filters.timeRange === range.id ? undefined : range.id,
                  })
                }
              />
              <Label htmlFor={`timerange-${range.id}`}>{range.name}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Sentiment section */}
      <Collapsible defaultOpen className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary">
          <span>Sentiment</span>
          {selectedSentiments.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {selectedSentiments.length}
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {sentiments.map((sentiment) => (
            <div key={sentiment.id} className="flex items-center space-x-2">
              <Checkbox
                id={`sentiment-${sentiment.id}`}
                checked={selectedSentiments.includes(sentiment.id)}
                onChange={() => handleSentimentChange(sentiment.id)}
              />
              <Label htmlFor={`sentiment-${sentiment.id}`} className="flex items-center">
                <span>{sentiment.name}</span>
                {metrics?.sentiments?.[sentiment.id] ? (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {metrics.sentiments[sentiment.id]}
                  </Badge>
                ) : null}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Emotions section */}
      <Collapsible className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary">
          <span>Emotions</span>
          {selectedEmotions.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {selectedEmotions.length}
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {emotions.map((emotion) => (
            <div key={emotion.id} className="flex items-center space-x-2">
              <Checkbox
                id={`emotion-${emotion.id}`}
                checked={selectedEmotions.includes(emotion.id)}
                onChange={() => handleEmotionChange(emotion.id)}
              />
              <Label htmlFor={`emotion-${emotion.id}`} className="flex items-center">
                <span>{emotion.name}</span>
                {metrics?.emotions?.[emotion.id] ? (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {metrics.emotions[emotion.id]}
                  </Badge>
                ) : null}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Categories section */}
      <Collapsible className="mb-6">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary">
          <span>Categories</span>
          {selectedCategories.length > 0 && (
            <Badge variant="outline" className="ml-2 text-xs">
              {selectedCategories.length}
            </Badge>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="flex items-center">
                <span>{category.name}</span>
                {metrics?.categories?.[category.id] ? (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {metrics.categories[category.id]}
                  </Badge>
                ) : null}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Mobile-specific actions */}
      {isMobile && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onCloseMobile}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
