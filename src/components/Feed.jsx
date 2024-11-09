import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';
import NoResults from './NoResults';
import { useFollows } from '@/hooks/useFollows';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const Feed = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails,
  setActiveTab,
  setStyle,
  style
}) => {
  const { following } = useFollows(userId);
  
  const { data: feedImages, isLoading } = useQuery({
    queryKey: ['feedImages', userId, following],
    queryFn: async () => {
      if (!userId) return [];
      
      // Get images from followed users
      const followingImages = following.length > 0 ? await supabase
        .from('user_images')
        .select('*')
        .in('user_id', following)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(20) : [];

      // Get trending and hot images
      const trendingImages = await supabase
        .from('user_images')
        .select('*')
        .eq('is_private', false)
        .neq('user_id', userId)
        .or('is_trending.eq.true,is_hot.eq.true')
        .order('created_at', { ascending: false })
        .limit(20);

      // Get other public images
      const normalImages = await supabase
        .from('user_images')
        .select('*')
        .eq('is_private', false)
        .neq('user_id', userId)
        .is('is_trending', null)
        .is('is_hot', null)
        .order('created_at', { ascending: false })
        .limit(20);

      // Combine and deduplicate images
      const allImages = [
        ...(followingImages.data || []),
        ...(trendingImages.data || []),
        ...(normalImages.data || [])
      ];

      // Remove duplicates based on image id
      const uniqueImages = Array.from(new Map(allImages.map(item => [item.id, item])).values());
      
      return uniqueImages;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!feedImages?.length) {
    return <NoResults />;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto md:px-2 -mx-1 md:mx-0"
      columnClassName="bg-clip-padding px-1 md:px-2"
    >
      {feedImages.map((image) => (
        <div key={image.id}>
          <ImageCard
            image={image}
            onImageClick={() => onImageClick(image)}
            onDownload={onDownload}
            onDiscard={onDiscard}
            onRemix={onRemix}
            onViewDetails={onViewDetails}
            userId={userId}
            setActiveTab={setActiveTab}
            setStyle={setStyle}
            style={style}
          />
        </div>
      ))}
    </Masonry>
  );
};

export default Feed;