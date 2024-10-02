import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useUserCredits = (userId) => {
  const queryClient = useQueryClient();

  const fetchCredits = async () => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credit_count')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data.credit_count;
  };

  const updateCredits = async (quality) => {
    const { data, error } = await supabase.rpc('update_user_credits', {
      p_user_id: userId,
      p_quality: quality
    });

    if (error) throw error;
    return data;
  };

  const creditsQuery = useQuery({
    queryKey: ['userCredits', userId],
    queryFn: fetchCredits,
    enabled: !!userId,
  });

  const updateCreditsMutation = useMutation({
    mutationFn: updateCredits,
    onSuccess: (newCredits) => {
      queryClient.setQueryData(['userCredits', userId], newCredits);
    },
  });

  return {
    credits: creditsQuery.data,
    isLoading: creditsQuery.isLoading,
    error: creditsQuery.error,
    updateCredits: updateCreditsMutation.mutate,
  };
};