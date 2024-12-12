import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, Wand2, Copy, Share2, Check, ArrowLeft } from "lucide-react";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import TruncatablePrompt from './TruncatablePrompt';
import { handleImageDiscard } from '@/utils/discardUtils';
import { useImageRemix } from '@/hooks/useImageRemix';
import ImageDetailsSection from './image-view/ImageDetailsSection';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import HeartAnimation from './animations/HeartAnimation';
import { useLikes } from '@/hooks/useLikes';
import ImageOwnerHeader from './image-view/ImageOwnerHeader';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const MobileImageView = ({ 
  image, 
  isOpen, 
  onClose,
  onDownload,
  onDiscard,
  onRemix,
  isOwner,
  isPro = false
}) => {
  const { session } = useSupabaseAuth();
  const { data: modelConfigs } = useModelConfigs();
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { handleRemix } = useImageRemix(session, onRemix, onClose, isPro);
  const queryClient = useQueryClient();
  const { userLikes, toggleLike } = useLikes(session?.user?.id);

  const getImageUrl = () => {
    if (!image?.storage_path) return null;
    try {
      const { data } = supabase.storage.from('user-images').getPublicUrl(image.storage_path);
      return data?.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  const imageUrl = getImageUrl();

  const { data: owner } = useQuery({
    queryKey: ['user', image?.user_id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', image.user_id)
        .single();
      return data;
    },
    enabled: !!image?.user_id
  });

  const { data: likeCount = 0 } = useQuery({
    queryKey: ['likes', image?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('image_id', image.id);
      return count;
    },
    enabled: !!image?.id
  });

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(image.user_prompt || image.prompt);
    setCopyIcon('check');
    setTimeout(() => setCopyIcon('copy'), 1500);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/image/${image.id}`);
    setShareIcon('check');
    setTimeout(() => setShareIcon('share'), 1500);
  };

  const handleDiscardImage = async () => {
    try {
      await handleImageDiscard(image, queryClient);
      onClose();
      if (onDiscard) {
        onDiscard(image.id);
      }
    } catch (error) {
      console.error('Error in handleDiscard:', error);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userLikes?.includes(image.id)) {
      setIsAnimating(true);
      toggleLike(image.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  const handleRemixClick = () => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }
    navigate(`/?remix=${image.id}#imagegenerate`, { replace: true });
  };

  const detailItems = [
    { label: 'Model', value: modelConfigs?.[image.model]?.name || image.model },
    { label: 'Size', value: `${image.width}x${image.height}` },
    { label: 'Quality', value: image.quality },
    { label: 'Seed', value: image.seed },
    { label: 'Aspect Ratio', value: image.aspect_ratio },
    { label: 'Created', value: format(new Date(image.created_at), 'MMM d, yyyy h:mm a') }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <ScrollArea className="h-screen">
        <div className="p-4 space-y-6 pt-16">
          {isOpen && imageUrl && (
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img
                src={imageUrl}
                alt={image.prompt || 'Generated image'}
                className="w-full h-auto"
                onDoubleClick={handleDoubleClick}
                loading="eager"
                onError={() => {
                  setImageError(true);
                  toast.error('Failed to load image');
                }}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-sm">
                  <p className="text-muted-foreground">Failed to load image</p>
                </div>
              )}
              <HeartAnimation isAnimating={isAnimating} />
            </div>
          )}

          {session && (
            <>
              <ImageOwnerHeader 
                owner={owner}
                image={image}
                isOwner={isOwner}
                userLikes={userLikes}
                toggleLike={toggleLike}
                likeCount={likeCount}
              />
              
              <div className="flex gap-1 justify-between mb-6">
                <Button variant="ghost" size="xs" className="flex-1 h-8 text-xs" onClick={onDownload}>
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                {isOwner && (
                  <Button variant="ghost" size="xs" className="flex-1 h-8 text-xs text-destructive hover:text-destructive" onClick={handleDiscardImage}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Discard
                  </Button>
                )}
                <Button variant="ghost" size="xs" className="flex-1 h-8 text-xs" onClick={handleRemixClick}>
                  <Wand2 className="mr-1 h-3 w-3" />
                  Remix
                </Button>
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Prompt</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleCopyPrompt}>
                  {copyIcon === 'copy' ? <Copy className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  {shareIcon === 'share' ? <Share2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <TruncatablePrompt prompt={image.user_prompt || image.prompt} />
          </div>

          <div className="mt-4">
            <ImageDetailsSection detailItems={detailItems} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MobileImageView;