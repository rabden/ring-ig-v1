import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useUserCredits = (userId) => {
  const queryClient = useQueryClient();
  const [credits, setCredits] = useState(0);

  const { data: creditsData, isLoading, error } = useQuery({
    queryKey: ['userCredits', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_credits')
        .select('credit_count')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (creditsData) {
      setCredits(creditsData.credit_count);
    }
  }, [creditsData]);

  const updateCreditsMutation = useMutation({
    mutationFn: async (quality) => {
      const creditCost = {
        "SD": 1,
        "HD": 2,
        "HD+": 3,
        "4K": 4
      }[quality];

      const { data, error } = await supabase.rpc('update_user_credits', {
        p_user_id: userId,
        p_credit_cost: creditCost,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (newCredits) => {
      setCredits(newCredits);
      queryClient.invalidateQueries(['userCredits', userId]);
    },
    onError: (error) => {
      console.error('Error updating credits:', error);
    },
  });

  const updateCredits = async (quality) => {
    try {
      await updateCreditsMutation.mutateAsync(quality);
    } catch (error) {
      throw error;
    }
  };

  return { credits, updateCredits, isLoading, error };
};