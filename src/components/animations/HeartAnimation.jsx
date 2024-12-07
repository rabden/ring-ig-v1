import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const HeartAnimation = ({ isAnimating, size = 'default', className = '' }) => {
  const sizeMap = {
    small: 'h-12 w-12',
    default: 'h-20 w-20',
    large: 'h-32 w-32'
  };

  const heartSize = sizeMap[size] || sizeMap.default;

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.3, 1.2, 0.9],
          }}
          transition={{ 
            duration: 0.8,
            times: [0, 0.4, 1],
            ease: "easeOut"
          }}
        >
          <Heart className={`${heartSize} text-primary fill-primary animate-pulse`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeartAnimation;