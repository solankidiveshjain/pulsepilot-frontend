import { cn } from '@/lib/utils';
import { ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className="relative">
      <button
        className="flex items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{selectedOption?.label || 'All'}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-popover shadow-md">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  'flex w-full items-center px-3 py-2 text-sm',
                  option.value === value 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-popover-foreground hover:bg-muted'
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterBarProps {
  onSearch: (query: string) => void;
  searchValue: string;
  platforms: {
    youtube: boolean;
    instagram: boolean;
    twitter: boolean;
  };
  onPlatformToggle: (platform: 'youtube' | 'instagram' | 'twitter') => void;
  filterOptions: {
    posts: FilterOption[];
    emotions: FilterOption[];
    categories: FilterOption[];
  };
  filters: {
    post: string;
    emotion: string;
    category: string;
  };
  onFilterChange: (filterType: 'post' | 'emotion' | 'category', value: string) => void;
  className?: string;
}

export function FilterBar({
  onSearch,
  searchValue,
  platforms,
  onPlatformToggle,
  filterOptions,
  filters,
  onFilterChange,
  className,
}: FilterBarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search comments..."
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        {/* Filter dropdowns */}
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="Post"
            options={filterOptions.posts}
            value={filters.post}
            onChange={(value) => onFilterChange('post', value)}
          />
          <FilterDropdown
            label="Emotion"
            options={filterOptions.emotions}
            value={filters.emotion}
            onChange={(value) => onFilterChange('emotion', value)}
          />
          <FilterDropdown
            label="Category"
            options={filterOptions.categories}
            value={filters.category}
            onChange={(value) => onFilterChange('category', value)}
          />
        </div>
      </div>
      
      {/* Platform pills */}
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            platforms.youtube 
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          onClick={() => onPlatformToggle('youtube')}
        >
          YouTube
        </button>
        <button
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            platforms.instagram 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          onClick={() => onPlatformToggle('instagram')}
        >
          Instagram
        </button>
        <button
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            platforms.twitter 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
          onClick={() => onPlatformToggle('twitter')}
        >
          X (Twitter)
        </button>
      </div>
    </div>
  );
} 