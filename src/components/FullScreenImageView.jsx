import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { Button } from "@/components/ui/button";
import { Download, Trash2, RefreshCw, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { cn } from "@/lib/utils";

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
  const [copyIcon, setCopyIcon] = useState('copy');
  const [shareIcon, setShareIcon] = useState('share');
  const [isAnimating, setIsAnimating] = useState(false);
  const { userLikes, toggleLike } = useLikes(session?.user?.id);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { handleRemix } = useImageRemix(session, onRemix, onClose);

  const { data: owner } = useQuery({
    queryKey: ['user', image?.user_id],
    queryFn: async () => {
      if (!image?.user_id) return null;
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
      if (!image?.id) return 0;
      const { count } = await supabase
        .from('user_image_likes')
        .select('*', { count: 'exact' })
        .eq('image_id', image.id);
      return count || 0;
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

  const handleDiscard = async () => {
    try {
      await handleImageDiscard(image, queryClient);
      onClose();
    } catch (error) {
      console.error('Error in handleDiscard:', error);
    }
  };

  const handleRemixClick = () => {
    if (!session) {
      toast.error('Please sign in to remix images');
      return;
    }
    navigate(`/?remix=${image.id}#myimages`, { replace: true });
  };

  const detailItems = image ? [
    { label: "Model", value: modelConfigs?.[image.model]?.name || image.model },
    { label: "Seed", value: image.seed },
    { label: "Size", value: `${image.width}x${image.height}` },
    { label: "Aspect Ratio", value: image.aspect_ratio || "1:1" },
    { label: "Quality", value: image.quality },
    { label: "Created", value: format(new Date(image.created_at), 'MMM d, yyyy h:mm a') }
  ] : [];

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userLikes?.includes(image?.id)) {
      setIsAnimating(true);
      toggleLike(image?.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800);
    }
  };

  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] p-0",
        "bg-background/95 backdrop-blur-[2px]",
        "data-[state=open]:duration-0 [&>button]:hidden"
      )}>
        <div className="absolute left-4 top-4 z-50">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className={cn(
              "h-8 w-8 p-0 rounded-lg",
              "bg-background/80 backdrop-blur-[2px]",
              "hover:bg-background/90",
              "transition-all duration-200"
            )}
          >
            <ArrowLeft className="h-5 w-5 text-foreground/70" />
          </Button>
        </div>
        
        <div className="flex h-full">
          <div className="flex-1 relative flex items-center justify-center bg-background/95 backdrop-blur-[2px]">
            <img
              src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
              alt={image.prompt}
              className={cn(
                "max-w-full max-h-[calc(100vh-2rem)]",
                "object-contain rounded-lg",
                "transition-all duration-300"
              )}
              onDoubleClick={handleDoubleClick}
            />
            <HeartAnimation isAnimating={isAnimating} />
          </div>

          <div className="w-[350px] p-3">
            <div className={cn(
              "h-[calc(100vh-24px)] rounded-lg",
              "border border-border/80 bg-card/95",
              "backdrop-blur-[2px]",
              "shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            )}>
              <ScrollArea className="h-full">
                <div className="p-3 space-y-4">
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

                      <div className="flex gap-1.5">
                        {isOwner && (
                          <Button 
                            onClick={handleDiscard} 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              "flex-1 h-9 rounded-md text-xs",
                              "bg-destructive/5 hover:bg-destructive/10",
                              "text-destructive/90 hover:text-destructive",
                              "transition-all duration-200"
                            )}
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            <span>Discard</span>
                          </Button>
                        )}
                        <Button 
                          onClick={onDownload} 
                          variant="ghost" 
                          size="sm"
                          className={cn(
                            "flex-1 h-9 rounded-lg text-xs",
                            "bg-muted/5 hover:bg-muted/50",
                            "transition-all duration-200"
                          )}
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5 text-foreground/70" />
                          <span>Download</span>
                        </Button>
                        <Button 
                          onClick={handleRemixClick} 
                          variant="ghost" 
                          size="sm"
                          className={cn(
                            "flex-1 h-9 rounded-lg text-xs",
                            "bg-muted/5 hover:bg-muted/50",
                            "transition-all duration-200"
                          )}
                        >
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-foreground/70" />
                          <span>Remix</span>
                        </Button>
                      </div>
                    </>
                  )}

                  <ImagePromptSection 
                    prompt={image.user_prompt || image.prompt}
                    copyIcon={copyIcon}
                    shareIcon={shareIcon}
                    onCopyPrompt={handleCopyPrompt}
                    onShare={handleShare}
                  />

                  <ImageDetailsSection detailItems={detailItems} />
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