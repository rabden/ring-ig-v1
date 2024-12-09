import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import InspirationFilters from '../gallery/InspirationFilters';

const MobileHeader = ({
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  isVisible,
  nsfwEnabled,
  showPrivate,
  onTogglePrivate,
  activeView,
  inspirationFilter,
  onInspirationFilterChange
}) => {
  const isInspiration = activeView === 'inspiration';

  return (
    <div 
      className={cn(
        "md:hidden fixed top-0 left-0 right-0 bg-background z-10 transition-transform duration-200",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search images..."
            className="pl-10 w-full"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        {isInspiration && (
          <InspirationFilters
            activeFilter={inspirationFilter}
            onFilterChange={onInspirationFilterChange}
            className="px-0"
          />
        )}
      </div>
      {/* Fade-out gradient */}
      <div className="h-4 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default MobileHeader;