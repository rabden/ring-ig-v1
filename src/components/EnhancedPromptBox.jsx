import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const EnhancedPromptBox = ({ value, onChange, onKeyDown, onGenerate }) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = React.useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 300) + 'px';
    }
  }, [value]);

  const handleClear = () => {
    onChange({ target: { value: '' } });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="relative rounded-lg bg-secondary/30 p-2 group transition-all duration-200 hover:bg-secondary/40">
      <ScrollArea className="relative w-full max-h-[300px] mb-10">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your imagination here..."
          className={cn(
            "w-full min-h-[80px] resize-none bg-transparent px-3 py-2 text-sm",
            "placeholder:text-muted-foreground/70",
            "focus:outline-none",
            "scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent"
          )}
          style={{ overflow: 'hidden' }}
        />
      </ScrollArea>
      
      <div className="absolute left-0 right-0 bottom-2 flex items-center justify-end px-2 bg-transparent">
        {value && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className="h-8 w-8 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="icon"
          onClick={onGenerate}
          className={cn(
            "h-8 w-8 transition-all duration-200",
            !value && "opacity-50 cursor-not-allowed"
          )}
          disabled={!value}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedPromptBox;