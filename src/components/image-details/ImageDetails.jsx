import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Check } from "lucide-react";
import { toast } from 'sonner';

const ImageDetails = ({ 
  image, 
  modelConfigs, 
  styleConfigs,
  showTitle = true,
  className = ""
}) => {
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.prompt);
    setCopyIcon('check');
    toast.success('Prompt copied to clipboard');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    toast.success('Share link copied to clipboard');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs?.[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        {showTitle && (
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Image Details</h3>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">Prompt</h4>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
              {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
          {image.prompt}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {detailItems.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <Badge variant="outline" className="text-xs sm:text-sm font-normal">
              {item.value}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDetails;