import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check } from "lucide-react";
import TruncatablePrompt from '../TruncatablePrompt';

const ImagePromptSection = ({ 
  prompt, 
  copyIcon, 
  shareIcon, 
  onCopyPrompt, 
  onShare 
}) => {
  return (
    <div className="rounded-xl bg-muted/5 p-4 transition-all duration-200 hover:bg-muted/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-foreground/90">Prompt</h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCopyPrompt}
            className="h-8 w-8 rounded-xl p-0 hover:bg-accent/10"
          >
            {copyIcon === 'copy' ? 
              <Copy className="h-4 w-4 text-foreground/70" /> : 
              <Check className="h-4 w-4 text-foreground/70" />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onShare}
            className="h-8 w-8 rounded-xl p-0 hover:bg-accent/10"
          >
            {shareIcon === 'share' ? 
              <Share2 className="h-4 w-4 text-foreground/70" /> : 
              <Check className="h-4 w-4 text-foreground/70" />
            }
          </Button>
        </div>
      </div>
      <div className="rounded-lg bg-background/50 p-3 backdrop-blur-[1px]">
        <TruncatablePrompt prompt={prompt} />
      </div>
    </div>
  );
};

export default ImagePromptSection;