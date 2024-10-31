import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SkeletonImage from './SkeletonImage';

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  onClick, 
  onDoubleClick, 
  onLoad, 
  onUnload,
  isUnloaded,
  setIsUnloaded 
}) => {
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1
  });
  
  useEffect(() => {
    if (inView && isUnloaded) {
      setIsUnloaded(false);
    }
  }, [inView, isUnloaded, setIsUnloaded]);

  const handleLoad = (e) => {
    setLoaded(true);
    if (onLoad) {
      // Get approximate size in MB (assuming JPEG/PNG compression)
      const size = (e.target.naturalWidth * e.target.naturalHeight * 4) / (1024 * 1024);
      onLoad(size);
    }
  };

  return (
    <div ref={ref} className="relative w-full h-full">
      {(!loaded || !inView || isUnloaded) && <SkeletonImage />}
      {inView && !isUnloaded && (
        <img
          src={src}
          alt={alt}
          className={className}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onLoad={handleLoad}
          style={{ display: loaded ? 'block' : 'none' }}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;