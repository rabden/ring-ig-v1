import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50",
        "bg-gradient-to-b from-background to-background/95",
        "backdrop-blur-sm",
        "flex flex-col items-center justify-center gap-8",
        "transition-all duration-500"
      )}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.img 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          src="/logo.jpg" 
          alt="Ring IG Logo" 
          className={cn(
            "w-24 h-24 rounded-full",
            "shadow-lg",
            "border-4 border-background",
            "transition-transform duration-300",
            "hover:scale-105"
          )}
        />
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-r from-primary to-primary/80",
            "transition-colors duration-300"
          )}
        >
          Ring IG
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "16rem" }}
          transition={{ delay: 0.6 }}
          className="w-64"
        >
          <Progress 
            value={progress} 
            className={cn(
              "h-1 bg-muted/30",
              "[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/80",
              "transition-all duration-300"
            )} 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;