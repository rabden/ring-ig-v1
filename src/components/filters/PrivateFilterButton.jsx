import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

const PrivateFilterButton = ({ showPrivate, onToggle }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => onToggle(!showPrivate)}
      className={cn(
        "h-8 md:h-9 px-3 md:px-4 flex items-center gap-1.5",
        "transition-all duration-200",
        "hover:bg-accent/40 hover:text-accent-foreground",
        showPrivate && "bg-accent/30 text-accent-foreground shadow-sm"
      )}
      title={showPrivate ? "Show public images" : "Show private images"}
    >
      {showPrivate ? (
        <Lock className="h-3.5 w-3.5 transition-transform duration-200" />
      ) : (
        <Unlock className="h-3.5 w-3.5 transition-transform duration-200" />
      )}
      <span className={cn(
        "text-xs md:text-sm font-medium",
        "hidden md:inline"
      )}>
        Private
      </span>
    </Button>
  );
};

export default PrivateFilterButton;