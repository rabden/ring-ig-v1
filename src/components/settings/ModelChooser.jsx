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
      "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border border-border/50",
      isActive ? "bg-muted/80 border-primary/50" : "hover:bg-muted/50 hover:border-primary/30",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-background flex-shrink-0 ring-1 ring-border/50">
      <img
        src={config.image}
        alt={config.name}
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-sm truncate">{config.name}</span>
        {config.isPremium && !proMode && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />}
      </div>
      <p className="text-xs text-muted-foreground truncate mt-0.5">
        {config.tagline || (config.category === "NSFW" ? "NSFW Generation" : "Image Generation")}
      </p>
    </div>
    {showRadio ? (
      isActive ? (
        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        </div>
      ) : (
        <div className="h-5 w-5 rounded-full border border-border/50" />
      )
    ) : (
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
    )}
  </div>
);

const ModelList = ({ filteredModels, model, setModel, proMode, className }) => (
  <ScrollArea className={cn("h-full overflow-y-auto px-1", className)}>
    <div className="space-y-2">
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
            <div className="w-full group">
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
            className="w-[280px] p-3"
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
        <div className="w-full group" onClick={() => setIsDrawerOpen(true)}>
          <ModelCard
            modelKey={model}
            config={currentModel}
            isActive={true}
            proMode={proMode}
            onClick={() => {}}
          />
        </div>
        <Drawer 
          open={isDrawerOpen} 
          onOpenChange={setIsDrawerOpen}
        >
          <DrawerContent className="focus:outline-none">
            <DrawerHeader className="border-b border-border/30 px-4 pb-4">
              <DrawerTitle className="text-lg font-semibold">Select Model</DrawerTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose between fast generation or higher quality output
              </p>
            </DrawerHeader>
            <div className="px-4 py-6">
              <ModelList 
                filteredModels={filteredModels}
                model={model}
                setModel={(key) => {
                  handleModelSelection(key);
                  setIsDrawerOpen(false);
                }}
                proMode={proMode}
                className="max-h-[65vh]"
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </SettingSection>
  );
};

export default ModelChooser;