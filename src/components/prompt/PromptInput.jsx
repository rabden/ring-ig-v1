import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Sparkles, Loader } from "lucide-react";
import { toast } from "sonner";

const PromptInput = ({ 
  value = '', 
  onChange, 
  onKeyDown, 
  onGenerate, 
  hasEnoughCredits = true,
  onClear,
  onImprove,
  isImproving,
  userId
}) => {
  const hasText = value && value.trim().length > 0;

  const handleGenerate = async () => {
    if (!hasText) {
      toast.error('Please enter a prompt');
      return;
    }
    await onGenerate();
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
          onClick={onImprove}
          disabled={!hasText || isImproving}
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
  );
};

export default PromptInput;