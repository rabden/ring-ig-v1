import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Wand2 } from "lucide-react";
import { improvePrompt } from '@/utils/promptUtils';
import { toast } from 'sonner';

const PromptInput = ({ value, onChange, onKeyDown, onGenerate, hasEnoughCredits, onClear }) => {
  const [isImproveEnabled, setIsImproveEnabled] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const handleGenerate = async () => {
    if (!value) return;

    try {
      if (isImproveEnabled) {
        setIsImproving(true);
        const improvedPrompt = await improvePrompt(value);
        onChange({ target: { value: improvedPrompt } });
        await onGenerate(improvedPrompt);
      } else {
        await onGenerate(value);
      }
    } catch (error) {
      toast.error("Failed to generate image");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="relative mb-8">
      <div className="relative">
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
          
          <textarea
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="A 4D HDR immersive 3D image..."
            className="w-full min-h-[360px] md:min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-8 px-4"
            style={{ 
              caretColor: 'currentColor',
            }}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          {value.length > 0 && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={onClear}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={isImproveEnabled ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setIsImproveEnabled(!isImproveEnabled)}
                disabled={isImproving}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isImproving ? "Improving..." : "Improve"}
              </Button>
            </>
          )}
          <Button
            size="sm"
            className="rounded-full"
            onClick={handleGenerate}
            disabled={!value.length || !hasEnoughCredits || isImproving}
          >
            Generate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;