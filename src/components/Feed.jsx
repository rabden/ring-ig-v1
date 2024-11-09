import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import Masonry from 'react-masonry-css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 2
};

const Feed = ({ userId, onImageClick, onDownload, onRemix, onViewDetails }) => {
  // Query for following users' images
  const { data: followingImages = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['followingImages', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First get the list of users being followed
      const { data: following } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId);
      
      if (!following?.length) return [];
      
      const followingIds = following.map(f => f.following_id);
      
      // Then get their images
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .in('user_id', followingIds)
        .eq('is_private', false)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Query for trending and hot images
  const { data: trendingImages = [], isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingImages', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('is_private', false)
        .neq('user_id', userId)
        .or('is_hot.eq.true,is_trending.eq.true')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Query for other public images
  const { data: otherImages = [], isLoading: isLoadingOther } = useQuery({
    queryKey: ['otherImages', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('is_private', false)
        .neq('user_id', userId)
        .is('is_hot', false)
        .is('is_trending', false)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const isLoading = isLoadingFollowing || isLoadingTrending || isLoadingOther;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Combine all images, removing duplicates
  const seenIds = new Set();
  const allImages = [
    ...followingImages,
    ...trendingImages,
    ...otherImages
  ].filter(image => {
    if (seenIds.has(image.id)) return false;
    seenIds.add(image.id);
    return true;
  });

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex w-auto"
      columnClassName="bg-clip-padding px-2"
    >
      {allImages.map((image, index) => (
        <div key={image.id} className="mb-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
              <img 
                src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                alt={image.prompt} 
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
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
      ))}
    </Masonry>
  );
};

export default Feed;