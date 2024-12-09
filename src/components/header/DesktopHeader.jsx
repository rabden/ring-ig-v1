import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import InspirationFilters from '../gallery/InspirationFilters';

const DesktopHeader = ({
  user,
  credits,
  bonusCredits,
  activeView,
  setActiveView,
  generatingImages,
  activeFilters,
  onFilterChange,
  onRemoveFilter,
  onSearch,
  nsfwEnabled,
  showPrivate,
  onTogglePrivate,
  inspirationFilter,
  onInspirationFilterChange
}) => {
  const isInspiration = activeView === 'inspiration';

  return (
    <div className="hidden md:flex items-center gap-4 mb-6">
      <div className="relative flex-1">
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
        />
      )}
    </div>
  );
};

export default DesktopHeader;