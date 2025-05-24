"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import type { ActiveFilter, FilterState } from "@/types"

interface ActiveFiltersBarProps {
  activeFilters: ActiveFilter[]
  onClearFilter: (filterType: keyof FilterState, filterId: string) => void
  onClearAllFilters: () => void
}

export function ActiveFiltersBar({
  activeFilters,
  onClearFilter,
  onClearAllFilters,
}: ActiveFiltersBarProps) {
  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 animate-fade-in border-b border-border/30">
      <div className="flex items-center gap-1 mr-1">
        <Filter className="h-3 w-3 text-primary" />
        <span className="text-[10px] font-medium">Filters:</span>
      </div>

      {activeFilters.map((filter) => (
        <div key={`${filter.type}-${filter.id}`} className="filter-pill">
          {filter.icon &&
            (typeof filter.icon === "string" && filter.icon.startsWith("/") ? ( // Assuming URL icons start with /
              <div className="relative h-3 w-3">
                <Image src={filter.icon} alt={filter.label} fill className="object-contain" />
              </div>
            ) : typeof filter.icon === 'string' ? ( // Emoji or other string icon
              <span>{filter.icon}</span>
            ) : ( // ReactNode icon
              React.isValidElement(filter.icon) ? filter.icon : null
            ))}
          <span>{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-3 w-3 p-0 ml-1 hover:bg-primary/20"
            onClick={() => onClearFilter(filter.type as keyof FilterState, filter.id as string)}
          >
            <X className="h-2 w-2" />
            <span className="sr-only">Remove {filter.label} filter</span>
          </Button>
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        className="text-[10px] h-5 px-1.5 hover:bg-primary/10"
        onClick={onClearAllFilters}
      >
        Clear all
      </Button>
    </div>
  )
}
