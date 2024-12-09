import React, { useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { cn } from '@/lib/utils';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

const getBreakpointColumns = (activeView) => {
  if (activeView === 'inspiration' || activeView === 'profile') {
    return {
      default: 5,
      1600: 5,
      1200: 4,
      700: 2,
      500: 2
    };
  }
  return {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };
};

const groupImagesByDate = (images) => {
  return images.reduce((groups, image) => {
    const date = parseISO(image.created_at);
    let group = 'Earlier';

    if (isToday(date)) {
      group = 'Today';
    } else if (isThisWeek(date)) {
      group = 'This Week';
    } else if (isThisMonth(date)) {
      group = 'This Month';
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(image);
    return groups;
  }, {});
};

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
  showPrivate,
  profileUserId,
  className
}) => {
  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;
  const breakpointColumnsObj = getBreakpointColumns(activeView);
  
  const { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage 
  } = useGalleryImages({
    userId: profileUserId || userId,
    activeView,
    nsfwEnabled,
    showPrivate,
    activeFilters,
    searchQuery
  });

  const observer = useRef();
  const lastImageRef = useCallback(node => {
    if (isLoading || isFetchingNextPage) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleMobileMoreClick = (image) => {
    if (isMobile) {
      onViewDetails(image);
    }
  };

  const renderContent = () => {
    if (isLoading && !images.length) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SkeletonImageCard key={`loading-${index}`} width={512} height={512} />
      ));
    }
    
    if (!images || images.length === 0) {
      return [<NoResults key="no-results" />];
    }
    
    // Filter images based on privacy setting
    const filteredImages = images.filter(img => {
      if (activeView === 'myImages') {
        return showPrivate ? img.is_private : !img.is_private;
      }
      return !img.is_private;
    });

    // If not in myImages view, render normally
    if (activeView !== 'myImages') {
      return filteredImages.map((image, index) => (
        <div
          key={image.id}
          ref={index === filteredImages.length - 1 ? lastImageRef : null}
        >
          <ImageCard
            image={image}
            onImageClick={() => onImageClick(image)}
            onDownload={onDownload}
            onDiscard={onDiscard}
            onRemix={onRemix}
            onViewDetails={onViewDetails}
            onMoreClick={handleMobileMoreClick}
            userId={userId}
            isMobile={isMobile}
            isLiked={userLikes.includes(image.id)}
            onToggleLike={toggleLike}
            setActiveTab={setActiveTab}
          />
        </div>
      ));
    }

    // Group images by date for myImages view
    const groupedImages = groupImagesByDate(filteredImages);
    const dateGroups = ['Today', 'This Week', 'This Month', 'Earlier'];

    return dateGroups.map(group => {
      const groupImages = groupedImages[group] || [];
      if (groupImages.length === 0) return null;

      return (
        <React.Fragment key={group}>
          <div className="col-span-full px-2 pt-6 pb-2">
            <h2 className="text-lg font-semibold text-foreground/80">{group}</h2>
          </div>
          {groupImages.map((image, index) => (
            <div
              key={image.id}
              ref={index === groupImages.length - 1 && group === 'Earlier' ? lastImageRef : null}
            >
              <ImageCard
                image={image}
                onImageClick={() => onImageClick(image)}
                onDownload={onDownload}
                onDiscard={onDiscard}
                onRemix={onRemix}
                onViewDetails={onViewDetails}
                onMoreClick={handleMobileMoreClick}
                userId={userId}
                isMobile={isMobile}
                isLiked={userLikes.includes(image.id)}
                onToggleLike={toggleLike}
                setActiveTab={setActiveTab}
              />
            </div>
          ))}
        </React.Fragment>
      ));
    });
  };

  return (
    <div className={cn(
      "w-full h-full",
      "md:px-0",
      "md:pt-0",
      "pt-12",
      className
    )}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName="bg-clip-padding px-1 md:px-2"
      >
        {renderContent()}
      </Masonry>
      {isFetchingNextPage && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;