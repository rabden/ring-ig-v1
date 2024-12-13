import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';
import { usePromptCredits } from './usePromptCredits';

export const usePromptImprovement = (userId) => {
  const [isImproving, setIsImproving] = useState(false);
  const { deductCredits, isDeducting } = usePromptCredits(userId);

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
      // Deduct credits first
      const deductResult = await deductCredits();
      if (deductResult === -1) {
        toast.error('Not enough credits for prompt improvement', { 
          id: toastId,
          position: 'top-center'
        });
        return;
      }

      // Then try to improve the prompt
      const result = await improvePrompt(prompt);
      if (result) {
        onSuccess(result);
        toast.success('Prompt improved!', { 
          id: toastId,
          position: 'top-center'
        });
        return result;
      } else {
        toast.error('Failed to improve prompt', { 
          id: toastId,
          position: 'top-center'
        });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error('Failed to improve prompt', { 
        id: toastId,
        position: 'top-center'
      });
    } finally {
      setIsImproving(false);
    }
  };

  return {
    isImproving: isImproving || isDeducting,
    improveCurrentPrompt
  };
};