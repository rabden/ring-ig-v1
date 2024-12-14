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
  onExpandedChange
}) => {
  const [isOutOfViewport, setIsOutOfViewport] = useState(false);
  const boxRef = useRef(null);
  const textareaRef = useRef(null);
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCreditsForImprovement = totalCredits >= 1;
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);

  // Handle scroll visibility for settings panel
  useEffect(() => {
    if (!boxRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOutOfViewport(!entry.isIntersecting);
        // Notify parent about visibility change for settings panel
        onExpandedChange?.(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px'
      }
    );

    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, [onExpandedChange]);

  // Focus textarea when mounted
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

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
      {/* Main prompt box - always visible */}
      <div 
        ref={boxRef}
        className={cn(
          "block md:block w-full max-w-[700px] mx-auto px-4 mt-16 mb-2",
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
                  onClick={handleSubmit}
                  disabled={!prompt?.length || !hasEnoughCredits}
                >
                  Create
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed position box - shows when main box is out of viewport */}
      {isOutOfViewport && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4 hidden md:block z-50">
          <div className="max-w-[700px] mx-auto">
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
                onClick={handleSubmit}
                disabled={!prompt?.length || !hasEnoughCredits}
              >
                Create
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DesktopPromptBox;