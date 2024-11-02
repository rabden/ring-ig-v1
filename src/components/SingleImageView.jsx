import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageViewHandlers } from './image-view/ImageViewHandlers';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw, Copy, Share2, Check } from "lucide-react";

const SingleImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const [copyPromptIcon, setCopyPromptIcon] = useState(<Copy className="h-4 w-4" />);
  const [copyShareIcon, setCopyShareIcon] = useState(<Share2 className="h-4 w-4" />);

  const handleBack = () => {
    if (!session) {
      window.location.href = 'https://ring-ig.gptengineer.run';
    } else {
      navigate(-1);
    }
  };

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

  const { handleDownload, handleRemix, handleCopyPrompt, handleShare } = useImageViewHandlers(image, session, navigate);

  const handleCopyPromptWithIcon = async () => {
    await handleCopyPrompt();
    setCopyPromptIcon(<Check className="h-4 w-4" />);
    setTimeout(() => {
      setCopyPromptIcon(<Copy className="h-4 w-4" />);
    }, 2000);
  };

  const handleShareWithIcon = async () => {
    await handleShare();
    setCopyShareIcon(<Check className="h-4 w-4" />);
    setTimeout(() => {
      setCopyShareIcon(<Share2 className="h-4 w-4" />);
    }, 2000);
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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="flex-1 relative flex items-center justify-center bg-black/10 dark:bg-black/30 h-[50vh] md:h-screen">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 md:hidden" 
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <img
          src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
          alt={image.prompt}
          className="max-w-full max-h-[calc(100vh-64px)] md:max-h-screen object-contain"
        />
      </div>

      <div className="w-full md:w-[350px] bg-card text-card-foreground border-l">
        <ScrollArea className="h-[50vh] md:h-screen">
          <div className="p-6 space-y-6">
            <Button 
              variant="ghost" 
              className="hidden md:flex mb-4" 
              onClick={handleBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Image Details</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopyPromptWithIcon}>
                    {copyPromptIcon}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleShareWithIcon}>
                    {copyShareIcon}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                {image.prompt}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Settings</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Model:</div>
                <div className="text-muted-foreground">
                  {modelConfigs?.[image.model]?.name || image.model}
                </div>
                <div>Quality:</div>
                <div className="text-muted-foreground">{image.quality}</div>
                <div>Size:</div>
                <div className="text-muted-foreground">
                  {image.width}x{image.height}
                </div>
                <div>Style:</div>
                <div className="text-muted-foreground">
                  {styleConfigs?.[image.style]?.name || "General"}
                </div>
              </div>
            </div>

            {session && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={handleDownload} className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handleRemix} className="w-full" variant="outline">
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
};

export default SingleImageView;