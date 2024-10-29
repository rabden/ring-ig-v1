import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from 'sonner';

const ImagePrompt = ({ prompt }) => {
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Prompt</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={handleCopyPrompt}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
      <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
        {prompt}
      </p>
    </div>
  );
};

export default ImagePrompt;