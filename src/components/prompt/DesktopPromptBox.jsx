import React, { useState, useRef, useEffect } from 'react';
import PromptInput from './PromptInput';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Sparkles, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const boxRef = useRef(null);
  const { isImproving, improveCurrentPrompt } = usePromptImprovement();
  const MAX_CREDITS = 50;
  const creditsProgress = (credits / MAX_CREDITS) * 100;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks inside image generator settings
      const settingsPanel = document.querySelector('.image-generator-settings');
      if (settingsPanel?.contains(event.target)) return;

      // Check if click is outside the prompt box
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImprovePrompt = async () => {
    await improveCurrentPrompt(prompt, (improvedPrompt) => {
      onChange({ target: { value: improvedPrompt } });
    });
  };

  const renderCredits = () => (
    <div className="space-y-2 min-w-[200px]">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Credits</span>
        <span className="font-medium">
          {credits}
          <span className="text-muted-foreground font-normal"> / {MAX_CREDITS}</span>
          {bonusCredits > 0 && (
            <span className="text-green-500 ml-1">+{bonusCredits}</span>
          )}
        </span>
      </div>
      <Progress value={creditsProgress} className="h-2 bg-secondary" />
    </div>
  );

  return (
    <div 
      ref={boxRef}
      className={cn(
        "hidden md:block w-full max-w-full px-10 mt-16 mb-8 transition-all duration-300",
        className
      )}
    >
      <div 
        className={cn(
          "relative bg-card shadow-sm border border-border/50 transition-all duration-300",
          isExpanded ? "rounded-lg" : "rounded-full"
        )}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className={cn(
          "transition-all duration-300",
          isExpanded ? "p-2" : "p-1"
        )}>
          {isExpanded ? (
            <>
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

              <div className="flex justify-between items-center mt-1">
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
            </>
          ) : (
            <div className="flex items-center gap-4">
              <input
                value={prompt}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="A 4D HDR immersive 3D image..."
                className="flex-1 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 px-4"
              />
              <Button
                size="sm"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerate();
                }}
                disabled={!prompt?.length || !hasEnoughCredits}
              >
                Generate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopPromptBox;