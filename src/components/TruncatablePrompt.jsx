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
        {shouldTruncate && (
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:underline cursor-pointer ml-1"
          >
            {isExpanded ? "...less" : "...more"}
          </span>
        )}
      </p>
    </div>
  );
};

export default TruncatablePrompt;