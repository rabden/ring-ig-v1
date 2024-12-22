import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Sparkles, Loader } from 'lucide-react';
import CreditCounter from '@/components/ui/credit-counter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';

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
  onVisibilityChange,
  activeModel,
  modelConfigs
}) => {
  const [isFixed, setIsFixed] = useState(false);
  const boxRef = useRef(null);
  const textareaRef = useRef(null);
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCreditsForImprovement = totalCredits >= 1;
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);

  // Handle scroll visibility
  useEffect(() => {
    if (!boxRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
        onVisibilityChange?.(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px'
      }
    );

    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  const handlePromptChange = (e) => {
    if (typeof onChange === 'function') {
      onChange({ target: { value: e.target.value } });
    }
  };

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
      await improveCurrentPrompt(prompt, activeModel, modelConfigs, (improvedPrompt) => {
        onChange({ target: { value: improvedPrompt } });
      });
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error('Failed to improve prompt');
    }
  };

  const handleSubmit = async () => {
    if (!prompt?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    onClear(); // Clear prompt immediately when generation starts
    await onSubmit();
  };

  return (
    <>
      {/* Normal position box */}
      <div 
        ref={boxRef}
        className={cn(
          "hidden md:block w-full max-w-[850px] mx-auto px-2 mt-16 transition-all duration-300",
          className
        )}
      >
        <div className="relative bg-card border border-border/80 rounded-2xl transition-all duration-300">
          <div className="p-2">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={onKeyDown}
                placeholder="A 4D HDR immersive 3D image..."
                className="w-full min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/40 overflow-y-auto scrollbar-none border-y border-border/5 py-6 px-3 transition-colors duration-200"
                style={{ caretColor: 'currentColor' }}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="w-[300px]">
                <CreditCounter credits={credits} bonusCredits={bonusCredits} />
              </div>
              <div className="flex items-center gap-2">
                {prompt?.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-xl hover:bg-background/10"
                    onClick={onClear}
                  >
                    <X className="h-4 w-4 text-foreground/70" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-xl bg-card hover:bg-background/10 transition-all duration-200"
                  onClick={handleImprovePrompt}
                  disabled={!prompt?.length || isImproving || !hasEnoughCreditsForImprovement}
                >
                  {isImproving ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin text-foreground/70" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2 text-foreground/70" />
                  )}
                  <span className="text-sm">Improve</span>
                </Button>
                <Button
                  size="sm"
                  className="h-8 rounded-xl bg-primary/90 hover:bg-primary/80 transition-all duration-200"
                  onClick={handleSubmit}
                  disabled={!prompt?.length || !hasEnoughCredits}
                >
                  <span className="text-sm">Create</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed position box */}
      <div 
        className={cn(
          "hidden md:block fixed top-14 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isFixed ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="max-w-[900px] mx-auto px-10 py-2">
          <div className="relative bg-card/95 backdrop-blur-[2px] border border-border/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
            <div className="flex items-center gap-4 p-1.5">
              <div 
                className="flex-1 px-4 text-muted-foreground/60 truncate cursor-pointer transition-colors duration-200 hover:text-muted-foreground/80"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => {
                    textareaRef.current?.focus();
                    const length = textareaRef.current?.value.length || 0;
                    textareaRef.current?.setSelectionRange(length, length);
                  }, 500);
                }}
              >
                {prompt || "A 4D HDR immersive 3D image..."}
              </div>
              <Button
                size="sm"
                className="h-8 rounded-full bg-primary/90 hover:bg-primary/80 transition-all duration-200"
                onClick={handleSubmit}
                disabled={!prompt?.length || !hasEnoughCredits}
              >
                <span className="text-sm">Create</span>
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