import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { downloadImage } from '@/utils/downloadUtils';
import MobileImageView from '@/components/MobileImageView';
import FullScreenImageView from '@/components/FullScreenImageView';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SingleImageView = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data: image, isLoading, error } = useQuery({
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
    if (!image) return;
    const imageUrl = supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl;
    await downloadImage(imageUrl, image.prompt);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "min-h-screen bg-background p-4",
          "transition-colors duration-300"
        )}
      >
        <div className="max-w-screen-xl mx-auto">
          <Skeleton className={cn(
            "w-full h-[60vh] rounded-lg",
            "animate-pulse transition-all duration-300"
          )} />
          <div className="mt-4 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full max-w-[600px]" />
            <Skeleton className="h-4 w-full max-w-[400px]" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !image) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "min-h-screen bg-background p-4",
          "flex items-center justify-center",
          "transition-colors duration-300"
        )}
      >
        <div className={cn(
          "text-center space-y-4",
          "text-muted-foreground"
        )}>
          <h2 className="text-xl font-medium">Image not found</h2>
          <p className="text-sm">The image you're looking for might have been removed or is no longer available.</p>
          <button 
            onClick={() => navigate(-1)}
            className={cn(
              "text-sm text-primary",
              "hover:underline transition-all duration-200"
            )}
          >
            Go back
          </button>
        </div>
      </motion.div>
    );
  }

  return isMobile ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <MobileImageView
        image={image}
        onClose={() => navigate(-1)}
        onDownload={handleDownload}
        isOwner={image.user_id === session?.user?.id}
        setActiveTab={() => {}}
        setStyle={() => {}}
        showFullImage={true}
      />
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FullScreenImageView
        image={image}
        isOpen={true}
        onClose={() => navigate(-1)}
        onDownload={handleDownload}
        onDiscard={() => {}}
        isOwner={image.user_id === session?.user?.id}
        setStyle={() => {}}
        setActiveTab={() => {}}
      />
    </motion.div>
  );
};

export default SingleImageView;