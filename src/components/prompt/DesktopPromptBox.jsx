import React from 'react';
import PromptInput from './PromptInput';

const DesktopPromptBox = ({ 
  prompt,
  onChange,
  onKeyDown,
  onGenerate,
  hasEnoughCredits,
  onClear,
  onImprove,
  isImproving,
  credits,
  bonusCredits,
  className
}) => {
  return (
    <div className={`hidden md:block w-full max-w-full px-10 mt-16 mb-8 ${className}`}>
      <div className="relative bg-card rounded-lg shadow-sm border border-border/50">
        <div className="p-4 pb-2">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-muted-foreground">
              Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
            </div>
          </div>

          <PromptInput
            value={prompt}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onGenerate={onGenerate}
            hasEnoughCredits={hasEnoughCredits}
            onClear={onClear}
            onImprove={onImprove}
            isImproving={isImproving}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopPromptBox;