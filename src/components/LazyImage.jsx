import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import SkeletonImage from './SkeletonImage';

const LazyImage = ({ src, alt, className, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && !isLoaded) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoaded(true);
      };
    }
  }, [inView, src, isLoaded]);

  return (
    <div ref={ref} className="relative w-full h-full">
      {(!inView || !isLoaded) && <SkeletonImage />}
      {inView && isLoaded && (
        <img
          src={src}
          alt={alt}
          className={className}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default LazyImage;