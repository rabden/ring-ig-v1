import React from 'react';
import { cn } from '@/lib/utils';

const InspirationFilters = ({ activeFilter, onFilterChange, className }) => {
  return (
    <div className={cn("flex gap-2 p-2", className)}>
      <button
        onClick={() => onFilterChange('top')}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          activeFilter === 'top'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
        )}
      >
        Top
      </button>
      <button
        onClick={() => onFilterChange('following')}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          activeFilter === 'following'
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
        )}
      >
        Following
      </button>
    </div>
  );
};

export default InspirationFilters; 