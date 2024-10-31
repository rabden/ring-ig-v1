import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import SkeletonImage from './SkeletonImage';

const LazyImage = ({ src, alt, className, onClick, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const timeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100% 0px 100% 0px', // Load images 100% viewport height above and below
  });

  useEffect(() => {
    if (inView) {
      // Clear any existing unload timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Set a small delay before loading to prevent unnecessary loads during fast scrolling
      if (!shouldLoad) {
        loadingTimeoutRef.current = setTimeout(() => {
          setShouldLoad(true);
        }, 100);
      }
    } else {
      // Start unload timeout when image goes out of view
      if (shouldLoad) {
        timeoutRef.current = setTimeout(() => {
          setShouldLoad(false);
          setIsLoaded(false);
        }, 10000); // 10 seconds
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [inView, shouldLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={ref} className="relative w-full h-full">
      {(!shouldLoad || !isLoaded) && (
        <SkeletonImage width={width} height={height} />
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onClick={onClick}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;