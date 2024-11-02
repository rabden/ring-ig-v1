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
import { ArrowLeft, Copy, Share2, Check } from "lucide-react";
import { toast } from 'sonner';
import ImageDetails from './image-view/ImageDetails';
import ImageSettings from './image-view/ImageSettings';
import ImageActions from './image-view/ImageActions';

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
    try {
      await handleCopyPrompt();
      setCopyPromptIcon(<Check className="h-4 w-4" />);
      toast.success('Prompt copied to clipboard');
      setTimeout(() => {
        setCopyPromptIcon(<Copy className="h-4 w-4" />);
      }, 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = image.prompt;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyPromptIcon(<Check className="h-4 w-4" />);
        toast.success('Prompt copied to clipboard');
        setTimeout(() => {
          setCopyPromptIcon(<Copy className="h-4 w-4" />);
        }, 2000);
      } catch (err) {
        toast.error('Failed to copy prompt');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShareWithIcon = async () => {
    try {
      await handleShare();
      setCopyShareIcon(<Check className="h-4 w-4" />);
      toast.success('Share link copied to clipboard');
      setTimeout(() => {
        setCopyShareIcon(<Share2 className="h-4 w-4" />);
      }, 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyShareIcon(<Check className="h-4 w-4" />);
        toast.success('Share link copied to clipboard');
        setTimeout(() => {
          setCopyShareIcon(<Share2 className="h-4 w-4" />);
        }, 2000);
      } catch (err) {
        toast.error('Failed to copy share link');
      }
      document.body.removeChild(textArea);
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
    <div className="min-h-screen bg-background">
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-10" 
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="relative">
          <img
            src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
            alt={image.prompt}
            className="w-full h-auto"
          />
        </div>
        <div className="px-4">
          <ScrollArea className="h-[calc(100vh-50vh)] mt-4">
            <div className="space-y-6 pb-8">
              {session && (
                <ImageActions 
                  handleDownload={handleDownload}
                  handleRemix={handleRemix}
                />
              )}
              <ImageDetails 
                image={image}
                copyPromptIcon={copyPromptIcon}
                copyShareIcon={copyShareIcon}
                handleCopyPromptWithIcon={handleCopyPromptWithIcon}
                handleShareWithIcon={handleShareWithIcon}
              />
              <ImageSettings 
                modelConfigs={modelConfigs}
                styleConfigs={styleConfigs}
                image={image}
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="hidden md:flex min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <Button variant="ghost" className="mb-4" onClick={handleBack}>
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
                <ImageDetails 
                  image={image}
                  copyPromptIcon={copyPromptIcon}
                  copyShareIcon={copyShareIcon}
                  handleCopyPromptWithIcon={handleCopyPromptWithIcon}
                  handleShareWithIcon={handleShareWithIcon}
                />
                <ImageSettings 
                  modelConfigs={modelConfigs}
                  styleConfigs={styleConfigs}
                  image={image}
                />
                {session && (
                  <ImageActions 
                    handleDownload={handleDownload}
                    handleRemix={handleRemix}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleImageView;
