import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { modelConfigs } from '@/utils/modelConfigs';

const ModelSidebarMenu = ({ isOpen, onClose, onSelectModel, currentModel }) => {
  const groupedModels = Object.entries(modelConfigs).reduce((acc, [key, config]) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push({ key, ...config });
    return acc;
  }, {});

  return (
    <div className={`fixed top-0 right-0 w-[300px] h-full bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-4 flex justify-between items-center border-b border-border">
        <h2 className="text-lg font-semibold">Choose Model</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
      </div>
      <ScrollArea className="h-[calc(100vh-64px)] p-4">
        {Object.entries(groupedModels).map(([category, models]) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-muted-foreground">{category}</h3>
            {models.map((model) => (
              <Button
                key={model.key}
                variant={currentModel === model.key ? "secondary" : "ghost"}
                className="w-full justify-start mb-1 text-left"
                onClick={() => {
                  onSelectModel(model.key);
                  onClose();
                }}
              >
                <span className="truncate">{model.name}</span>
              </Button>
            ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default ModelSidebarMenu;