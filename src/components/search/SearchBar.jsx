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
    <div className="flex items-center gap-2">
      {isSearchOpen ? (
        <>
          <Input
            placeholder="Search image prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-[200px] bg-transparent"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3"
            onClick={toggleSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3"
          onClick={toggleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;