import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import SkeletonImage from './SkeletonImage';

const LazyImage = ({ src, alt, className, onClick, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const timeoutRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100% 0px 100% 0px', // Load images 100% viewport height above and below
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      setShouldLoad(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (shouldLoad) {
      timeoutRef.current = setTimeout(() => {
        setShouldLoad(false);
        setIsLoaded(false);
      }, 10000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
        />
      )}
    </div>
  );
};

export default LazyImage;