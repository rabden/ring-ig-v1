import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, RefreshCw, Copy, Share2, Check, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { toast } from 'sonner';
import { downloadImage } from '@/utils/downloadUtils';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  isOwner,
  setStyle,
  setActiveTab 
}) => {
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  
  if (!isOpen || !image) {
    return null;
  }

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.user_prompt || image.prompt);
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

  const handleDownload = async () => {
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.user_prompt || image.prompt);
  };

  const handleRemixClick = () => {
    onRemix(image);
    setStyle(image.style);
    setActiveTab('input');
    onClose();
  };

  const handleDiscard = async () => {
    if (!image?.id) {
      toast.error('Cannot delete image: Invalid image ID');
      return;
    }
    try {
      await onDiscard(image);
      toast.success('Image deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete image');
      console.error('Error deleting image:', error);
    }
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
      <DialogContent 
        className="max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0 bg-background data-[state=open]:duration-0 [&>button]:hidden" 
        hideCloseButton
      >
        <div className="absolute left-4 top-4 z-50">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className="max-w-full max-h-[100vh] object-contain"
            />
          </div>

          <div className="w-[350px] p-4">
            <div className="bg-card h-[calc(100vh-32px)] rounded-lg border shadow-sm">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Prompt</h3>
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
                      {image.user_prompt || image.prompt}
                    </p>
                  </div>

                  {session && (
                    <div className="flex gap-2 justify-between">
                      <Button onClick={handleDownload} className="flex-1" variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      {isOwner && (
                        <Button onClick={handleDiscard} className="flex-1 text-destructive hover:text-destructive" variant="ghost" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Discard
                        </Button>
                      )}
                      <Button onClick={handleRemixClick} className="flex-1" variant="ghost" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Remix
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {detailItems.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <Badge variant="secondary" className="text-xs sm:text-sm font-normal w-full justify-center">
                          {item.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;