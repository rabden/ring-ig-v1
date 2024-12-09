import React from 'react';
import PromptInput from './PromptInput';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';

const DesktopPromptBox = ({ 
  prompt,
  onChange,
  onKeyDown,
  onGenerate,
  hasEnoughCredits,
  onClear,
  credits,
  bonusCredits,
  className
}) => {
  const { isImproving, improveCurrentPrompt } = usePromptImprovement();

  const handleImprovePrompt = async () => {
    await improveCurrentPrompt(prompt, (improvedPrompt) => {
      onChange({ target: { value: improvedPrompt } });
    });
  };

  return (
    <div className={`hidden md:block w-full max-w-full px-10 mt-16 mb-8 ${className}`}>
      <div className="relative bg-card rounded-lg shadow-sm border border-border/50">
        <div className="p-2">
          <PromptInput
            value={prompt}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onGenerate={onGenerate}
            hasEnoughCredits={hasEnoughCredits}
            onClear={onClear}
            onImprove={handleImprovePrompt}
            isImproving={isImproving}
          />

          <div className="flex justify-between items-center mt-2">
            <div className="text-sm font-medium text-muted-foreground">
              Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopPromptBox;