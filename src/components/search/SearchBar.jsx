import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchBar = ({ onSearch, initialQuery = '', className }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(!!initialQuery);
  const [query, setQuery] = useState(initialQuery);

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
      "flex items-center gap-1.5 max-w-[160px] md:max-w-none transition-all duration-200",
      className
    )}>
      {isSearchOpen ? (
        <div className="flex items-center gap-1.5 w-full animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="relative flex-1">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "h-8 w-full min-w-[100px] text-sm",
                "bg-muted/5 hover:bg-muted/10 focus:bg-muted/10",
                "border-border/5 focus-visible:border-border/40",
                "rounded-xl transition-all duration-200",
                "placeholder:text-muted-foreground/40"
              )}
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-lg hover:bg-accent/10"
                onClick={() => handleSearch('')}
              >
                <X className="h-3 w-3 text-muted-foreground/50" />
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-xl hover:bg-accent/10"
            onClick={toggleSearch}
          >
            <X className="h-4 w-4 text-foreground/70" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-xl hover:bg-accent/10"
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4 text-foreground/70" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;