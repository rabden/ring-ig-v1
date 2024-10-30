import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

const PromptInput = ({ value, onChange, onKeyDown, onGenerate }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
      setShowClear(scrollHeight > 100);
    }
  }, [value]);

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className={`relative border rounded-md transition-all ${isFocused ? 'min-h-[80px]' : 'h-10'}`}>
      <div className="flex items-start h-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your prompt here"
          className={`w-full resize-none overflow-y-auto bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 rounded-md ${isFocused ? 'pr-10' : 'pr-12'}`}
          style={{ maxHeight: '300px', minHeight: isFocused ? '80px' : '36px' }}
        />
        <div className={`absolute right-2 ${isFocused ? 'bottom-2' : 'top-1/2 -translate-y-1/2'} flex ${isFocused ? 'flex-col' : 'flex-row'} gap-2`}>
          {showClear && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {(isFocused || value.length > 0) && (
            <Button
              size="icon"
              className="h-7 w-7"
              onClick={onGenerate}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;