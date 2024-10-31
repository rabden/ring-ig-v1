import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, X, Wand2 } from "lucide-react";

const EnhancedPromptBox = ({ value, onChange, onKeyDown, onGenerate, onClear }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [value]);

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your imagination here..."
          className="min-h-[80px] resize-none pr-24 text-base leading-relaxed scrollbar-thin scrollbar-thumb-muted-foreground/20"
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          {value && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {value && (
            <Button
              size="icon"
              onClick={onGenerate}
              className="h-8 w-8 rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {value && (
        <ScrollArea className="h-20 rounded-md border">
          <div className="p-4">
            <p className="text-sm text-muted-foreground">{value}</p>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default EnhancedPromptBox;