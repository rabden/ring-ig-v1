import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { groupImagesByDate, DATE_GROUP_ORDER } from '@/lib/date-utils';
import DateGroupHeader from './DateGroupHeader';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/supabase';

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const ImageCard = ({ image, index, onImageClick, onDownload, onDiscard, onRemix, onViewDetails }) => (
  <div className="mb-4">
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
        <img 
          src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
          alt={image.prompt} 
          className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(index)}
        />
      </CardContent>
    </Card>
    <div className="mt-2 flex items-center justify-between">
      <p className="text-sm truncate w-[70%] mr-2">{image.prompt}</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
    <div className={cn("space-y-8", className)}>
      {DATE_GROUP_ORDER.map(groupTitle => {
        const groupImages = groupedImages[groupTitle];
        if (!groupImages?.length) return null;

        return (
          <div key={groupTitle} className="space-y-4">
            <DateGroupHeader title={groupTitle} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
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
          </div>
        );
      })}
    </div>
  );
};

export default DateGroupedGallery; 