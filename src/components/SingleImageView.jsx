import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Copy, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SingleImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();

  const { data: image, isLoading } = useQuery({
    queryKey: ['singleImage', imageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDownload = () => {
    if (!session) {
      toast.error('Please sign in to download images');
      return;
    }
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${image.prompt.slice(0, 30)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemix = () => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }
    navigate(`/remix/${image.id}`);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast.success('Prompt copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Share link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy share link');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="w-full h-[60vh]" />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center">Image not found</div>
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate('/')}>
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

                {session && (
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
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleImageView;