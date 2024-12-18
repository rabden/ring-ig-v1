import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch, initialQuery = '' }) => {
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
    <div className="flex items-center gap-1 max-w-[160px] md:max-w-none">
      {isSearchOpen ? (
        <div className="flex items-center gap-1 w-full">
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-7 md:h-8 w-full min-w-[100px] bg-transparent text-xs md:text-sm"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 md:h-8 w-7 md:w-8 p-0 flex-shrink-0"
            onClick={toggleSearch}
          >
            <X className="h-3 md:h-4 w-3 md:w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 md:h-8 w-7 md:w-8 p-0"
          onClick={toggleSearch}
        >
          <Search className="h-3 md:h-4 w-3 md:w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;