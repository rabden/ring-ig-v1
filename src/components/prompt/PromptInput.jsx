import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import { improvePrompt } from '@/utils/promptImprovement';

const PromptInput = ({ 
  value = '', 
  onChange, 
  onKeyDown, 
  onGenerate, 
  hasEnoughCredits, 
  onClear
}) => {
  const [isImproving, setIsImproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!value.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // If improving is enabled, improve the prompt first
      if (isImproving) {
        const toastId = toast.loading('Improving prompt...');
        try {
          const improvedPrompt = await improvePrompt(value);
          toast.success('Prompt improved!', { id: toastId });
          // Generate with the improved prompt
          await onGenerate(improvedPrompt);
        } catch (error) {
          toast.error('Failed to improve prompt', { id: toastId });
          setIsGenerating(false);
          return;
        }
      } else {
        // Generate with original prompt if not improving
        await onGenerate(value);
      }
    } catch (error) {
      toast.error('Failed to process prompt');
      console.error(error);
    } finally {
      setIsGenerating(false);
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
          className="w-full min-h-[360px] md:min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-8 px-4 md:px-6"
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
        <Toggle
          pressed={isImproving}
          onPressedChange={setIsImproving}
          size="sm"
          className={`rounded-full ${isImproving ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Sparkles className="h-4 w-4" />
        </Toggle>
        <Button
          size="sm"
          className="rounded-full"
          onClick={handleGenerate}
          disabled={!value?.length || !hasEnoughCredits || isGenerating}
        >
          Generate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptInput;