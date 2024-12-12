import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, ChevronRight, Check } from "lucide-react";
import SettingSection from './SettingSection';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { modelConfig } from "@/config/modelConfig";

const ModelCard = ({ modelKey, config, isActive, showRadio = false, onClick, disabled, proMode }) => (
  <div
    className={cn(
      "flex items-center gap-2 p-2 rounded-lg transition-colors border border-border/50",
      isActive ? "bg-muted" : "hover:bg-muted/50",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <div className="relative h-9 w-9 rounded-md overflow-hidden bg-background flex-shrink-0">
      <img
        src={config.image}
        alt={config.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1">
        <span className="font-medium text-sm truncate">{config.name}</span>
        {config.isPremium && !proMode && <Lock className="h-3 w-3 flex-shrink-0" />}
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {config.tagline || (config.category === "NSFW" ? "NSFW Generation" : "Image Generation")}
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

  // Check if current model is premium and user is not pro
  useEffect(() => {
    if (currentModel.isPremium && !proMode) {
      // Revert to default non-premium model
      setModel('flux');
    }
  }, [currentModel, proMode, setModel]);

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full">
            <ModelCard
              modelKey={model}
              config={currentModel}
              isActive={true}
              proMode={proMode}
              onClick={() => {}}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          side="left" 
          align="start" 
          className="w-[250px] p-2"
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