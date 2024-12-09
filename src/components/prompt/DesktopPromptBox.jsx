import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const DesktopPromptBox = ({
  prompt,
  onChange,
  onKeyDown,
  onGenerate,
  hasEnoughCredits,
  isGenerating,
  onImprove,
  onClear,
  totalCredits,
  bonusCredits,
  className
}) => {
  return (
    <div className={`hidden md:block w-full max-w-full px-10 mt-16 mb-8 ${className}`}>
      <div className="relative bg-card rounded-lg shadow-sm border border-border/50">
        <div className="flex flex-col">
          <div className="relative">
            <ScrollArea className="h-full max-h-[400px]">
              <textarea
                value={prompt}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="A 4D HDR immersive 3D image..."
                className="w-full min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-4 px-2"
              />
            </ScrollArea>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Credits: {totalCredits + (bonusCredits || 0)}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                disabled={!prompt}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onImprove}
                disabled={!prompt}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button
                onClick={onGenerate}
                disabled={!hasEnoughCredits || !prompt || isGenerating}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopPromptBox;