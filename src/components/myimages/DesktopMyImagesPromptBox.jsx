import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, X } from "lucide-react";
import PromptInput from '../PromptInput';
import { cn } from '@/lib/utils';

const DesktopMyImagesPromptBox = ({
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
    <div className="hidden md:block bg-background/80 backdrop-blur-sm border-b mt-12">
      <div className="px-10 py-4">
        <div className="space-y-2">
          <PromptInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            placeholder="Describe what you want to create..."
            className="min-h-[80px]"
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {prompt && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPrompt('')}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleImprove}
                disabled={isGenerating || isImproving || !prompt}
                className={cn(
                  "relative",
                  isImproving && "text-primary"
                )}
              >
                {isImproving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Improve
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || isImproving || !prompt}
                className="relative"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Fade-out gradient */}
      <div className="h-2 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default DesktopMyImagesPromptBox; 