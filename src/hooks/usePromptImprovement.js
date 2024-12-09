import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';

export const usePromptImprovement = (updateCredits) => {
  const [isImproving, setIsImproving] = useState(false);

  const improveCurrentPrompt = async (prompt, onSuccess) => {
    if (!prompt?.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsImproving(true);
    const toastId = toast.loading('Improving prompt...', {
      position: 'top-center'
    });
    
    try {
      // First try to improve the prompt
      const result = await improvePrompt(prompt);
      if (result) {
        // Only deduct credits if improvement was successful
        if (updateCredits) {
          try {
            const creditResult = await updateCredits(1);
            if (creditResult === -1) {
              toast.error('Not enough credits for prompt improvement', { 
                id: toastId,
                position: 'top-center'
              });
              return;
            }
          } catch (error) {
            console.error('Error updating credits:', error);
            toast.error('Failed to update credits', { 
              id: toastId,
              position: 'top-center'
            });
            return;
          }
        }

        // If both improvement and credit deduction succeeded
        onSuccess(result);
        toast.success('Prompt improved!', { 
          id: toastId,
          position: 'top-center'
        });
        return result;
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
    isImproving,
    improveCurrentPrompt
  };
};