import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Lock, ChevronRight, Check } from "lucide-react";
import SettingSection from './SettingSection';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200",
      "border border-border/20 bg-card/40",
      isActive ? [
        "bg-accent/20 border-primary/40",
        "shadow-[0_0_0_1px] shadow-primary/20"
      ] : [
        "hover:bg-accent/10 hover:border-border/30",
        "hover:shadow-[0_0_0_1px] hover:shadow-border/20"
      ],
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.98]"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-background flex-shrink-0 ring-1 ring-border/20">
      <img
        src={config.image}
        alt={config.name}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm text-foreground/90">{config.name}</span>
        {config.isPremium && !proMode && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/70" />}
      </div>
      <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
        {config.tagline || (config.category === "NSFW" ? "NSFW Generation" : "Image Generation")}
      </p>
    </div>
    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
  </div>
);

// New grid card style for dropdown/drawer
const ModelGridCard = ({ modelKey, config, isActive, onClick, disabled, proMode }) => (
  <div
    className={cn(
      "group relative aspect-square rounded-xl overflow-hidden transition-all duration-200",
      "border-2 bg-card/40",
      isActive ? [
        "border-primary/60",
        "shadow-[0_0_0_1px] shadow-primary/30"
      ] : [
        "border-border/20",
        "hover:border-border/40",
        "hover:shadow-[0_0_0_1px] hover:shadow-border/30"
      ],
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    )}
    onClick={disabled ? undefined : onClick}
  >
    <img
      src={config.image}
      alt={config.name}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
    
    {/* Content */}
    <div className="absolute bottom-0 left-0 right-0 p-3.5">
      <div className="flex items-center gap-2">
        <span className="font-medium text-white/90 truncate">{config.name}</span>
        {config.isPremium && !proMode && <Lock className="h-3.5 w-3.5 flex-shrink-0 text-white/80" />}
      </div>
    </div>

    {/* Active indicator */}
    {isActive && (
      <div className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center">
        <Check className="h-4 w-4" />
      </div>
    )}
  </div>
);

const ModelGrid = ({ filteredModels, model, setModel, proMode, className }) => (
  <ScrollArea className={cn("h-full overflow-y-auto px-1.5", className)}>
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

const ModelChooser = ({ model, setModel, proMode, nsfwEnabled, modelConfigs }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filter models based on NSFW state
  const filteredModels = useMemo(() => {
    if (!modelConfigs) return [];
    
    // Get all models as entries
    const allModels = Object.entries(modelConfigs);
    
    // Filter based on NSFW state
    return allModels.filter(([_, config]) => {
      if (nsfwEnabled) {
        return config.category === "NSFW";
      }
      return config.category === "General";
    });
  }, [nsfwEnabled, modelConfigs]);

  // Default model for each mode
  const defaultModel = useMemo(() => {
    return nsfwEnabled ? 'nsfwMaster' : 'turbo';
  }, [nsfwEnabled]);

  // Handle model selection
  const handleModelSelection = useCallback((newModel) => {
    const modelData = modelConfigs?.[newModel];
    if (!modelData) return;

    const isCorrectCategory = nsfwEnabled 
      ? modelData.category === "NSFW"
      : modelData.category === "General";

    if (isCorrectCategory) {
      setModel(newModel);
      setIsDrawerOpen(false);
    }
  }, [nsfwEnabled, setModel, modelConfigs]);

  // Ensure current model is valid for NSFW state
  useEffect(() => {
    const currentModel = modelConfigs?.[model];
    if (!currentModel || currentModel.category !== (nsfwEnabled ? "NSFW" : "General")) {
      setModel(defaultModel);
    }
  }, [nsfwEnabled, model, defaultModel, setModel, modelConfigs]);

  const currentModel = modelConfigs?.[model];
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
            className="w-[520px] p-3.5 max-h-[65vh] border border-border/20 bg-popover/95 backdrop-blur-sm"
          >
            <ModelGrid 
              filteredModels={filteredModels}
              model={model}
              setModel={handleModelSelection}
              proMode={proMode}
              className="max-h-[calc(65vh-1.5rem)]"
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
            <DrawerHeader className="border-b border-border/20 px-4 pb-4">
              <DrawerTitle className="text-lg font-semibold">Select Model</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-6">
              <ModelGrid 
                filteredModels={filteredModels}
                model={model}
                setModel={handleModelSelection}
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