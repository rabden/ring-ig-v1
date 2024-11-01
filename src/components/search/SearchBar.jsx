import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SearchBar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 px-3"
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search image prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;