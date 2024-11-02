import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, Copy, Share2, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { toast } from 'sonner';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  isOwner 
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyPromptIcon, setCopyPromptIcon] = useState(<Copy className="h-4 w-4" />);
  const [copyShareIcon, setCopyShareIcon] = useState(<Share2 className="h-4 w-4" />);

  if (!isOpen || !image) {
    return null;
  }

  const handleDownload = () => {
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    onDownload(imageUrl, image.prompt);
  };

  const handleRemix = () => {
    onRemix(image);
    onClose();
  };

  const handleDiscard = () => {
    onDiscard(image);
    onClose();
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      setCopyPromptIcon(<Check className="h-4 w-4" />);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => setCopyPromptIcon(<Copy className="h-4 w-4" />), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = image.prompt;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyPromptIcon(<Check className="h-4 w-4" />);
        toast.success('Prompt copied to clipboard');
        setTimeout(() => setCopyPromptIcon(<Copy className="h-4 w-4" />), 2000);
      } catch (err) {
        toast.error('Failed to copy prompt');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/image/${image.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyShareIcon(<Check className="h-4 w-4" />);
      toast.success('Share link copied to clipboard');
      setTimeout(() => setCopyShareIcon(<Share2 className="h-4 w-4" />), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyShareIcon(<Check className="h-4 w-4" />);
        toast.success('Share link copied to clipboard');
        setTimeout(() => setCopyShareIcon(<Share2 className="h-4 w-4" />), 2000);
      } catch (err) {
        toast.error('Failed to copy share link');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background">
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[100vh] object-contain"
            />
          </div>

          <div className="w-[350px] border-l">
            <ScrollArea className="h-[100vh]">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Image Details</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{image.prompt}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Settings</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Model:</div>
                    <div className="text-muted-foreground">{modelConfigs?.[image.model]?.name || image.model}</div>
                    <div>Quality:</div>
                    <div className="text-muted-foreground">{image.quality}</div>
                    <div>Size:</div>
                    <div className="text-muted-foreground">{image.width}x{image.height}</div>
                    <div>Seed:</div>
                    <div className="text-muted-foreground">{image.seed}</div>
                    <div>Style:</div>
                    <div className="text-muted-foreground">{styleConfigs?.[image.style]?.name || "General"}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={handleDownload}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    {isOwner && (
                      <Button 
                        onClick={handleDiscard}
                        className="w-full"
                        variant="destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Discard
                      </Button>
                    )}
                    <Button 
                      onClick={handleRemix}
                      className="w-full"
                      variant="outline"
                    >
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