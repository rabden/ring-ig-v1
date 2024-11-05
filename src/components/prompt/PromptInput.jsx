import React from 'react';
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

const PromptInput = ({ value, onChange, onKeyDown, onGenerate, hasEnoughCredits, onClear, isPrivate, onPrivateChange }) => {
  const handlePrivateToggle = () => {
    if (typeof onPrivateChange === 'function') {
      onPrivateChange(!isPrivate);
      toast.success(`Image generation set to ${!isPrivate ? 'private' : 'public'}`);
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
            className="w-full min-h-[360px] md:min-h-[180px] resize-none bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/50 overflow-y-auto scrollbar-none border-y border-border/20 py-8 px-4 md:px-6"
            style={{ 
              caretColor: 'currentColor',
            }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button
            size="sm"
            variant={isPrivate ? "default" : "outline"}
            className="rounded-full flex items-center gap-2"
            onClick={handlePrivateToggle}
          >
            {isPrivate ? (
              <>
                <Lock className="h-4 w-4" />
                Private
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Public
              </>
            )}
          </Button>
          
          <div className="flex gap-2">
            {value.length > 0 && (
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
              className="rounded-full"
              onClick={onGenerate}
              disabled={!value.length || !hasEnoughCredits}
            >
              Generate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;