import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Sparkles, Loader } from "lucide-react";
import { toast } from "sonner";
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { cn } from "@/lib/utils";

const PromptInput = ({ 
  prompt = '',
  onChange,
  onKeyDown,
  onSubmit,
  hasEnoughCredits = true,
  onClear,
  onImprove,
  isImproving,
  credits,
  bonusCredits,
  userId
}) => {
  const totalCredits = (credits || 0) + (bonusCredits || 0);
  const hasEnoughCreditsForImprovement = totalCredits >= 1;

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
      await onImprove();
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

    if (!userId) {
      toast.error('Please sign in to generate images');
      return;
    }

    if (!hasEnoughCredits) {
      toast.error('Not enough credits');
      return;
    }

    try {
      onClear(); // Clear prompt immediately when generation starts
      await onSubmit();
    } catch (error) {
      console.error('Error generating:', error);
      toast.error('Failed to generate image');
    }
  };

  return (
    <div className="relative mb-8">
      <div className="relative bg-card/95 backdrop-blur-[2px] border border-border/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-card/95 to-transparent pointer-events-none z-10 rounded-t-2xl" />
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card/95 to-transparent pointer-events-none z-10 rounded-b-2xl" />
        
        <textarea
          value={prompt}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="A 4D HDR immersive 3D image..."
          className={cn(
            "w-full resize-none bg-transparent text-base focus:outline-none",
            "placeholder:text-muted-foreground/40 overflow-y-auto scrollbar-none",
            "border-y border-border/5 py-6 px-4",
            "min-h-[450px] md:min-h-[180px]",
            "transition-colors duration-200"
          )}
          style={{ 
            caretColor: 'currentColor',
          }}
        />
      </div>
      
      <div className="flex justify-end items-center mt-4 gap-2">
        {prompt?.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-xl hover:bg-accent/10"
            onClick={onClear}
          >
            <X className="h-4 w-4 text-foreground/70" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-xl bg-background/50 hover:bg-accent/10 transition-all duration-200"
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
          disabled={!prompt?.length || !hasEnoughCredits || !userId}
        >
          <span className="text-sm">Create</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;