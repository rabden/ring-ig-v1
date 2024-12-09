import React, { useState, useRef, useEffect } from 'react';
import PromptInput from './PromptInput';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Sparkles, Loader } from 'lucide-react';
import CreditCounter from '@/components/ui/credit-counter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DesktopPromptBox = ({ 
  prompt,
  onChange,
  onKeyDown,
  onSubmit,
  hasEnoughCredits,
  onClear,
  credits,
  bonusCredits,
  className,
  userId,
  onVisibilityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const boxRef = useRef(null);
  const textareaRef = useRef(null);
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCreditsForImprovement = totalCredits >= 1;
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);

  // Handle visibility tracking
  useEffect(() => {
    if (!boxRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onVisibilityChange?.(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px' // Start showing fixed box after scrolling past header
      }
    );

    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside the prompt box
      if (boxRef.current?.contains(event.target)) {
        return;
      }

      // Check if click is inside the settings panel or its children
      const settingsPanel = document.querySelector('.bg-card.text-card-foreground');
      if (settingsPanel?.contains(event.target)) {
        return;
      }

      // Check if click is on a settings-related button or control
      if (event.target.closest('[class*="settings"]') || 
          event.target.closest('[role="dialog"]') ||
          event.target.closest('button') ||
          event.target.closest('[role="tab"]')) {
        return;
      }

      setIsExpanded(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus textarea when expanded
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end of text
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isExpanded]);

  const handleImprovePrompt = async () => {
    if (!userId) {
      toast.error('Please sign in to improve prompts');
      return;
    }

    if (!hasEnoughCreditsForImprovement) {
      toast.error('Not enough credits for prompt improvement');
      return;
    }

    try {
      await improveCurrentPrompt(prompt, (improvedPrompt) => {
        onChange({ target: { value: improvedPrompt } });
      });
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error('Failed to improve prompt');
    }
  };

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={boxRef}
      className={cn(
        "hidden md:block w-full max-w-full px-4 mt-16 mb-8",
        className
      )}
    >
      <div 
        className={cn(
          "relative bg-card shadow-sm border border-border/50",
          "transform-gpu",
          "transition-all duration-300 ease-in-out",
          isExpanded ? [
            "rounded-lg",
            "scale-100",
            "shadow-lg"
          ] : [
            "rounded-full",
            "scale-[0.98]",
            "cursor-pointer"
          ]
        )}
        onClick={handleExpand}
      >
        <div className={cn(
          "transition-all duration-400 ease-in-out",
          isExpanded ? "p-2" : "p-1"
        )}>
          {isExpanded ? (
            <>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder="A 4D HDR immersive 3D image..."
                  className="w-full min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-4 px-2 transition-colors duration-200"
                  style={{ 
                    caretColor: 'currentColor',
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-card to-transparent pointer-events-none z-[1] transition-opacity duration-200" />
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-[1] transition-opacity duration-200" />
              </div>

              <div className="flex justify-between items-center mt-0">
                <CreditCounter credits={credits} bonusCredits={bonusCredits} />
                <div className="flex items-center gap-2">
                  {prompt?.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full transition-transform duration-200 hover:scale-105"
                      onClick={onClear}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full transition-transform duration-200 hover:scale-105"
                    onClick={handleImprovePrompt}
                    disabled={!prompt?.length || isImproving || !hasEnoughCreditsForImprovement}
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
                    className="rounded-full transition-transform duration-200 hover:scale-105"
                    onClick={onSubmit}
                    disabled={!prompt?.length || !hasEnoughCredits}
                  >
                    Create
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
                className="rounded-full transition-transform duration-200 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmit();
                }}
                disabled={!prompt?.length || !hasEnoughCredits}
              >
                Create
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