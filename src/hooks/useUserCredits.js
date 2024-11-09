import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useUserCredits = (userId) => {
  const queryClient = useQueryClient();

  const fetchCredits = async () => {
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('credit_count, bonus_credits, last_refill_time')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  };

  const updateCredits = async (quality, successCount) => {
    const creditCost = {
      "SD": 1,
      "HD": 2,
      "HD+": 3,
      "4K": 4
    }[quality] * successCount;

    const { data: profile } = await supabase
      .from('profiles')
      .select('credit_count, bonus_credits')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Profile not found');

    const totalCredits = profile.credit_count + profile.bonus_credits;
    if (totalCredits < creditCost) return -1;

    let newCreditCount = profile.credit_count;
    let newBonusCredits = profile.bonus_credits;

    if (profile.credit_count >= creditCost) {
      newCreditCount -= creditCost;
    } else {
      const remainingCost = creditCost - profile.credit_count;
      newCreditCount = 0;
      newBonusCredits -= remainingCost;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        credit_count: newCreditCount,
        bonus_credits: newBonusCredits
      })
      .eq('id', userId);

    if (error) throw error;
    return newCreditCount + newBonusCredits;
  };

  const addBonusCredits = async (amount) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        bonus_credits: supabase.raw(`bonus_credits + ${amount}`)
      })
      .eq('id', userId)
      .select('bonus_credits')
      .single();

    if (error) throw error;
    return data.bonus_credits;
  };

  const creditsQuery = useQuery({
    queryKey: ['userCredits', userId],
    queryFn: fetchCredits,
    enabled: Boolean(userId),
    refetchInterval: 60000,
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