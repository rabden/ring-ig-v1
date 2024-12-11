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
  onExpandedChange
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const boxRef = useRef(null);
  const textareaRef = useRef(null);
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCreditsForImprovement = totalCredits >= 1;
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);

  // Handle scroll visibility for fixed header only
  useEffect(() => {
    if (!boxRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
        onExpandedChange?.(entry.isIntersecting);
      },
      {
        threshold: 0,
        // Increased bottom margin to create a buffer zone
        rootMargin: '-64px 0px -200px 0px'
      }
    );

    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [onExpandedChange]);

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
    if (isFixed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Normal position box - always expanded */}
      <div className="hidden md:block">
        <div 
          ref={boxRef}
          className={cn(
            "w-full max-w-[700px] mx-auto px-4 mt-16",
            className
          )}
        >
          <div className="relative bg-card shadow-sm border border-border/50 rounded-lg shadow-lg">
            <div className="p-2">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder="A 4D HDR immersive 3D image..."
                  className="w-full min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-4 px-2"
                  style={{ caretColor: 'currentColor' }}
                />
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-card to-transparent pointer-events-none z-[1]" />
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card to-transparent pointer-events-none z-[1]" />
              </div>

              <div className="flex justify-between items-center mt-0">
                <CreditCounter credits={credits} bonusCredits={bonusCredits} />
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
                    className="rounded-full"
                    onClick={onSubmit}
                    disabled={!prompt?.length || !hasEnoughCredits}
                  >
                    Create
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Spacer div to create a buffer zone */}
          <div className="h-[200px]" />
        </div>
      </div>

      {/* Fixed position box */}
      <div 
        className={cn(
          "hidden md:block fixed top-12 left-0 right-0 z-50",
          isFixed ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-[700px] mx-auto px-10 py-2">
          <div 
            className="relative bg-card shadow-sm border border-border/50 rounded-full cursor-pointer"
            onClick={handleExpand}
          >
            <div className="flex items-center gap-4 p-1">
              <div className="flex-1 px-4 text-muted-foreground/50 truncate">
                {prompt || "A 4D HDR immersive 3D image..."}
              </div>
              <Button
                size="sm"
                className="rounded-full"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopPromptBox;