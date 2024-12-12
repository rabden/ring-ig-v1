import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock, ChevronRight, Check } from "lucide-react";
import SettingSection from './SettingSection';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { modelConfig } from "@/config/modelConfig";
import Image from "next/image";

const ModelCard = ({ modelKey, config, isActive, showRadio = false, onClick, disabled, proMode }) => (
  <div
    className={cn(
      "flex items-center gap-3 p-3 rounded-lg transition-colors",
      isActive ? "bg-muted" : "hover:bg-muted/50",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-background">
      <Image
        src={config.image}
        alt={config.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1">
        <span className="font-medium truncate">{config.name}</span>
        {config.isPremium && !proMode && <Lock className="h-3 w-3 flex-shrink-0" />}
      </div>
      <p className="text-sm text-muted-foreground truncate">
        {config.tagline}
      </p>
    </div>
    {showRadio ? (
      isActive ? <Check className="h-4 w-4 flex-shrink-0" /> : <div className="w-4" />
    ) : (
      <ChevronRight className="h-4 w-4 flex-shrink-0" />
    )}
  </div>
);

const ModelChooser = ({ model, setModel, nsfwEnabled, proMode }) => {
  const filteredModels = Object.entries(modelConfig).filter(([_, config]) => 
    nsfwEnabled ? config.category === "NSFW" : config.category === "General"
  );

  const currentModel = modelConfig[model];
  if (!currentModel) return null;

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full p-0 border-0 shadow-none hover:bg-transparent"
          >
            <ModelCard
              modelKey={model}
              config={currentModel}
              isActive={true}
              proMode={proMode}
              onClick={() => {}}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="left" 
          align="start" 
          className="w-[280px] p-2"
        >
          <div className="space-y-1">
            {filteredModels.map(([key, config]) => (
              <ModelCard
                key={key}
                modelKey={key}
                config={config}
                isActive={model === key}
                showRadio={true}
                proMode={proMode}
                onClick={() => setModel(key)}
                disabled={!proMode && config.isPremium}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </SettingSection>
  );
};

export default ModelChooser;