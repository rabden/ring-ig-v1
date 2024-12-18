import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ImageGallery from './ImageGallery'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const Inspiration = ({ userId, onImageClick, onDownload, onRemix, onViewDetails }) => {
  if (!userId) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "w-full min-h-screen",
        "bg-background",
        "transition-colors duration-300"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ImageGallery
          userId={userId}
          onImageClick={onImageClick}
          onDownload={onDownload}
          onRemix={onRemix}
          onViewDetails={onViewDetails}
          activeView="inspiration"
          className={cn(
            "animate-in fade-in-50",
            "duration-500 ease-out"
          )}
        />
      </motion.div>
    </motion.div>
  );
};

export default Inspiration;