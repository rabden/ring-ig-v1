import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingSection from './SettingSection';
import { cn } from "@/lib/utils";

const ImageCountChooser = ({ count, setCount, className }) => {
  return (
    <SettingSection 
      label="Number of Images" 
      tooltip="Generate multiple images at once. Higher counts require more credits."
      className={className}
    >
      <Tabs 
        value={count.toString()} 
        onValueChange={(value) => setCount(parseInt(value))}
        className="w-full"
      >
        <TabsList className={cn(
          "grid grid-cols-4 p-1 h-9",
          "bg-muted/40 hover:bg-muted/60",
          "transition-colors duration-200"
        )}>
          {[1, 2, 3, 4].map((num) => (
            <TabsTrigger 
              key={num}
              value={num.toString()}
              className={cn(
                "text-sm font-medium",
                "data-[state=active]:bg-background",
                "data-[state=active]:text-foreground",
                "data-[state=active]:shadow-sm",
                "transition-all duration-200"
              )}
            >
              {num}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </SettingSection>
  );
};

export default ImageCountChooser;