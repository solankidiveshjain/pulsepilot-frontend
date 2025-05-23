"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { categoryFilters, emotionFilters, platformFilters, sentimentFilters, statusFilters } from "@/lib/mock-data"
import type { FilterState } from '@/types'
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { memo } from "react"

interface DashboardSidebarProps {
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
}

function DashboardSidebarComponent({ filters, onFilterChange }: DashboardSidebarProps) {
  const handleStatusChange = (status: string) => {
    onFilterChange({ status: status as any })
  }

  const handleFilterToggle = (filterType: string, filterId: string) => {
    const current = filters[filterType as keyof FilterState] || []
    const newFilters = Array.isArray(current)
      ? current.includes(filterId)
        ? (current as string[]).filter((id) => id !== filterId)
        : [...(current as string[]), filterId]
      : [filterId]
    onFilterChange({ [filterType]: newFilters } as Partial<FilterState>)
  }

  return (
    <div className="h-full overflow-auto py-2 px-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      <div className="space-y-3">
        <div className="flex items-center gap-1 px-2 mb-1">
          <svg
            className="h-3.5 w-3.5 text-primary"
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
          <h4 className="text-[10px] font-medium text-muted-foreground mb-1">Status</h4>
          <div className="flex flex-wrap gap-1">
            {statusFilters.map((status) => (
              <TooltipProvider key={status.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filters.status === status.id ? "default" : "outline"}
                      size="sm"
                      className="h-6 text-[10px] px-1.5 relative"
                      onClick={() => handleStatusChange(status.id)}
                    >
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                      {status.count > 0 && status.id !== "all" && (
                        <Badge variant="secondary" className="ml-1 h-3.5 px-1 text-[8px]">
                          {status.count}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {status.count} {status.label.toLowerCase()} {status.count === 1 ? "comment" : "comments"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["platforms"]} className="space-y-1">
          <AccordionItem value="platforms" className="border-b-0">
            <AccordionTrigger className="py-1 hover:no-underline hover:bg-muted/50 px-2 rounded-md">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium">Platforms</span>
                </div>
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <div className="space-y-0.5">
                {platformFilters.map((platform) => (
                  <div key={platform.id} className="flex items-center">
                    <Button
                      variant={filters.platforms?.includes(platform.id) ? "subtle" : "ghost"}
                      className="justify-start px-2 w-full h-6 font-normal text-[10px]"
                      onClick={() => handleFilterToggle("platforms", platform.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="relative h-3 w-3 platform-icon">
                            <Image
                              src={platform.icon || "/placeholder.svg"}
                              alt={platform.label}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className={filters.platforms?.includes(platform.id) ? `text-${platform.color}` : ""}>
                            {platform.label}
                          </span>
                        </div>
                        {platform.count > 0 && (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {platform.count}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="emotions" className="border-b-0">
            <AccordionTrigger className="py-1 hover:no-underline hover:bg-muted/50 px-2 rounded-md">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium">Emotions</span>
                </div>
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <div className="space-y-0.5">
                {emotionFilters.map((emotion) => (
                  <div key={emotion.id} className="flex items-center">
                    <Button
                      variant={filters.emotions?.includes(emotion.id) ? "subtle" : "ghost"}
                      className="justify-start px-2 w-full h-6 font-normal text-[10px]"
                      onClick={() => handleFilterToggle("emotions", emotion.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span>{emotion.icon}</span>
                          <span>{emotion.label}</span>
                        </div>
                        {emotion.count > 0 && (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {emotion.count}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sentiments" className="border-b-0">
            <AccordionTrigger className="py-1 hover:no-underline hover:bg-muted/50 px-2 rounded-md">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium">Sentiments</span>
                </div>
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <div className="space-y-0.5">
                {sentimentFilters.map((sentiment) => (
                  <div key={sentiment.id} className="flex items-center">
                    <Button
                      variant={filters.sentiments?.includes(sentiment.id) ? "subtle" : "ghost"}
                      className="justify-start px-2 w-full h-6 font-normal text-[10px]"
                      onClick={() => handleFilterToggle("sentiments", sentiment.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span>{sentiment.icon}</span>
                          <span>{sentiment.label}</span>
                        </div>
                        {sentiment.count > 0 && (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {sentiment.count}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories" className="border-b-0">
            <AccordionTrigger className="py-1 hover:no-underline hover:bg-muted/50 px-2 rounded-md">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium">Categories</span>
                </div>
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-0">
              <div className="space-y-0.5">
                {categoryFilters.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Button
                      variant={filters.categories?.includes(category.id) ? "subtle" : "ghost"}
                      className="justify-start px-2 w-full h-6 font-normal text-[10px]"
                      onClick={() => handleFilterToggle("categories", category.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                        {category.count > 0 && (
                          <Badge variant="outline" className="h-3.5 px-1 text-[8px]">
                            {category.count}
                          </Badge>
                        )}
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
  )
}

// Memoize the component to prevent unnecessary re-renders
export const DashboardSidebar = memo(DashboardSidebarComponent)
