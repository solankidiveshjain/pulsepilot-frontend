"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Filter, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

// Updated with real-time counts
const statusFilters = [
  { id: "all", label: "All", icon: "🔍", count: 13 },
  { id: "flagged", label: "Flagged", icon: "🚩", count: 3 },
  { id: "attention", label: "Attention", icon: "⚠️", count: 2 },
  { id: "archived", label: "Archived", icon: "📦", count: 5 },
]

const platformFilters = [
  { id: "youtube", label: "YouTube", color: "youtube", icon: "/youtube.png", count: 5 },
  { id: "instagram", label: "Instagram", color: "instagram", icon: "/instagram.png", count: 3 },
  { id: "twitter", label: "X", color: "twitter", icon: "/twitter.png", count: 2 },
  { id: "tiktok", label: "TikTok", color: "tiktok", icon: "/tiktok.png", count: 1 },
  { id: "facebook", label: "Facebook", color: "facebook", icon: "/facebook.png", count: 2 },
  { id: "linkedin", label: "LinkedIn", color: "linkedin", icon: "/linkedin.png", count: 0 },
]

const emotionFilters = [
  { id: "excited", label: "Excited", icon: "🤩", color: "yellow-500", count: 3 },
  { id: "angry", label: "Angry", icon: "😡", color: "destructive", count: 2 },
  { id: "curious", label: "Curious", icon: "🤔", color: "blue-500", count: 4 },
  { id: "happy", label: "Happy", icon: "😊", color: "green-500", count: 3 },
  { id: "sad", label: "Sad", icon: "😢", color: "blue-500", count: 1 },
]

const sentimentFilters = [
  { id: "positive", label: "Positive", icon: "👍", color: "green-500", count: 6 },
  { id: "negative", label: "Negative", icon: "👎", color: "destructive", count: 3 },
  { id: "neutral", label: "Neutral", icon: "🤷", color: "gray-500", count: 4 },
]

const categoryFilters = [
  { id: "product", label: "Product Feedback", icon: "💬", color: "blue-500", count: 5 },
  { id: "vip", label: "VIP", icon: "⭐", color: "yellow-500", count: 2 },
  { id: "spam", label: "Spam", icon: "🚫", color: "red-500", count: 1 },
  { id: "general", label: "General", icon: "📦", color: "gray-500", count: 5 },
]

export function DashboardSidebar({ filters, onFilterChange }) {
  const isMobile = useIsMobile()

  const handleStatusChange = (status) => {
    onFilterChange({ status })

    // On mobile, we might want to close the sidebar after selecting a filter
    // if (isMobile && onClose) {
    //   onClose()
    // }
  }

  const handleFilterToggle = (filterType, filterId) => {
    const currentFilters = filters[filterType] || []
    const newFilters = currentFilters.includes(filterId)
      ? currentFilters.filter((id) => id !== filterId)
      : [...currentFilters, filterId]

    onFilterChange({ [filterType]: newFilters })

    // On mobile, we might want to close the sidebar after selecting a filter
    // if (isMobile && onClose) {
    //   onClose()
    // }
  }

  return (
    <div className="h-full overflow-auto py-2 px-1 sidebar-scroll">
      <div className="space-y-3">
        <div className="flex items-center gap-1 px-2 mb-1">
          <Filter className="h-3.5 w-3.5 text-primary" />
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
                <ChevronRight className="h-3 w-3 transition-transform duration-200" />
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
                <ChevronRight className="h-3 w-3 transition-transform duration-200" />
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
                <ChevronRight className="h-3 w-3 transition-transform duration-200" />
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
                <ChevronRight className="h-3 w-3 transition-transform duration-200" />
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
