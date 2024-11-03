import React, { useState, useEffect, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import Masonry from 'react-masonry-css'
import SkeletonImageCard from './SkeletonImageCard'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import MobileImageDrawer from './MobileImageDrawer'
import ImageCard from './ImageCard'
import { useLikes } from '@/hooks/useLikes'
import MobileGeneratingStatus from './MobileGeneratingStatus'
import NoResults from './NoResults'
import { useInView } from 'react-intersection-observer'

const ITEMS_PER_PAGE = 20;

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
}

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  activeView, 
  generatingImages = [], 
  nsfwEnabled,
  activeFilters = {},
  searchQuery = '',
  setActiveTab,
  setStyle
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showImageInDrawer, setShowImageInDrawer] = useState(false);
  const { userLikes, toggleLike } = useLikes(userId);
  const { data: modelConfigs } = useModelConfigs();
  const isMobile = window.innerWidth <= 768;

  // Intersection Observer for infinite scroll
  const { ref, inView } = useInView();

  const fetchImages = async ({ pageParam = 0 }) => {
    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply filters
    if (activeView === 'myImages') {
      query = query.eq('user_id', userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
    }

    if (activeFilters.style) {
      query = query.eq('style', activeFilters.style);
    }
    if (activeFilters.model) {
      query = query.eq('model', activeFilters.model);
    }
    if (searchQuery) {
      query = query.ilike('prompt', `%${searchQuery}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // Filter NSFW content
    const filteredData = data.filter(img => {
      const isNsfw = modelConfigs?.[img.model]?.category === "NSFW";
      return nsfwEnabled ? isNsfw : !isNsfw;
    });

    return {
      images: filteredData,
      nextPage: filteredData.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      totalCount: count
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled, activeFilters, searchQuery],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId && !!modelConfigs,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [activeView, nsfwEnabled, refetch]);

  useEffect(() => {
    const channels = [
      supabase
        .channel('user_images_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_images' }, 
          () => {
            refetch();
          }
        ),
      supabase
        .channel('user_image_likes_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'user_image_likes' },
          () => {
            refetch();
          }
        )
    ];

    Promise.all(channels.map(channel => channel.subscribe()));

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [userId, refetch]);

  const handleImageClick = (image, index) => {
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(true);
      setDrawerOpen(true);
    } else {
      onImageClick(image, index);
    }
  };

  const handleMoreClick = (image, e) => {
    e.stopPropagation();
    if (isMobile) {
      setSelectedImage(image);
      setShowImageInDrawer(false);
      setDrawerOpen(true);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      ));
    }
    
    if (!data || data.pages[0].images.length === 0) {
      return [<NoResults key="no-results" />];
    }
    
    const allImages = data.pages.flatMap(page => page.images);
    return allImages.map((image, index) => (
      <ImageCard
        key={image.id}
        image={image}
        onImageClick={() => handleImageClick(image, index)}
        onMoreClick={handleMoreClick}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        onViewDetails={onViewDetails}
        userId={userId}
        isMobile={isMobile}
        isLiked={userLikes.includes(image.id)}
        onToggleLike={toggleLike}
      />
    ));
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {renderContent()}
      </Masonry>

      {/* Infinite scroll trigger */}
      {!isLoading && hasNextPage && (
        <div ref={ref} className="h-10 w-full" />
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      <MobileImageDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        image={selectedImage}
        showImage={showImageInDrawer}
        onDownload={onDownload}
        onDiscard={onDiscard}
        onRemix={onRemix}
        isOwner={selectedImage?.user_id === userId}
        setActiveTab={setActiveTab}
        setStyle={setStyle}
      />

      <MobileGeneratingStatus generatingImages={generatingImages} />
    </>
  );
};

export default ImageGallery;