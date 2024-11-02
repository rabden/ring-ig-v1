import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw, Copy, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { Drawer } from 'vaul';
import { Badge } from "@/components/ui/badge";

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

  const handleDownload = async () => {
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
    navigate('/', { state: { remixImage: image } });
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

  const MobileView = () => (
    <Drawer.Root defaultOpen>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background fixed inset-x-0 bottom-0 rounded-t-[10px]">
          <div className="h-full max-h-[96vh] overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 my-4" />
            <ScrollArea className="h-[calc(96vh-32px)] px-4 pb-8">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt}
                  className="w-full h-auto"
                />
              </div>
              
              {session && (
                <div className="flex gap-2 justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={handleRemix}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Remix
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Prompt</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md break-words">
                    {image.prompt}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {modelConfigs?.[image.model]?.name || image.model}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Style</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {styleConfigs?.[image.style]?.name || "General"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Size</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {image.width}x{image.height}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Quality</p>
                    <Badge variant="outline" className="text-xs sm:text-sm font-normal">
                      {image.quality}
                    </Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );

  const DesktopView = () => (
    <div className="container mx-auto p-4">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="relative bg-black/10 dark:bg-black/30 rounded-lg overflow-hidden">
          <img
            src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
            alt={image.prompt}
            className="w-full h-auto object-contain"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 p-4">
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
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="md:block hidden">
        <DesktopView />
      </div>
      <div className="md:hidden block">
        <MobileView />
      </div>
    </div>
  );
};

export default SingleImageView;