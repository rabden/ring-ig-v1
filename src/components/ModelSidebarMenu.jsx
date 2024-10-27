import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ModelSidebarMenu = ({ isOpen, onClose, onSelectModel, currentModel, nsfwEnabled }) => {
  const handleModelSelect = (model) => {
    onSelectModel(model);
    onClose();
  };

  return (
    <div className={`fixed top-0 right-0 w-[300px] h-full bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="text-lg font-semibold">Choose Model</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)] p-4">
        <div className="space-y-2">
          {!nsfwEnabled ? (
            <>
              <Button
                variant={currentModel === 'flux' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleModelSelect('flux')}
              >
                Fast
              </Button>
              <Button
                variant={currentModel === 'fluxDev' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleModelSelect('fluxDev')}
              >
                Quality
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={currentModel === 'nsfwMaster' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleModelSelect('nsfwMaster')}
              >
                Reality
              </Button>
              <Button
                variant={currentModel === 'animeNsfw' ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleModelSelect('animeNsfw')}
              >
                Anime
              </Button>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ModelSidebarMenu;