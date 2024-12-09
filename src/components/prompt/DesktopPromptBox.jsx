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
    <div className={`hidden md:block w-full max-w-full px-10 mt-16 mb-4 ${className}`}>
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        
        <div className="flex flex-col gap-4">
          {credits !== undefined && (
            <div className="text-sm font-medium">
              Credits: {credits}{bonusCredits > 0 ? ` + B${bonusCredits}` : ''}
            </div>
          )}
          
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