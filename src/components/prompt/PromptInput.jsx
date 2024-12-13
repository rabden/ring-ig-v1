import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Sparkles, Loader } from "lucide-react";
import { toast } from "sonner";
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { useUserCredits } from '@/hooks/useUserCredits';

const PromptInput = ({ 
  value = '', 
  onChange, 
  onKeyDown, 
  onGenerate, 
  hasEnoughCredits = true,
  onClear,
  userId
}) => {
  const { isImproving, improveCurrentPrompt } = usePromptImprovement(userId);
  const { credits, bonusCredits } = useUserCredits(userId);
  const totalCredits = (credits || 0) + (bonusCredits || 0);

  const handleGenerate = () => {
    if (!value?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    onGenerate();
  };

  const handleImprove = async () => {
    if (!value?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    await improveCurrentPrompt(value, (improvedPrompt) => {
      onChange({ target: { value: improvedPrompt } });
    });
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
      
      <div className="flex justify-end items-center mt-4 gap-2">
        {value?.length > 0 && (
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
          onClick={handleImprove}
          disabled={!value?.length || isImproving}
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
          disabled={!value?.length}
        >
          Create
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;