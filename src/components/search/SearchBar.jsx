import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(!!initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Sync with external changes
  useEffect(() => {
    if (initialQuery !== query) {
      setQuery(initialQuery);
      setIsSearchOpen(!!initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (value) => {
    setQuery(value);
    onSearch(value);
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      handleSearch('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleSearch('');
      setIsSearchOpen(false);
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-1.5 transition-all duration-300 ease-spring",
      isSearchOpen ? "w-full" : "w-8 md:w-9"
    )}>
      {isSearchOpen ? (
        <div className="flex items-center gap-1.5 w-full">
          <div className="relative flex-1">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "h-8 md:h-9 w-full pl-9 bg-background/50",
                "text-sm placeholder:text-muted-foreground/50",
                "transition-all duration-200",
                "focus-visible:bg-background",
                isFocused ? "shadow-sm" : "shadow-none"
              )}
              autoFocus
            />
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
              "text-muted-foreground/50 transition-colors duration-200",
              isFocused && "text-muted-foreground"
            )} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 md:h-9 w-8 md:w-9 p-0",
              "hover:bg-accent/40 hover:text-accent-foreground",
              "transition-all duration-200"
            )}
            onClick={toggleSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 md:h-9 w-8 md:w-9 p-0",
            "hover:bg-accent/40 hover:text-accent-foreground",
            "transition-all duration-200"
          )}
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;