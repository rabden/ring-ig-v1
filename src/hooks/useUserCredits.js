import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useUserCredits = (userId) => {
  const queryClient = useQueryClient();

  const fetchCredits = async () => {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('credit_count, bonus_credits, last_refill_time')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  };

  const updateCredits = async (quality) => {
    const creditCost = {
      "SD": 1,
      "HD": 2,
      "HD+": 3,
      "4K": 4
    }[quality];

    const { data, error } = await supabase
      .rpc('update_user_credits', {
        p_user_id: userId,
        p_credit_cost: creditCost
      });

    if (error) throw error;
    return data;
  };

  const addBonusCredits = async (amount) => {
    const { data, error } = await supabase
      .rpc('add_bonus_credits', {
        p_user_id: userId,
        p_bonus_amount: amount
      });

    if (error) throw error;
    return data;
  };

  const creditsQuery = useQuery({
    queryKey: ['userCredits', userId],
    queryFn: fetchCredits,
    enabled: Boolean(userId),
    refetchInterval: 60000, // Refetch every minute to check for updates
  });

  const updateCreditsMutation = useMutation({
    mutationFn: updateCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCredits', userId] });
    },
  });

  const addBonusCreditsMutation = useMutation({
    mutationFn: addBonusCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCredits', userId] });
    },
  });

  return {
    credits: creditsQuery.data?.credit_count ?? 0,
    bonusCredits: creditsQuery.data?.bonus_credits ?? 0,
    totalCredits: (creditsQuery.data?.credit_count ?? 0) + (creditsQuery.data?.bonus_credits ?? 0),
    lastRefillTime: creditsQuery.data?.last_refill_time,
    isLoading: creditsQuery.isLoading,
    error: creditsQuery.error,
    updateCredits: updateCreditsMutation.mutate,
    addBonusCredits: addBonusCreditsMutation.mutate,
  };
};