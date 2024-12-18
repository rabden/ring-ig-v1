import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

const PrivateFilterButton = ({ showPrivate, onToggle }) => {
  return (
    <Button
      variant={showPrivate ? "default" : "ghost"}
      size="sm"
      onClick={() => {
        // Call onToggle with the new value
        onToggle(!showPrivate);
      }}
      className={cn(
        "h-8 px-4 flex items-center gap-2 rounded-xl bg-background/50 hover:bg-accent/10 transition-all duration-200",
        showPrivate && "bg-primary/30 hover:bg-primary/40 text-primary-foreground"
      )}
      title={showPrivate ? "Show public images" : "Show private images"}
    >
      {showPrivate ? 
        <Lock className="h-4 w-4 text-foreground/80" /> : 
        <Unlock className="h-4 w-4 text-foreground/80" />
      }
      <span className="hidden md:inline text-xs">Private</span>
    </Button>
  );
};

export default PrivateFilterButton;