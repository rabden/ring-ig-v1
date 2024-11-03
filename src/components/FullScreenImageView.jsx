import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, Copy, Share2, Check, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { toast } from 'sonner';
import { downloadImage } from '@/utils/downloadUtils';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDiscard,
  onRemix,
  isOwner 
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  
  if (!isOpen || !image) {
    return null;
  }

  const imageSrc = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;

  const handleDownload = async () => {
    try {
      await downloadImage(imageSrc, image.prompt);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

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
    { label: "Aspect Ratio", value: image.aspect_ratio || "1:1" },
    { label: "Quality", value: image.quality },
    { label: "Style", value: styleConfigs?.[image.style]?.name || 'General' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 top-4 z-50" 
          onClick={onClose}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30">
            <img
              src={imageSrc}
              alt={image.prompt}
              className="max-w-full max-h-[100vh] object-contain"
            />
          </div>

          <div className="w-[350px] h-[calc(100vh-2rem)] my-4 mr-4 rounded-lg border bg-background">
            <ScrollArea className="h-full scrollbar-custom">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Image Details</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handleCopyPrompt}>
                        {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleShare}>
                        {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{image.prompt}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Settings</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {detailItems.map((item, index) => (
                      <React.Fragment key={index}>
                        <div>{item.label}:</div>
                        <div className="text-muted-foreground">{item.value}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button onClick={handleDownload} className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    {isOwner && (
                      <Button onClick={onDiscard} className="w-full" variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                    )}
                    <Button onClick={onRemix} className="w-full" variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Remix
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;