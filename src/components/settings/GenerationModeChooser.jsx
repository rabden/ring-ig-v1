import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Zap, Star } from "lucide-react";

const GenerationModeChooser = ({ generationMode, setGenerationMode }) => {
  const toggleMode = () => {
    setGenerationMode(generationMode === 'fast' ? 'quality' : 'fast');
  };

  const isFast = generationMode === 'fast';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMode}
      className={cn(
        "h-7 px-2 rounded-lg text-[11px] gap-1",
        "transition-all duration-200",
        isFast ? (
          "bg-primary/80 hover:bg-primary/70"
        ) : (
          "bg-primary/80 hover:bg-primary/70"
        )
      )}
    >
      {isFast ? (
        <>
          <Zap className="h-3 w-3 text-primary-foreground" />
          <span className="text-primary-foreground">Fast</span>
        </>
      ) : (
        <>
          <Star className="h-3 w-3 text-primary-foreground" />
          <span className="text-primary-foreground">Quality</span>
        </>
      )}
    </Button>
  );
};

export default GenerationModeChooser; 