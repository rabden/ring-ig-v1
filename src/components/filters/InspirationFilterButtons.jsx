import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export default function InspirationFilterButtons({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "liked", label: "Liked" },
    { id: "remixed", label: "Remixed" },
  ]

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}>
          {filter.label}
        </Button>
      ))}
    </div>
  )
} 