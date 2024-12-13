import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Sparkles, Loader } from "lucide-react";
import { toast } from "sonner";
import CreditCounter from '@/components/ui/credit-counter';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';

const PromptInput = ({ 
  value = '', 
  onChange, 
  onKeyDown, 
  onGenerate, 
  hasEnoughCredits = true,
  onClear,
  userId,
  credits = 0,
  bonusCredits = 0
}) => {
  const hasText = value && value.trim().length > 0;
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCreditsForImprovement = totalCredits >= 1;
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);

  const handleGenerate = async () => {
    if (!userId) {
      toast.error('Please sign in to generate images');
      return;
    }
    if (!hasText) {
      toast.error('Please enter a prompt');
      return;
    }
    if (!hasEnoughCredits) {
      toast.error('Not enough credits');
      return;
    }
    await onGenerate();
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
      await improveCurrentPrompt(value, (improvedPrompt) => {
        onChange({ target: { value: improvedPrompt } });
      });
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error('Failed to improve prompt');
    }
  };

  return (
    <div className="relative mb-8">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="A 4D HDR immersive 3D image..."
          className="w-full min-h-[430px] md:min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-4 px-2 md:px-2"
          style={{ 
            caretColor: 'currentColor',
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <CreditCounter credits={credits} bonusCredits={bonusCredits} />
        <div className="flex items-center gap-2">
          {hasText && (
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
            disabled={!hasText || isImproving || !hasEnoughCreditsForImprovement}
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
            onClick={handleGenerate}
            disabled={!hasText || !hasEnoughCredits}
          >
            Create
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;