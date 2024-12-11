import React from 'react';
import { Button } from "@/components/ui/button";
import SettingSection from './SettingSection';
import { cn } from "@/lib/utils";

const ImageCountChooser = ({ count, setCount }) => {
  const counts = [1, 2, 3, 4];

  return (
    <SettingSection 
      label="Number of Images" 
      tooltip="Generate multiple images at once. Higher counts require more credits."
    >
      <div className="flex items-center gap-2">
        {counts.map((value) => (
          <Button
            key={value}
            variant={count === value ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCount(value)}
            className={cn(
              "rounded-full w-8 h-8 p-0",
              count === value ? "bg-muted hover:bg-muted/80" : "hover:bg-muted/50"
            )}
          >
            {value}
          </Button>
        ))}
      </div>
    </SettingSection>
  );
};

export default ImageCountChooser;