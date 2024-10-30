import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ImagesSection = () => {
  const { data: images, isLoading } = useQuery({
    queryKey: ['adminImages'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_images')
        .select(`
          *,
          profiles (display_name)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading images...</div>;

  return (
    <ScrollArea className="h-[calc(100vh-2rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images?.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative" style={{ paddingTop: '100%' }}>
                <img
                  src={supabase.storage.from('user-images').getPublicUrl(image.storage_path).data.publicUrl}
                  alt={image.prompt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-sm truncate">{image.prompt}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  By: {image.profiles?.display_name || 'Anonymous'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ImagesSection;