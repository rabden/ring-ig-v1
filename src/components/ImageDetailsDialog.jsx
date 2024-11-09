import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Check } from "lucide-react"
import { useStyleConfigs } from '@/hooks/useStyleConfigs'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import TruncatablePrompt from './TruncatablePrompt'
import { getCleanPrompt } from '@/utils/promptUtils'

const ImageDetailsDialog = ({ open, onOpenChange, image }) => {
  const { data: styleConfigs } = useStyleConfigs();
  const { data: modelConfigs } = useModelConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  
  if (!image) return null;

  const detailItems = [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio },
    { label: "Style", value: styleConfigs?.[image.style]?.name || 'General' },
    { label: "Quality", value: image.quality },
  ];

  const handleCopyPrompt = async () => {
    const cleanPrompt = getCleanPrompt(image.user_prompt || image.prompt, image.style);
    await navigator.clipboard.writeText(cleanPrompt);
    setCopyIcon('check');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Image Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[calc(80vh-100px)]">
          <div className="space-y-8 px-1">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Prompt</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPrompt}>
                    {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                    {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <TruncatablePrompt prompt={getCleanPrompt(image.user_prompt || image.prompt, image.style)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {detailItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetailsDialog;