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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useModelConfigs } from '@/hooks/useModelConfigs';

const FilterMenu = ({ activeFilters, onFilterChange, onRemoveFilter }) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 px-3"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          <ScrollArea className="h-[400px] rounded-md">
            <div className="p-4">
              <DropdownMenuLabel className="text-sm font-semibold mb-3">Styles</DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {Object.entries(styleConfigs || {}).map(([key, config]) => (
                  <Button
                    key={`style-${key}`}
                    variant="outline"
                    className="h-auto py-2 px-3 text-xs justify-start font-normal"
                    onClick={() => onFilterChange('style', key)}
                  >
                    {config.name}
                  </Button>
                ))}
              </div>
              
              <DropdownMenuSeparator className="my-4" />
              
              <DropdownMenuLabel className="text-sm font-semibold mb-3">Models</DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(modelConfigs || {}).map(([key, config]) => (
                  <Button
                    key={`model-${key}`}
                    variant="outline"
                    className="h-auto py-2 px-3 text-xs justify-start font-normal"
                    onClick={() => onFilterChange('model', key)}
                  >
                    {config.name}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
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
              className="flex items-center gap-1 px-3 py-1 h-8"
            >
              {label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent ml-1"
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