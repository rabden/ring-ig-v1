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
      const result = await improvePrompt(prompt);
      if (result) {
        // Deduct one credit after successful improvement
        if (updateCredits) {
          const updatedCredits = await updateCredits(1); // Pass 1 as a direct cost
          if (updatedCredits === -1) {
            toast.error('Not enough credits for prompt improvement', { 
              id: toastId,
              position: 'top-center'
            });
            return;
          }
        }
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