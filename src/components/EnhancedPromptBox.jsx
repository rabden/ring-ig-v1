import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, X, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EnhancedPromptBox = ({ 
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
      "relative overflow-hidden transition-all duration-200",
      isFocused ? "ring-2 ring-primary" : "",
      className
    )}>
      <div className="flex items-start p-3 gap-2">
        <div className="flex-grow relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full min-h-[40px] max-h-[200px] resize-none bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-sm"
            rows={1}
          />
        </div>
        
        <div className="flex flex-col gap-2 pt-1">
          {value && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClear}
              className="h-6 w-6"
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            onClick={onSubmit}
            className="h-6 w-6"
            disabled={!value.trim() || disabled}
            type="submit"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {value && (
        <div className="px-3 pb-2 flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 text-xs"
            onClick={() => onChange({ target: { value: value + ", high quality, 8k" } })}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            Enhance Quality
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-6 text-xs"
            onClick={() => onChange({ target: { value: value + ", detailed, sharp focus" } })}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            Add Details
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EnhancedPromptBox;