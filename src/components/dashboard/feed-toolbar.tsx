"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, Check, X } from "lucide-react"

interface SortOption {
  id: string
  label: string
  icon: React.ReactNode
}

interface FeedToolbarProps {
  searchValue: string
  onSearchValueChange: (value: string) => void
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onClearSearch: () => void
  sortOption: string
  sortOptions: SortOption[]
  onSortChange: (sortId: string) => void
}

export function FeedToolbar({
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
  onClearSearch,
  sortOption,
  sortOptions,
  onSortChange,
}: FeedToolbarProps) {
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/30 p-2">
      <div className="flex items-center justify-between gap-2">
        <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            className="pl-8 pr-8 h-8 bg-background border-border/60 text-xs"
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            onKeyDown={(e) => {
              // Prevent Enter key from triggering reply if this component is used in such a context
              if (e.key === "Enter") {
                // e.stopPropagation(); // Already handled by onSearchSubmit preventing default form action
              }
            }}
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={onClearSearch}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <span>Sort: {sortOptions.find((opt) => opt.id === sortOption)?.label}</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.id}
                className="flex items-center gap-1 text-xs cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onSortChange(option.id)
                }}
                onSelect={(e) => { // Prevent default behavior that might close the dropdown prematurely or cause navigation
                  e.preventDefault()
                }}
              >
                {option.icon}
                {option.label}
                {sortOption === option.id && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
