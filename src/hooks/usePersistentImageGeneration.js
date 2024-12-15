import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const usePersistentImageGeneration = (session) => {
  const [generatingImages, setGeneratingImages] = useState([]);

  // Load existing generations on mount
  useEffect(() => {
    if (!session?.user?.id) return;

    const loadGenerations = async () => {
      const { data, error } = await supabase
        .from('image_generations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'pending')
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error loading generations:', error);
        return;
      }

      if (data?.length > 0) {
        setGeneratingImages(data);
      }
    };

    loadGenerations();
  }, [session?.user?.id]);

  // Subscribe to generation updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('image_generations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'image_generations',
        filter: `user_id=eq.${session.user.id}`,
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setGeneratingImages(prev => {
            const updated = prev.map(img => 
              img.id === payload.new.id ? payload.new : img
            );
            return updated.filter(img => img.status === 'pending');
          });
        } else if (payload.eventType === 'INSERT') {
          setGeneratingImages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  const startGeneration = async (generationData) => {
    if (!session?.user?.id) {
      toast.error('Please sign in to generate images');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('image_generations')
        .insert([{
          user_id: session.user.id,
          ...generationData,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting generation:', error);
      toast.error('Failed to start image generation');
      return null;
    }
  };

  const completeGeneration = async (generationId, storagePath) => {
    try {
      const { error } = await supabase
        .from('image_generations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          storage_path: storagePath
        })
        .eq('id', generationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error completing generation:', error);
    }
  };

  const failGeneration = async (generationId, errorMessage) => {
    try {
      const { error } = await supabase
        .from('image_generations')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error: errorMessage
        })
        .eq('id', generationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking generation as failed:', error);
    }
  };

  return {
    generatingImages,
    startGeneration,
    completeGeneration,
    failGeneration
  };
};