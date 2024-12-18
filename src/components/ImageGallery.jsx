import React, { useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import SkeletonImageCard from './SkeletonImageCard';
import ImageCard from './ImageCard';
import { useLikes } from '@/hooks/useLikes';
import NoResults from './NoResults';
import { useGalleryImages } from '@/hooks/useGalleryImages';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, parseISO, subWeeks, isAfter } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const getBreakpointColumns = () => ({
  default: 4,
  2400: 5,
  1920: 4,
  1440: 3,
  1024: 3,
  768: 2,
  640: 2,
  480: 1
});

const groupImagesByDate = (images) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
    thisMonth: [],
    lastMonth: [],
    earlier: []
  };

  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const twoWeeksAgo = subWeeks(now, 2);

  images?.forEach(image => {
    const date = parseISO(image.created_at);
    if (isToday(date)) {
      groups.today.push(image);
    } else if (isYesterday(date)) {
      groups.yesterday.push(image);
    } else if (isThisWeek(date)) {
      groups.thisWeek.push(image);
    } else if (isAfter(date, twoWeeksAgo) && !isAfter(date, oneWeekAgo)) {
      groups.lastWeek.push(image);
    } else if (isThisMonth(date)) {
      groups.thisMonth.push(image);
    } else if (isAfter(date, subWeeks(now, 6))) {
      groups.lastMonth.push(image);
    } else {
      groups.earlier.push(image);
    }
  });

  return groups;
};

const DateHeader = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "flex items-center gap-3 px-2 mb-6",
      "sticky top-0 z-10 py-2",
      "bg-background/80 backdrop-blur-sm"
    )}
  >
    <h2 className={cn(
      "text-sm font-medium",
      "text-muted-foreground/80",
      "transition-colors duration-200",
      "hover:text-foreground"
    )}>
      {children}
    </h2>
    <div className={cn(
      "h-px flex-grow",
      "bg-border/20",
      "transition-colors duration-200"
    )} />
  </motion.div>
);

const ImageGallery = ({ 
  userId, 
  onImageClick, 
  onDownload, 
  onDiscard, 
  onRemix, 
  onViewDetails, 
  generatingImages = [], 
  nsfwEnabled,
  activeFilters = {},
  searchQuery = '',
  showPrivate,
  profileUserId,
  className,
  setStyle,
  style,
  showFollowing,
  showTop,
  following
}) => {
  const { userLikes, toggleLike } = useLikes(userId);
  const isMobile = window.innerWidth <= 768;
  const breakpointColumnsObj = getBreakpointColumns();
  const location = useLocation();
  const activeView = location.pathname === '/inspiration' ? 'inspiration' : 'myImages';
  
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
    searchQuery,
    showFollowing,
    showTop,
    following
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

  if (isLoading && !images.length) {
    return (
      <div className={cn(
        "w-full h-full md:px-0 md:pt-0 pt-12",
        "animate-in fade-in-50 duration-500",
        className
      )}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto md:px-2 -mx-1 md:mx-0"
          columnClassName={cn(
            "bg-clip-padding px-1 md:px-2",
            "space-y-6 transition-all duration-300"
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.div
              key={`loading-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SkeletonImageCard width={512} height={512} />
            </motion.div>
          ))}
        </Masonry>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return <NoResults />;
  }

  // Use date grouping for My Images view
  if (activeView === 'myImages' && !profileUserId) {
    const groupedImages = groupImagesByDate(images);
    const nonEmptyGroups = Object.entries(groupedImages)
      .filter(([_, images]) => images.length > 0);

    return (
      <div className={cn(
        "w-full h-full md:px-0 pt-12",
        "space-y-12 animate-in fade-in-50 duration-500",
        className
      )}>
        <AnimatePresence mode="wait">
          {nonEmptyGroups.map(([groupName, groupImages], groupIndex) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <DateHeader>
                {groupName === 'today' && 'Today'}
                {groupName === 'yesterday' && 'Yesterday'}
                {groupName === 'thisWeek' && 'This Week'}
                {groupName === 'lastWeek' && 'Last Week'}
                {groupName === 'thisMonth' && 'This Month'}
                {groupName === 'lastMonth' && 'Last Month'}
                {groupName === 'earlier' && 'Earlier'}
              </DateHeader>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto md:px-2 -mx-1 md:mx-0"
                columnClassName={cn(
                  "bg-clip-padding px-1 md:px-2",
                  "space-y-6 transition-all duration-300"
                )}
              >
                {groupImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    ref={groupIndex === nonEmptyGroups.length - 1 && index === groupImages.length - 1 ? lastImageRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-6"
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
                      setStyle={setStyle}
                      style={style}
                    />
                  </motion.div>
                ))}
              </Masonry>
            </motion.div>
          ))}
        </AnimatePresence>
        {isFetchingNextPage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "flex justify-center my-4",
              "transition-opacity duration-300"
            )}
          >
            <div className={cn(
              "animate-spin rounded-full h-8 w-8",
              "border-2 border-primary/20",
              "border-t-primary transition-colors duration-300"
            )} />
          </motion.div>
        )}
      </div>
    );
  }

  // Regular masonry grid for other views
  return (
    <div className={cn(
      "w-full h-full md:px-0 md:pt-0 pt-0",
      "animate-in fade-in-50 duration-500",
      className
    )}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto md:px-2 -mx-1 md:mx-0"
        columnClassName={cn(
          "bg-clip-padding px-1 md:px-2",
          "space-y-6 transition-all duration-300"
        )}
      >
        <AnimatePresence mode="wait">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              ref={index === images.length - 1 ? lastImageRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
                setStyle={setStyle}
                style={style}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Masonry>
      {isFetchingNextPage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "flex justify-center my-4",
            "transition-opacity duration-300"
          )}
        >
          <div className={cn(
            "animate-spin rounded-full h-8 w-8",
            "border-2 border-primary/20",
            "border-t-primary transition-colors duration-300"
          )} />
        </motion.div>
      )}
    </div>
  );
};

export default ImageGallery;