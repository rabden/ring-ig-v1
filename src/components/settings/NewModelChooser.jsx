import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const NewModelChooser = ({ model, setModel, nsfwEnabled, proMode, modelConfigs }) => {
  if (!modelConfigs) return null;

  const filteredModels = Object.entries(modelConfigs).filter(([_, config]) => 
    nsfwEnabled ? config.category === "NSFW" : config.category === "General"
  );

  return (
    <RadioGroup
      value={model}
      onValueChange={setModel}
      className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar"
    >
      {filteredModels.map(([key, config]) => (
        <Card
          key={key}
          className={cn(
            "relative flex flex-col items-center justify-center p-3 cursor-pointer transition-all hover:bg-accent min-w-[100px]",
            model === key && "border-primary bg-accent",
            (!proMode && config.isPremium) && "opacity-50"
          )}
        >
          <RadioGroupItem
            value={key}
            id={key}
            className="sr-only"
            disabled={!proMode && config.isPremium}
          />
          <div className="text-sm font-medium flex items-center gap-1">
            {config.name}
            {!proMode && config.isPremium && <Lock className="h-3 w-3" />}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {config.description || (config.isPremium ? "Pro" : "Free")}
          </div>
        </Card>
      ))}
    </RadioGroup>
  );
};

export default NewModelChooser; 