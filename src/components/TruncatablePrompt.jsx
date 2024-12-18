import React, { useState } from 'react';
import { cn } from "@/lib/utils";

const TruncatablePrompt = ({ prompt, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = prompt.length > 150;

  return (
    <div className={cn("relative", className)}>
      <p 
        className={cn(
          "text-sm text-muted-foreground",
          !isExpanded && shouldTruncate && "line-clamp-3"
        )}
      >
        {prompt}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary hover:underline mt-1 font-medium"
        >
          {isExpanded ? "Less" : "More"}
        </button>
      )}
    </div>
  );
};

export default TruncatablePrompt;