import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const EnhancedPromptBox = ({ value, onChange, onKeyDown, onGenerate, className }) => {
  const handleClear = () => {
    onChange({ target: { value: '' } });
  };

  return (
    <div className={cn("relative group", className)}>
      <Textarea
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Enter your prompt here..."
        className="min-h-[100px] pr-24 resize-none focus-visible:ring-offset-0 text-base"
      />
      <div className="absolute right-2 top-2 flex gap-2">
        {value.length > 0 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClear}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={onGenerate}
              className="h-8 w-8"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedPromptBox;