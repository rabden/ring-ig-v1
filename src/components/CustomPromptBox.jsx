import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, X } from "lucide-react";

const CustomPromptBox = ({ value, onChange, onKeyDown, onGenerate }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleClear = () => {
    onChange({ target: { value: '' } });
    if (textareaRef.current) {
      textareaRef.current.style.height = '45px';
    }
  };

  return (
    <Card className="relative border-0 bg-muted/40">
      <div className="relative min-h-[45px] max-h-[250px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Enter your prompt here"
          className="w-full min-h-[45px] resize-none bg-transparent p-3 pb-14 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          style={{ overflow: 'hidden' }}
        />
        {value && (
          <div className="absolute left-0 right-0 bottom-0 flex items-center justify-end gap-2 p-2 bg-background/80 backdrop-blur-sm border-t border-border/50">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-muted shrink-0"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onGenerate}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CustomPromptBox;