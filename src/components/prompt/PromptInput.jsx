import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Sparkles, Loader } from "lucide-react";
import { toast } from "sonner";
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { cn } from "@/lib/utils";
import GenerationModeChooser from '@/components/settings/GenerationModeChooser';

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
  userId,
  generationMode,
  setGenerationMode
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
      <div className="relative bg-background transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background/95 to-transparent pointer-events-none z-10 rounded-t-2xl" />
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background/95 to-transparent pointer-events-none z-10 rounded-b-2xl" />
        
        <textarea
          value={prompt}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="A 4D HDR immersive 3D image..."
          className={cn(
            "w-full resize-none bg-transparent text-base focus:outline-none",
            "placeholder:text-muted-foreground/40 overflow-y-auto scrollbar-none",
            "py-6 px-1",
            "min-h-[450px] md:min-h-[350px]",
            "transition-colors duration-200"
          )}
          style={{ 
            caretColor: 'currentColor',
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <GenerationModeChooser 
          generationMode={generationMode} 
          setGenerationMode={setGenerationMode} 
        />
        <div className="flex items-center gap-2">
          {prompt?.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 rounded-xl hover:bg-accent/10"
              onClick={onClear}
            >
              <X className="h-3.5 w-3.5 text-foreground/70" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-7 rounded-xl bg-background/50 hover:bg-accent/10 transition-all duration-200"
            onClick={handleImprovePrompt}
            disabled={!prompt?.length || isImproving || !hasEnoughCreditsForImprovement}
          >
            {isImproving ? (
              <Loader className="h-3.5 w-3.5 mr-1.5 animate-spin text-foreground/70" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-foreground/70" />
            )}
            <span className="text-xs">Improve</span>
          </Button>
          <Button
            size="sm"
            className="h-7 rounded-xl bg-primary/90 hover:bg-primary/80 transition-all duration-200"
            onClick={handleSubmit}
            disabled={!prompt?.length || !hasEnoughCredits || !userId}
          >
            <span className="text-xs">Create</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;