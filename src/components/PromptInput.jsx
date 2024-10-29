import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const PromptInput = ({ value, onChange, onKeyDown, onGenerate }) => {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onGenerate();
      }
    } else {
      onKeyDown?.(e);
    }
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Describe your image... (Press Enter to generate)"
        className="pr-12 min-h-[100px] resize-none"
      />
      <Button
        size="icon"
        className="absolute right-2 bottom-2 h-8 w-8"
        onClick={onGenerate}
        disabled={!value.trim()}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PromptInput;