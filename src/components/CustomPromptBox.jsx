import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomPromptBox = ({ value, onChange, onKeyDown, onGenerate, className }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [value]);

  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className={cn("relative rounded-lg border bg-background", className)}>
      <ScrollArea className="h-full max-h-[300px]">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Enter your prompt here..."
            className="min-h-[56px] w-full resize-none bg-transparent px-4 py-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 pr-24"
            style={{ overflow: 'hidden' }}
          />
        </div>
      </ScrollArea>
      
      <div className="absolute right-2 top-2 flex flex-row gap-2">
        {value.length > 0 && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {value.length > 0 && (
          <Button
            size="icon"
            onClick={onGenerate}
            className="h-8 w-8"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomPromptBox;