import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

export const usePromptImprovement = (userId) => {
  const [isImproving, setIsImproving] = useState(false);

  const improveCurrentPrompt = async (prompt, onSuccess) => {
    if (!prompt?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!userId) {
      toast.error('Please sign in to improve prompts');
      return;
    }

    setIsImproving(true);
    const toastId = toast.loading('Improving prompt...', {
      position: 'top-center'
    });
    
    try {
      // First check if user has enough credits
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (userError) {
        toast.error('Failed to check credits', { id: toastId });
        return;
      }

      if (!user || user.credits < 1) {
        toast.error('Not enough credits for prompt improvement', { id: toastId });
        return;
      }

      // Then deduct credits
      const { data: userData, error: creditError } = await supabase
        .from('users')
        .update({ credits: supabase.raw('credits - 1') })
        .eq('id', userId)
        .select('credits')
        .single();

      if (creditError) {
        toast.error('Failed to update credits', { id: toastId });
        return;
      }

      // Then try to improve the prompt
      const improvedPrompt = await improvePrompt(prompt);
      if (improvedPrompt) {
        onSuccess(improvedPrompt);
        toast.success('Prompt improved!', { id: toastId });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      // Refund the credit if prompt improvement failed
      await supabase
        .from('users')
        .update({ credits: supabase.raw('credits + 1') })
        .eq('id', userId);
      
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