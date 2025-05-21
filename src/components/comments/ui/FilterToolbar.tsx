"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Filter, MessageSquare, RefreshCw, SortAsc } from "lucide-react";
import { CommentFilter, CommentMetrics } from "../models";

interface FilterToolbarProps {
  filters: CommentFilter;
  onFilterChange: (filters: Partial<CommentFilter>) => void;
  metrics?: CommentMetrics;
}

export function FilterToolbar({ filters, onFilterChange, metrics }: FilterToolbarProps) {
  // Available platforms for filtering
  const platforms = [
    { id: "youtube", name: "YouTube" },
    { id: "instagram", name: "Instagram" },
    { id: "twitter", name: "Twitter" },
    { id: "facebook", name: "Facebook" },
  ];

  // Available time ranges for filtering
  const timeRanges = [
    { id: "today", name: "Today" },
    { id: "yesterday", name: "Yesterday" },
    { id: "week", name: "Last 7 days" },
    { id: "month", name: "Last 30 days" },
    { id: "all", name: "All time" },
  ];

  return (
    <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-2">
      {/* Platform filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">Platform</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Platforms</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {platforms.map((platform) => (
              <DropdownMenuItem
                key={platform.id}
                onClick={() => {
                  const currentPlatforms = filters.platform || [];
                  const newPlatforms = currentPlatforms.includes(platform.id)
                    ? currentPlatforms.filter((p) => p !== platform.id)
                    : [...currentPlatforms, platform.id];
                  onFilterChange({ platform: newPlatforms });
                }}
              >
                <span className="flex flex-1 items-center">
                  {platform.name}
                  {metrics?.platforms?.[platform.id] && (
                    <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs">
                      {metrics.platforms[platform.id]}
                    </span>
                  )}
                </span>
                {filters.platform?.includes(platform.id) && (
                  <span className="ml-2 h-4 w-4 text-primary">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Time range filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">
              {filters.timeRange
                ? timeRanges.find((t) => t.id === filters.timeRange)?.name || filters.timeRange
                : "Time Range"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Time Range</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {timeRanges.map((range) => (
            <DropdownMenuItem
              key={range.id}
              onClick={() => onFilterChange({ timeRange: range.id })}
              className="flex items-center justify-between"
            >
              {range.name}
              {filters.timeRange === range.id && (
                <span className="ml-2 h-4 w-4 text-primary">✓</span>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange({ timeRange: undefined })}>
            Clear time filter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status filters */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span className="text-xs">Status</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Comment Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onFilterChange({ read: filters.read ? undefined : false })}
          >
            <span className="flex flex-1">
              Unread
              {metrics?.unread ? (
                <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {metrics.unread}
                </span>
              ) : null}
            </span>
            {filters.read === false && <span className="ml-2 h-4 w-4 text-primary">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFilterChange({ flagged: filters.flagged ? undefined : true })}
          >
            <span className="flex flex-1">
              Flagged
              {metrics?.flagged ? (
                <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {metrics.flagged}
                </span>
              ) : null}
            </span>
            {filters.flagged === true && <span className="ml-2 h-4 w-4 text-primary">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort option */}
      <Button variant="outline" size="sm" className="h-8 gap-1">
        <SortAsc className="h-3.5 w-3.5" />
        <span className="text-xs">Newest</span>
      </Button>

      {/* Refresh button */}
      <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
        <RefreshCw className="h-3.5 w-3.5" />
        <span className="sr-only">Refresh</span>
      </Button>
    </div>
  );
}
