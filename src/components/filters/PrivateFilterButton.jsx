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
        "h-8 px-3 flex items-center gap-1 transition-colors duration-200",
        showPrivate && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      title={showPrivate ? "Show public images" : "Show private images"}
    >
      {showPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      <span className="hidden md:inline">Private</span>
    </Button>
  );
};

export default PrivateFilterButton;