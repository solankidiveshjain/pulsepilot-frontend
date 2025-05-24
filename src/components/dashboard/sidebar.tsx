// @ts-nocheck
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  categoryFilters,
  emotionFilters,
  platformFilters,
  sentimentFilters,
  statusFilters,
} from "@/lib/mock-data";
import { fetchFilterCounts, type FilterCounts } from "@/services/comments";
import type { FilterState } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { memo } from "react";

interface DashboardSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

function DashboardSidebarComponent({ filters, onFilterChange }: DashboardSidebarProps) {
  const {
    data: counts,
    isLoading,
    error,
  } = useQuery<FilterCounts>({
    queryKey: ["filterCounts"],
    queryFn: fetchFilterCounts,
  });

  if (error) {
    console.error("Failed to fetch filter counts:", error);
    // Optionally, render an error message or fallback UI
  }

  const handleStatusChange = (status: string) => {
    onFilterChange({ status: status as any });
  };

  const handleFilterToggle = (filterType: string, filterId: string) => {
    const current = filters[filterType as keyof FilterState] || [];
    const newFilters = Array.isArray(current)
      ? current.includes(filterId)
        ? (current as string[]).filter((id) => id !== filterId)
        : [...(current as string[]), filterId]
      : [filterId];
    onFilterChange({ [filterType]: newFilters } as Partial<FilterState>);
  };

  return (
    <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent h-full overflow-auto px-1 py-2">
      <div className="space-y-3">
        <div className="mb-1 flex items-center gap-1 px-2">
          <svg
            className="text-primary h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h3 className="text-xs font-semibold">Filters</h3>
        </div>

        <div className="space-y-1 px-2">
          <h4 className="text-muted-foreground mb-1 text-[10px] font-medium">Status</h4>
          <div className="flex flex-wrap gap-1">
            {statusFilters.map((status) => (
              <TooltipProvider key={status.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filters.status === status.id ? "default" : "outline"}
                      size="sm"
                      className="relative h-6 px-1.5 text-[10px]"
                      onClick={() => handleStatusChange(status.id)}
                    >
                      <span className="mr-1">{status.icon}</span>
                      <span className="mr-1 text-[10px]">{status.label}</span>
                      {isLoading ? (
                        <Skeleton className="ml-1 h-3.5 w-6" />
                      ) : counts?.status[status.id] !== undefined &&
                        counts.status[status.id] > 0 &&
                        status.id !== "all" ? (
                        <Badge variant="secondary" className="ml-1 h-3.5 px-1 text-[8px]">
                          {counts.status[status.id]}
                        </Badge>
                      ) : null}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {isLoading
                      ? "Loading..."
                      : `${counts?.status[status.id] ?? 0} ${status.label.toLowerCase()} ${counts?.status[status.id] === 1 ? "comment" : "comments"}`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["platforms"]} className="space-y-1">
          <AccordionItem value="platforms" className="border-b-0">
            <AccordionTrigger className="hover:bg-muted/50 rounded-md px-2 py-1 hover:no-underline">
              <div className="flex w-full items-center">
                <span className="text-[10px] font-medium">Platforms</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <div className="space-y-0.5">
                {platformFilters.map((platform) => (
                  <div key={platform.id} className="flex items-center">
                    <Button
                      variant={filters.platforms?.includes(platform.id) ? "subtle" : "ghost"}
                      className="h-6 w-full justify-start px-2 text-[10px] font-normal"
                      onClick={() => handleFilterToggle("platforms", platform.id)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="platform-icon relative h-3 w-3">
                            <Image
                              src={platform.icon || "/placeholder.svg"}
                              alt={platform.label}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span
                            className={
                              filters.platforms?.includes(platform.id)
                                ? `text-${platform.color}`
                                : ""
                            }
                          >
                            {platform.label}
                          </span>
                        </div>
                        {isLoading ? (
                          <Skeleton className="h-3.5 w-6" />
                        ) : counts?.platforms[platform.id] !== undefined &&
                          counts.platforms[platform.id] > 0 ? (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {counts.platforms[platform.id]}
                          </Badge>
                        ) : null}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="emotions" className="border-b-0">
            <AccordionTrigger className="hover:bg-muted/50 rounded-md px-2 py-1 hover:no-underline">
              <div className="flex w-full items-center justify-start">
                <span className="text-[10px] font-medium">Emotions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent forceMount className="pt-1 pb-0">
              <div className="space-y-0.5">
                {emotionFilters.map((emotion) => (
                  <div key={emotion.id} className="flex items-center">
                    <Button
                      variant={filters.emotions?.includes(emotion.id) ? "subtle" : "ghost"}
                      className="h-6 w-full justify-start px-2 text-[10px] font-normal"
                      onClick={() => handleFilterToggle("emotions", emotion.id)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{emotion.icon}</span>
                          <span>{emotion.label}</span>
                        </div>
                        {isLoading ? (
                          <Skeleton className="h-3.5 w-6" />
                        ) : counts?.emotions[emotion.id] !== undefined &&
                          counts.emotions[emotion.id] > 0 ? (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {counts.emotions[emotion.id]}
                          </Badge>
                        ) : null}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sentiments" className="border-b-0">
            <AccordionTrigger className="hover:bg-muted/50 rounded-md px-2 py-1 hover:no-underline">
              <div className="flex w-full items-center justify-start">
                <span className="text-[10px] font-medium">Sentiments</span>
              </div>
            </AccordionTrigger>
            <AccordionContent forceMount className="pt-1 pb-0">
              <div className="space-y-0.5">
                {sentimentFilters.map((sentiment) => (
                  <div key={sentiment.id} className="flex items-center">
                    <Button
                      variant={filters.sentiments?.includes(sentiment.id) ? "subtle" : "ghost"}
                      className="h-6 w-full justify-start px-2 text-[10px] font-normal"
                      onClick={() => handleFilterToggle("sentiments", sentiment.id)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{sentiment.icon}</span>
                          <span>{sentiment.label}</span>
                        </div>
                        {isLoading ? (
                          <Skeleton className="h-3.5 w-6" />
                        ) : counts?.sentiments[sentiment.id] !== undefined &&
                          counts.sentiments[sentiment.id] > 0 ? (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {counts.sentiments[sentiment.id]}
                          </Badge>
                        ) : null}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="hover:bg-muted/50 rounded-md px-2 py-1 hover:no-underline">
              <div className="flex w-full items-center justify-start">
                <span className="text-[10px] font-medium">Categories</span>
              </div>
            </AccordionTrigger>
            <AccordionContent forceMount className="pt-1 pb-0">
              <div className="space-y-0.5">
                {categoryFilters.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Button
                      variant={filters.categories?.includes(category.id) ? "subtle" : "ghost"}
                      className="h-6 w-full justify-start px-2 text-[10px] font-normal"
                      onClick={() => handleFilterToggle("categories", category.id)}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                        {isLoading ? (
                          <Skeleton className="h-3.5 w-6" />
                        ) : counts?.categories[category.id] !== undefined &&
                          counts.categories[category.id] > 0 ? (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {counts.categories[category.id]}
                          </Badge>
                        ) : null}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const DashboardSidebar = memo(DashboardSidebarComponent);
