import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';

const FilterMenu = ({ activeFilters, onFilterChange, onRemoveFilter }) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Style</DropdownMenuLabel>
          {Object.entries(styleConfigs || {}).map(([key, config]) => (
            <DropdownMenuItem
              key={`style-${key}`}
              onClick={() => onFilterChange('style', key)}
            >
              {config.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Model</DropdownMenuLabel>
          {Object.entries(modelConfigs || {}).map(([key, config]) => (
            <DropdownMenuItem
              key={`model-${key}`}
              onClick={() => onFilterChange('model', key)}
            >
              {config.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap gap-2">
        {Object.entries(activeFilters).map(([type, value]) => {
          const label = type === 'style' 
            ? styleConfigs?.[value]?.name 
            : modelConfigs?.[value]?.name;
          
          if (!label) return null;
          
          return (
            <Badge
              key={`${type}-${value}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onRemoveFilter(type)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default FilterMenu;