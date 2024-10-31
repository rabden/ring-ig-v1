import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, X } from "lucide-react";

const CustomPromptBox = ({ value, onChange, onKeyDown, onGenerate }) => {
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
  };

  return (
    <Card className="relative border-0 bg-muted/40">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Enter your prompt here"
        className="w-full min-h-[45px] max-h-[200px] resize-none bg-transparent p-3 pb-12 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        rows={1}
      />
      {value && (
        <div className="absolute left-0 right-0 bottom-0 flex items-center justify-end gap-2 p-2 bg-transparent">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 hover:bg-muted"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-7 w-7"
            onClick={onGenerate}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CustomPromptBox;