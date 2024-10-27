import React from 'react';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const ModelSidebarMenu = ({ isOpen, onClose, onSelectModel, currentModel, nsfwEnabled }) => {
  const handleModelSelect = (value) => {
    if (value) {
      onSelectModel(value);
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-[300px] h-full bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="text-lg font-semibold">Choose Model</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>
      <div className="p-4">
        <ToggleGroup type="single" value={currentModel} onValueChange={handleModelSelect}>
          {!nsfwEnabled ? (
            <>
              <ToggleGroupItem value="flux" className="w-full mb-2">
                Fast
              </ToggleGroupItem>
              <ToggleGroupItem value="fluxDev" className="w-full">
                Quality
              </ToggleGroupItem>
            </>
          ) : (
            <>
              <ToggleGroupItem value="nsfwMaster" className="w-full mb-2">
                Reality
              </ToggleGroupItem>
              <ToggleGroupItem value="animeNsfw" className="w-full">
                Anime
              </ToggleGroupItem>
            </>
          )}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ModelSidebarMenu;