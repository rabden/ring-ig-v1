import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, RefreshCw, ArrowLeft, Copy, Share2, Check, Wand2 } from "lucide-react";
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useLikes } from '@/hooks/useLikes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ImagePromptSection from './image-view/ImagePromptSection';
import ImageDetailsSection from './image-view/ImageDetailsSection';
import { handleImageDiscard } from '@/utils/discardUtils';
import { useImageRemix } from '@/hooks/useImageRemix';
import HeartAnimation from './animations/HeartAnimation';
import ImageOwnerHeader from './image-view/ImageOwnerHeader';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "min-h-screen bg-background",
        "transition-colors duration-300"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-4 left-4 z-50"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className={cn(
            "bg-background/80 backdrop-blur-sm",
            "hover:bg-background/90",
            "transition-all duration-200"
          )}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      <ScrollArea className={isMobile ? "h-[100dvh]" : "h-screen"}>
        <div className="space-y-6 pb-6">
          {image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative flex items-center justify-center",
                "bg-black/10 dark:bg-black/30",
                "transition-colors duration-300"
              )}
            >
              <img
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt || 'Generated image'}
                className={cn(
                  "w-full h-auto",
                  "transition-transform duration-300",
                  "hover:scale-[1.02]"
                )}
                onDoubleClick={handleDoubleClick}
                loading="eager"
              />
              <HeartAnimation isAnimating={isAnimating} />
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="px-4"
          >
            {session && (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ImageOwnerHeader 
                    owner={owner}
                    image={image}
                    isOwner={isOwner}
                    userLikes={userLikes}
                    toggleLike={toggleLike}
                    likeCount={likeCount}
                  />
                  
                  <div className={cn(
                    "flex gap-1 justify-between mb-6 mt-6",
                    "transition-all duration-200"
                  )}>
                    <Button 
                      variant="ghost" 
                      size="xs" 
                      className={cn(
                        "flex-1 h-8 text-xs",
                        "transition-all duration-200",
                        "hover:bg-accent/20"
                      )} 
                      onClick={onDownload}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    {isOwner && (
                      <Button 
                        variant="ghost" 
                        size="xs" 
                        className={cn(
                          "flex-1 h-8 text-xs",
                          "text-destructive hover:text-destructive",
                          "hover:bg-destructive/10",
                          "transition-all duration-200"
                        )} 
                        onClick={handleDiscardImage}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Discard
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="xs" 
                      className={cn(
                        "flex-1 h-8 text-xs",
                        "transition-all duration-200",
                        "hover:bg-accent/20"
                      )} 
                      onClick={handleRemixClick}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Remix
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ImagePromptSection 
                prompt={image.user_prompt || image.prompt}
                copyIcon={copyIcon}
                shareIcon={shareIcon}
                onCopyPrompt={handleCopyPrompt}
                onShare={handleShare}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <ImageDetailsSection detailItems={detailItems} />
            </motion.div>
          </motion.div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default MobileImageView;