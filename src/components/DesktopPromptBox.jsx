import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, X } from "lucide-react";
import PromptInput from '@/components/prompt/PromptInput';
import { cn } from '@/lib/utils';

const DesktopPromptBox = ({
  prompt,
  setPrompt,
  handlePromptKeyDown,
  isGenerating,
  isImproving,
  handleGenerate,
  handleImprove,
  credits,
  bonusCredits
}) => {
  return (
    <div className="hidden md:block fixed top-14 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="px-10 py-4">
        <div className="space-y-2">
          <PromptInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            onGenerate={handleGenerate}
            hasEnoughCredits={true}
            onClear={() => setPrompt('')}
            onImprove={handleImprove}
            isImproving={isImproving}
          />
          
          <div className="flex items-center justify-between">
            {/* Credits Counter */}
            <div className="flex items-center gap-2">
              <div className="text-sm">
                <span className="font-medium">{credits}</span>
                <span className="text-muted-foreground"> credits</span>
                {bonusCredits > 0 && (
                  <span className="text-muted-foreground">
                    {" + "}
                    <span className="text-primary font-medium">{bonusCredits}</span>
                    {" bonus"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fade-out gradient */}
      <div className="h-2 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default DesktopPromptBox; 