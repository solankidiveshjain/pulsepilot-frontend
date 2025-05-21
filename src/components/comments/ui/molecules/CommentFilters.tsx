import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import React from "react";

export type SortOption = "newest" | "oldest" | "most-liked" | "most-replied";
export type FilterOption =
  | "all"
  | "positive"
  | "negative"
  | "neutral"
  | "new"
  | "in-progress"
  | "resolved"
  | "archived";

interface CommentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedFilters: FilterOption[];
  onFilterChange: (filters: FilterOption[]) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-liked", label: "Most Liked" },
  { value: "most-replied", label: "Most Replied" },
];

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All Comments" },
  { value: "positive", label: "Positive" },
  { value: "negative", label: "Negative" },
  { value: "neutral", label: "Neutral" },
  { value: "new", label: "New" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "archived", label: "Archived" },
];

export const CommentFilters = React.memo(function CommentFilters({
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  selectedFilters,
  onFilterChange,
  className,
}: CommentFiltersProps) {
  const handleFilterToggle = (filter: FilterOption) => {
    if (filter === "all") {
      onFilterChange(["all"]);
      return;
    }

    const newFilters = selectedFilters.filter((f) => f !== "all");
    if (selectedFilters.includes(filter)) {
      onFilterChange(newFilters.filter((f) => f !== filter));
    } else {
      onFilterChange([...newFilters, filter]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn("cursor-pointer", selectedSort === option.value && "bg-accent")}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFilterToggle(option.value)}
                className={cn(
                  "cursor-pointer",
                  selectedFilters.includes(option.value) && "bg-accent"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {selectedFilters.length > 0 && selectedFilters[0] !== "all" && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleFilterToggle(filter)}
            >
              {filterOptions.find((f) => f.value === filter)?.label}
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
});
