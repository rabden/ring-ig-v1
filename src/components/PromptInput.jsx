import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PromptInput = ({ value, onChange, onKeyDown, onGenerate }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 300)}px`;
    }
  }, [value]);

  const showButton = isFocused || value.length > 0;
  const isButtonEnabled = value.trim().length > 0;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isButtonEnabled) {
        onGenerate();
      }
    } else {
      onKeyDown?.(e);
    }
  };

  return (
    <div className="relative group">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Describe your image..."
        className="w-full min-h-[56px] max-h-[300px] resize-none overflow-y-auto bg-background rounded-md border border-input px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12 transition-all duration-200 ease-in-out scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500"
        rows={1}
      />
      <Button
        size="icon"
        className={`absolute right-3 bottom-3 h-8 w-8 transition-all duration-200 ${
          showButton ? 'opacity-100' : 'opacity-0'
        } ${isButtonEnabled ? '' : 'cursor-not-allowed opacity-50'}`}
        onClick={onGenerate}
        disabled={!isButtonEnabled}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PromptInput;