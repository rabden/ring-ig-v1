import React, { useRef, useCallback } from 'react';
import Masonry from 'react-masonry-css';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { cn } from '@/lib/utils';
import { 
  format, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisMonth, 
  isThisYear,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  parseISO 
} from 'date-fns';

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

const getDateGroup = (date) => {
  const now = new Date();
  const parsedDate = parseISO(date);
  
  if (isToday(parsedDate)) {
    const formattedTime = format(parsedDate, 'h:mm a');
    return { key: 'today', label: `Today at ${formattedTime}` };
  }
  
  if (isYesterday(parsedDate)) {
    return { key: 'yesterday', label: 'Yesterday' };
  }
  
  const daysAgo = differenceInCalendarDays(now, parsedDate);
  if (daysAgo < 7) {
    return { key: `${daysAgo}days`, label: format(parsedDate, 'EEEE') };
  }
  
  if (isThisWeek(parsedDate)) {
    return { key: 'thisweek', label: 'This Week' };
  }
  
  const weeksAgo = differenceInCalendarWeeks(now, parsedDate);
  if (weeksAgo === 1) {
    return { key: 'lastweek', label: 'Last Week' };
  }
  
  if (isThisMonth(parsedDate)) {
    return { key: 'thismonth', label: format(parsedDate, 'MMMM d') };
  }
  
  const monthsAgo = differenceInCalendarMonths(now, parsedDate);
  if (monthsAgo < 2) {
    return { key: 'lastmonth', label: 'Last Month' };
  }
  
  if (isThisYear(parsedDate)) {
    return { key: format(parsedDate, 'MMMM'), label: format(parsedDate, 'MMMM') };
  }
  
  return { 
    key: format(parsedDate, 'yyyy'), 
    label: format(parsedDate, 'MMMM yyyy') 
  };
};

const groupImagesByDate = (images) => {
  const groups = images.reduce((acc, image) => {
    const group = getDateGroup(image.created_at);
    if (!acc[group.key]) {
      acc[group.key] = {
        label: group.label,
        images: []
      };
    }
    acc[group.key].images.push(image);
    return acc;
  }, {});

  // Sort groups by date (most recent first)
  return Object.entries(groups)
    .sort(([keyA], [keyB]) => {
      const dateA = parseISO(groups[keyA].images[0].created_at);
      const dateB = parseISO(groups[keyB].images[0].created_at);
      return dateB - dateA;
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
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

    return Object.entries(groupedImages).map(([key, { label, images: groupImages }]) => {
      if (groupImages.length === 0) return null;

      return (
        <React.Fragment key={key}>
          <div className="col-span-full sticky top-14 z-10 px-2 py-3 -mx-2 backdrop-blur-sm bg-background/80">
            <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
          </div>
          {groupImages.map((image, index) => (
            <div
              key={image.id}
              ref={index === groupImages.length - 1 ? lastImageRef : null}
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
      );
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