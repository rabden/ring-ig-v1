import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, ChevronRight, Check } from "lucide-react";
import SettingSection from './SettingSection';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { modelConfig } from "@/config/modelConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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

const ModelList = ({ filteredModels, model, setModel, proMode, className }) => (
  <ScrollArea className={cn("h-full overflow-y-auto", className)}>
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
          disabled={config.isPremium && !proMode}
        />
      ))}
    </div>
  </ScrollArea>
);

const ModelChooser = ({ model, setModel, proMode }) => {
  const { nsfwEnabled } = useImageGeneratorState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const filteredModels = useMemo(() => 
    Object.entries(modelConfig).filter(([_, config]) => 
      nsfwEnabled ? config.category === "NSFW" : config.category === "General"
    ),
    [nsfwEnabled]
  );

  const defaultModel = useMemo(() => 
    nsfwEnabled ? 'nsfwMaster' : 'turbo',
    [nsfwEnabled]
  );

  const handleModelSelection = useCallback((newModel) => {
    const modelData = modelConfig[newModel];
    if (!modelData) return;

    const isModelAllowed = nsfwEnabled 
      ? modelData.category === "NSFW"
      : modelData.category === "General";

    setModel(isModelAllowed ? newModel : defaultModel);
  }, [nsfwEnabled, defaultModel, setModel]);

  useEffect(() => {
    const currentModel = modelConfig[model];
    if (!currentModel) {
      handleModelSelection(defaultModel);
      return;
    }

    const isCurrentModelAllowed = filteredModels.some(([key]) => key === model);
    if (!isCurrentModelAllowed) {
      handleModelSelection(defaultModel);
    }
  }, [nsfwEnabled, model, handleModelSelection, defaultModel, filteredModels]);

  const currentModel = modelConfig[model];
  if (!currentModel) return null;

  return (
    <SettingSection 
      label="Model" 
      tooltip="Choose between fast generation or higher quality output."
    >
      {/* Desktop: Popover */}
      <div className="hidden md:block">
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
            sideOffset={20}
            className="w-[250px] p-2"
          >
            <ModelList 
              filteredModels={filteredModels}
              model={model}
              setModel={handleModelSelection}
              proMode={proMode}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Drawer */}
      <div className="md:hidden">
        <div className="w-full" onClick={() => setIsDrawerOpen(true)}>
          <ModelCard
            modelKey={model}
            config={currentModel}
            isActive={true}
            proMode={proMode}
            onClick={() => {}}
          />
        </div>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Model</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pt-0">
              <ModelList 
                filteredModels={filteredModels}
                model={model}
                setModel={(key) => {
                  handleModelSelection(key);
                  setIsDrawerOpen(false);
                }}
                proMode={proMode}
                className="max-h-[60vh]"
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </SettingSection>
  );
};

export default ModelChooser;