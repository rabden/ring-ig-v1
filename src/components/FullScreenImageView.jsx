import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Sparkles, Share2, Copy } from 'lucide-react';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useImageRemix } from '@/hooks/useImageRemix';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FullScreenImageView = ({ 
  image, 
  isOpen, 
  onClose, 
  onDownload, 
  onDiscard, 
  isOwner
}) => {
  const { data: modelConfigs } = useModelConfigs();
  const { session } = useSupabaseAuth();
  const { handleRemix } = useImageRemix(session);

  // Early return if no image
  if (!image || !isOpen) return null;

  const imageUrl = image.storage_path 
    ? supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl
    : image.image_url;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Share Image',
        text: image.prompt,
        url: window.location.href
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg w-full p-0 gap-0 bg-transparent border-0">
        <Card className="border-0 rounded-none md:rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={imageUrl}
                alt={image.prompt || 'Image'}
                className="w-full h-auto"
              />
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 bg-card">
              {image.prompt && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Prompt</div>
                  <div className="text-sm">{image.prompt}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Model</div>
                  <div className="text-sm">{modelConfigs?.[image.model]?.name || image.model}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Quality</div>
                  <div className="text-sm">{image.quality || 'Standard'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopyPrompt} className="flex-1" variant="ghost" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Prompt
                </Button>
                <Button onClick={() => handleRemix(image)} className="flex-1" variant="ghost" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Remix
                </Button>
                <Button onClick={onDownload} className="flex-1" variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {navigator.share && (
                  <Button onClick={handleShare} className="flex-1" variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenImageView;