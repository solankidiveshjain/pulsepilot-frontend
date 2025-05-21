"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommentFilters as CommentFiltersType } from "@/lib/types/comments";

export interface CommentFiltersProps {
  filters: CommentFiltersType;
  onFilterChange: (filters: Partial<CommentFiltersType>) => void;
  onReset: () => void;
}

export function CommentFilters({ filters, onFilterChange, onReset }: CommentFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handlePlatformChange = (value: string) => {
    onFilterChange({ platform: value as CommentFiltersType["platform"] });
  };

  const handleSentimentChange = (value: string) => {
    onFilterChange({ sentiment: value as CommentFiltersType["sentiment"] });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value as CommentFiltersType["status"] });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Input
        placeholder="Search comments..."
        value={filters.search}
        onChange={handleSearchChange}
        className="max-w-xs"
      />
      <Select value={filters.platform} onValueChange={handlePlatformChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="playstore">Play Store</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.sentiment} onValueChange={handleSentimentChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sentiment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sentiments</SelectItem>
          <SelectItem value="positive">Positive</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
          <SelectItem value="negative">Negative</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}
