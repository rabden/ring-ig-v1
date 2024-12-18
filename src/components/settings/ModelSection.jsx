import React from 'react';
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import SettingSection from './SettingSection';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { cn } from "@/lib/utils";

const ModelSection = ({ model, setModel, quality, proMode, className }) => {
  const { data: modelConfigs, isLoading } = useModelConfigs();

  if (isLoading || !modelConfigs) {
    return null;
  }

  const renderModelButton = (modelKey, modelConfig) => {
    const isActive = model === modelKey;
    const isDisabled = !proMode && modelConfig.isPremium;

    return (
      <Button
        key={modelKey}
        variant={isActive ? 'default' : 'outline'}
        onClick={() => setModel(modelKey)}
        className={cn(
          "flex items-center justify-center gap-1.5",
          "transition-all duration-200",
          isActive && "bg-primary/10 text-primary hover:bg-primary/20",
          !isActive && "hover:bg-accent/40 hover:text-accent-foreground",
          "group"
        )}
        disabled={isDisabled}
      >
        <span className="text-sm font-medium">{modelConfig.name}</span>
        {modelConfig.isPremium && !proMode && (
          <Lock className={cn(
            "h-3.5 w-3.5",
            "transition-transform duration-200",
            "group-hover:scale-110"
          )} />
        )}
      </Button>
    );
  };

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
      className={className}
    >
      <div className={cn(
        "grid grid-cols-2 gap-2",
        "p-1 rounded-lg",
        "bg-muted/40 hover:bg-muted/60",
        "transition-colors duration-200"
      )}>
        {Object.entries(modelConfigs).map(([key, config]) => renderModelButton(key, config))}
      </div>
    </SettingSection>
  );
};

export default ModelSection;