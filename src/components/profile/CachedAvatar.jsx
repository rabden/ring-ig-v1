import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const imageCache = new Map();

const CachedAvatar = ({ 
  src, 
  alt, 
  className = '', 
  isPro = false,
  fallback = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(imageCache.has(src));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || imageCache.has(src)) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      imageCache.set(src, true);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={`${isPro ? 'p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 rounded-full' : ''}`}>
      <Avatar className={`h-6 w-6 flex-shrink-0 ${isPro ? 'border-2 border-background rounded-full' : ''} ${className}`}>
        <AvatarImage 
          src={src} 
          alt={alt}
          className={`transition-opacity duration-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <AvatarFallback>
          {error || !src ? (fallback || <User className="h-4 w-4" />) : null}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default React.memo(CachedAvatar);