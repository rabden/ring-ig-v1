import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const PrivateFilterButton = ({ showPrivate, onToggle, disabled }) => {
  return (
    <Button
      variant={showPrivate ? 'default' : 'outline'}
      onClick={onToggle}
      className="text-xs px-2 py-1 h-8"
      disabled={disabled}
    >
      <Lock className="h-4 w-4 mr-1" />
      Private
    </Button>
  );
};

export default PrivateFilterButton;