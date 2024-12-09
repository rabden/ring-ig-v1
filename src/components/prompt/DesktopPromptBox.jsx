import React from 'react';
import PromptInput from './PromptInput';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Sparkles, Loader } from 'lucide-react';

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

  const renderCredits = () => (
    <div className="text-sm">
      <span className="text-muted-foreground">Credits: </span>
      <span className="font-medium">{credits}</span>
      {bonusCredits > 0 && (
        <span className="text-green-500 ml-1">+{bonusCredits}</span>
      )}
    </div>
  );

  return (
    <div className={`hidden md:block w-full max-w-full px-10 mt-16 mb-8 ${className}`}>
      <div className="relative bg-card rounded-lg shadow-sm border border-border/50">
        <div className="p-2">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={onChange}
              onKeyDown={onKeyDown}
              placeholder="A 4D HDR immersive 3D image..."
              className="w-full min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-4 px-2"
              style={{ 
                caretColor: 'currentColor',
              }}
            />
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-card to-transparent pointer-events-none z-[1]" />
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-[1]" />
          </div>

          <div className="flex justify-between items-center mt-4">
            {renderCredits()}
            <div className="flex items-center gap-2">
              {prompt?.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={onClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={handleImprovePrompt}
                disabled={!prompt?.length || isImproving}
              >
                {isImproving ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Improve
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                onClick={onGenerate}
                disabled={!prompt?.length || !hasEnoughCredits}
              >
                Generate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopPromptBox;