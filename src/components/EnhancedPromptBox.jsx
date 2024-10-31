import React, { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowRight, X, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

const EnhancedPromptBox = ({ value, onChange, onSubmit, onClear, className }) => {
  const textareaRef = useRef(null)
  const [isFocused, setIsFocused] = React.useState(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px'
    }
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className={cn("relative rounded-lg border bg-background", className)}>
      <ScrollArea className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe the image you want to create..."
          className="w-full min-h-[80px] max-h-[200px] resize-none p-4 pr-24 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-sm"
        />
      </ScrollArea>
      
      <div className="absolute right-2 bottom-2 flex items-center gap-2">
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          onClick={onSubmit}
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={!value.trim()}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute left-2 bottom-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <Wand2 className="h-3 w-3 mr-1" />
          Suggestions
        </Button>
      </div>
    </div>
  )
}

export default EnhancedPromptBox