import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from '@/lib/utils';

const TruncatablePrompt = ({ prompt, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = prompt.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? `${prompt.slice(0, maxLength)}...` 
    : prompt;

  return (
    <div className={cn(
      "group relative",
      "transition-all duration-200"
    )}>
      <p className={cn(
        "text-sm whitespace-pre-wrap",
        "text-white/70 group-hover:text-white/90",
        "transition-colors duration-200"
      )}>
        {displayText}
      </p>
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "absolute -bottom-6 left-1/2 -translate-x-1/2",
            "h-6 px-2 py-1",
            "bg-black/30 hover:bg-black/40",
            "text-white/70 hover:text-white",
            "opacity-80 hover:opacity-100",
            "transition-all duration-200"
          )}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export default TruncatablePrompt;