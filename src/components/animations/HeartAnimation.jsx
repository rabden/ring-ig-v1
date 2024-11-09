import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from "lucide-react";

const HeartAnimation = ({ isAnimating }) => {
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: [1, 2, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ 
            duration: 0.5,
            times: [0, 0.3, 1]
          }}
          className="absolute pointer-events-none"
        >
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeartAnimation;