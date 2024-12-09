import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { groupImagesByDate, DATE_GROUP_ORDER } from '@/lib/date-utils';
import DateGroupHeader from './DateGroupHeader';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/supabase';
import { motion } from 'framer-motion';

const ImageCard = ({ image, index, onImageClick, onDownload, onDiscard, onRemix, onViewDetails }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    className="group relative"
  >
    <Card className="overflow-hidden bg-transparent border-0 hover:bg-accent/5 transition-colors duration-200">
      <div className="relative aspect-square">
        <img 
          src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
          alt={image.prompt} 
          className="w-full h-full object-cover rounded-lg cursor-pointer transition-all duration-200"
          onClick={() => onImageClick(index)}
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onDownload(supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl, image.prompt)}>
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDiscard(image.id)}>
                Discard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRemix(image)}>
                Remix
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewDetails(image)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  </motion.div>
);

const DateGroupedGallery = ({ 
  images,
  onImageClick,
  onDownload,
  onDiscard,
  onRemix,
  onViewDetails,
  className
}) => {
  const groupedImages = groupImagesByDate(images);

  return (
    <div className={cn("space-y-12", className)}>
      {DATE_GROUP_ORDER.map(groupTitle => {
        const groupImages = groupedImages[groupTitle];
        if (!groupImages?.length) return null;

        return (
          <motion.div
            key={groupTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <DateGroupHeader title={groupTitle} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 px-4">
              {groupImages.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onImageClick={onImageClick}
                  onDownload={onDownload}
                  onDiscard={onDiscard}
                  onRemix={onRemix}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DateGroupedGallery; 