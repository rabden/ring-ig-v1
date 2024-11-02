import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useImageViewHandlers } from './image-view/ImageViewHandlers';
import { Copy, Share2, Check } from "lucide-react";
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";
import DesktopSingleImageView from './image-view/DesktopSingleImageView';
import MobileSingleImageView from './image-view/MobileSingleImageView';

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

  const { handleDownload, handleRemix } = useImageViewHandlers(image, session, navigate);

  const handleCopyPromptWithIcon = async () => {
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

  const handleShareWithIcon = async () => {
    const shareUrl = window.location.href;
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

  const sharedProps = {
    image,
    session,
    modelConfigs,
    styleConfigs,
    copyPromptIcon,
    copyShareIcon,
    handleBack,
    handleCopyPromptWithIcon,
    handleShareWithIcon,
    handleDownload,
    handleRemix
  };

  return (
    <>
      <div className="hidden md:block">
        <DesktopSingleImageView {...sharedProps} />
      </div>
      <div className="md:hidden">
        <MobileSingleImageView {...sharedProps} />
      </div>
    </>
  );
};

export default SingleImageView;