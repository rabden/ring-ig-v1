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
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Prompt</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCopyPrompt}>
            {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onShare}>
            {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <TruncatablePrompt prompt={prompt} />
    </div>
  );
};

export default ImagePromptSection;