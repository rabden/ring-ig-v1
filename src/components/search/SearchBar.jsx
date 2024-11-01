import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const toggleSearch = () => {
    if (isSearchOpen) {
      setQuery('');
      onSearch('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div className="flex items-center gap-2 max-w-[200px] md:max-w-none">
      {isSearchOpen ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Search prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-full min-w-[120px] bg-transparent text-sm"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
            onClick={toggleSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;