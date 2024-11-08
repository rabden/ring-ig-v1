import React, { useState } from 'react';
import { cn } from "@/lib/utils";

const TruncatablePrompt = ({ prompt, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <p 
      onClick={() => setIsExpanded(!isExpanded)} 
      className={cn(
        "text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words cursor-pointer transition-all",
        !isExpanded && "line-clamp-3",
        className
      )}
    >
      {prompt}
    </p>
  );
};

export default TruncatablePrompt;