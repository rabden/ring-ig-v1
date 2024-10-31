import React, { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

const EnhancedPromptBox = ({ 
  value, 
  onChange,
  onSubmit,
  onKeyDown,
  className,
  placeholder = "Request a change...",
  disabled = false
}) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const updateLayout = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    updateLayout();
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
    onKeyDown?.(e);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="max-w-[900px] mx-auto">
        <div 
          className={cn(
            "bg-card border-border",
            "border rounded-lg p-3",
            "min-h-[48px] max-h-[300px]",
            "transition-all duration-200 ease-out",
            "flex flex-col gap-2",
            (isFocused || value) && "min-h-[24px]",
            className
          )}
        >
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full bg-transparent border-0 outline-none resize-none p-0 m-0",
                "text-sm leading-relaxed placeholder:text-muted-foreground",
                "scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent"
              )}
              style={{ height: '24px' }}
            />
          </div>
          
          <div 
            className={cn(
              "flex justify-end h-6 transition-all duration-200",
              value ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}
          >
            <button
              onClick={onSubmit}
              disabled={!value.trim() || disabled}
              className={cn(
                "flex items-center justify-center w-8 h-6",
                "bg-transparent border-none cursor-pointer p-0",
                "opacity-70 hover:opacity-100 transition-opacity",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPromptBox;