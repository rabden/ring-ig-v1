import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

const PrivateFilterButton = ({ showPrivate, onToggle }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="h-8 px-3 flex items-center gap-1"
    >
      {showPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      <span className="hidden md:inline">Private</span>
    </Button>
  );
};

export default PrivateFilterButton;