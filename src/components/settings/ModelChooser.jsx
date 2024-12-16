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

// Current card style for selected model
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
        className="w-full h-full object-cover"
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
    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
  </div>
);

// New grid card style for dropdown/drawer
const ModelGridCard = ({ modelKey, config, isActive, onClick, disabled, proMode }) => (
  <div
    className={cn(
      "group relative aspect-square rounded-xl overflow-hidden transition-all duration-200 border-2",
      isActive ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/50",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <img
      src={config.image}
      alt={config.name}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    
    {/* Content */}
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <div className="flex items-center gap-2">
        <span className="font-medium text-white truncate">{config.name}</span>
        {config.isPremium && !proMode && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-white/80" />}
      </div>
    </div>

    {/* Active indicator */}
    {isActive && (
      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center">
        <Check className="h-4 w-4" />
      </div>
    )}
  </div>
);

const ModelGrid = ({ filteredModels, model, setModel, proMode, className }) => (
  <ScrollArea className={cn("h-full overflow-y-auto px-1", className)}>
    <div className="grid grid-cols-2 gap-3">
      {filteredModels.map(([key, config]) => (
        <ModelGridCard
          key={key}
          modelKey={key}
          config={config}
          isActive={model === key}
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
            className="w-[500px] p-3 max-h-[65vh]"
          >
            <ModelGrid 
              filteredModels={filteredModels}
              model={model}
              setModel={handleModelSelection}
              proMode={proMode}
              className="max-h-[calc(65vh-1rem)]"
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
              <DrawerTitle>Select Model</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-6">
              <ModelGrid 
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