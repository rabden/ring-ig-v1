import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from "sonner";
import { getRetryInterval, shouldRetry, MAX_RETRIES } from '@/utils/retryUtils';

export const useUserCredits = (userId) => {
  const queryClient = useQueryClient();

  const fetchCredits = async ({ queryKey, signal }) => {
    const [_, uid] = queryKey;
    if (!uid) return { credit_count: 0, bonus_credits: 0, last_refill_time: null };
    
    let retryCount = 0;
    
    const fetchWithRetry = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credit_count, bonus_credits, last_refill_time')
          .eq('id', uid)
          .abortSignal(signal)
          .single();

        if (error) {
          console.error('Error fetching credits:', error);
          
          if (shouldRetry(error.status, retryCount)) {
            retryCount++;
            const retryInterval = getRetryInterval(error.status);
            console.log(`Retrying credits fetch in ${retryInterval/1000}s. Attempt ${retryCount} of ${MAX_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
            return fetchWithRetry();
          }
          
          throw error;
        }

        return data;
      } catch (error) {
        if (error.code === 'PGRST116') {
          return { credit_count: 0, bonus_credits: 0, last_refill_time: null };
        }
        throw error;
      }
    };

    return fetchWithRetry();
  };

  const updateCredits = async (quality) => {
    const creditCost = {
      "HD": 1,
      "HD+": 2,
      "4K": 3
    }[quality];

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credit_count, bonus_credits')
        .eq('id', userId)
        .single();

      if (!profile) {
        toast.error('Profile not found');
        return -1;
      }

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

      if (error) {
        console.error('Error updating credits:', error);
        toast.error('Failed to update credits');
        throw error;
      }

      return newCreditCount + newBonusCredits;
    } catch (error) {
      console.error('Error in updateCredits:', error);
      toast.error('Failed to update credits');
      throw error;
    }
  };

  const addBonusCredits = async (amount) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          bonus_credits: supabase.raw(`bonus_credits + ${amount}`)
        })
        .eq('id', userId)
        .select('bonus_credits')
        .single();

      if (error) {
        console.error('Error adding bonus credits:', error);
        toast.error('Failed to add bonus credits');
        throw error;
      }

      return data.bonus_credits;
    } catch (error) {
      console.error('Error in addBonusCredits:', error);
      toast.error('Failed to add bonus credits');
      throw error;
    }
  };

  const { data: creditsData, isLoading, error } = useQuery({
    queryKey: ['userCredits', userId],
    queryFn: fetchCredits,
    enabled: Boolean(userId),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
    initialData: { credit_count: 0, bonus_credits: 0, last_refill_time: null }
  });

  const updateCreditsMutation = useMutation({
    mutationFn: updateCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCredits', userId] });
    },
    onError: (error) => {
      console.error('Mutation error in updateCredits:', error);
    }
  });

  const addBonusCreditsMutation = useMutation({
    mutationFn: addBonusCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCredits', userId] });
    },
    onError: (error) => {
      console.error('Mutation error in addBonusCredits:', error);
    }
  });

  return {
    credits: creditsData?.credit_count ?? 0,
    bonusCredits: creditsData?.bonus_credits ?? 0,
    totalCredits: (creditsData?.credit_count ?? 0) + (creditsData?.bonus_credits ?? 0),
    lastRefillTime: creditsData?.last_refill_time,
    isLoading,
    error,
    updateCredits: updateCreditsMutation.mutate,
    addBonusCredits: addBonusCreditsMutation.mutate,
  };
};