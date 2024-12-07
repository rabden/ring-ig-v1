import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from "lucide-react";

const HeartAnimation = ({ isAnimating }) => {
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ 
            duration: 0.8,
            times: [0, 0.3, 0.5, 1],
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
        >
          <Heart className="h-16 w-16 fill-red-500 text-red-500 drop-shadow-lg" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeartAnimation;