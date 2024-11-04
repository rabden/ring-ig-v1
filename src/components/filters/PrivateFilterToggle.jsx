import React from 'react';
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";

const PrivateFilterToggle = ({ showPrivate, onToggle, activeView }) => {
  if (activeView !== 'myImages') return null;

  const handleToggle = () => {
    if (typeof onToggle === 'function') {
      onToggle(!showPrivate);
    }
  };

  return (
    <Button
      variant={showPrivate ? 'default' : 'outline'}
      size="sm"
      className="h-8 px-3"
      onClick={handleToggle}
    >
      <EyeOff className="h-4 w-4 mr-2" />
      Private
    </Button>
  );
};

export default PrivateFilterToggle;