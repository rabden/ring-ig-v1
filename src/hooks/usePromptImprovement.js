import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';
import { useAuth } from '@/integrations/supabase/hooks/useAuth';

export const usePromptImprovement = () => {
  const [isImproving, setIsImproving] = useState(false);
  const { user } = useAuth();

  const improveCurrentPrompt = async (prompt, onSuccess) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!user) {
      toast.error('Please sign in to improve prompts');
      return;
    }

    setIsImproving(true);
    const toastId = toast.loading('Improving prompt...');
    
    try {
      // Check user credits before improving
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credit_count, bonus_credits')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const totalCredits = (profile.credit_count || 0) + (profile.bonus_credits || 0);
      
      if (totalCredits < 1) {
        toast.error('Insufficient credits for prompt improvement', { id: toastId });
        return;
      }

      const result = await improvePrompt(prompt);
      
      if (result) {
        // Deduct 1 credit after successful improvement
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            credit_count: profile.credit_count > 0 ? profile.credit_count - 1 : profile.credit_count,
            bonus_credits: profile.credit_count > 0 ? profile.bonus_credits : profile.bonus_credits - 1
          })
          .eq('id', user.id);

        if (updateError) throw updateError;

        onSuccess(result);
        toast.success('Prompt improved!', { id: toastId });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error('Failed to improve prompt', { id: toastId });
    } finally {
      setIsImproving(false);
    }
  };

  return {
    isImproving,
    improveCurrentPrompt
  };
};