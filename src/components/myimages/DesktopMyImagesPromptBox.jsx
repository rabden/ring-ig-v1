import React from 'react';
import PromptInput from '@/components/prompt/PromptInput';

const DesktopMyImagesPromptBox = ({
  prompt,
  setPrompt,
  handlePromptKeyDown,
  isGenerating,
  isImproving,
  handleGenerate,
  handleImprove,
  credits,
  bonusCredits,
  hasEnoughCredits = true
}) => {
  return (
    <div className="hidden md:block bg-background/80 backdrop-blur-sm border-b mt-12">
      <div className="px-10 py-4">
        <div className="space-y-4">
          {/* Credits Counter */}
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

          {/* Prompt Input with built-in controls */}
          <PromptInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKeyDown}
            onGenerate={handleGenerate}
            hasEnoughCredits={hasEnoughCredits}
            onClear={() => setPrompt('')}
            onImprove={handleImprove}
            isImproving={isImproving}
          />
        </div>
      </div>
      {/* Fade-out gradient */}
      <div className="h-2 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default DesktopMyImagesPromptBox; 