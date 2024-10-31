import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, X, Sparkles, Wand2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const NewPromptBox = ({ 
  value, 
  onChange, 
  onSubmit,
  onKeyDown,
  className,
  placeholder = "Describe the image you want to generate...",
  disabled = false
}) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = React.useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleClear = () => {
    onChange({ target: { value: '' } });
    textareaRef.current?.focus();
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 bg-card/50",
      isFocused ? "ring-1 ring-primary" : "",
      className
    )}>
      <div className="relative p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[120px] max-h-[200px] resize-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
          rows={1}
        />
        
        {value && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className="absolute top-3 right-3 h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between p-3 bg-muted/30 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onChange({ target: { value: value + ", masterpiece, high quality, 8k, detailed" } })}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Enhance
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onChange({ target: { value: value + ", sharp focus, intricate details, professional" } })}
          >
            <Wand2 className="h-3.5 w-3.5 mr-1.5" />
            Details
          </Button>
        </div>

        <Button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="h-8"
        >
          <Send className="h-4 w-4 mr-2" />
          Generate
        </Button>
      </div>
    </Card>
  );
};

export default NewPromptBox;