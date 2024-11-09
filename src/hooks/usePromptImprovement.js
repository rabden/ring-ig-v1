import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';

export const usePromptImprovement = () => {
  const [isImproving, setIsImproving] = useState(false);

  const improveCurrentPrompt = async (prompt, onSuccess) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsImproving(true);
    const toastId = toast.loading('Improving prompt...');
    
    try {
      const result = await improvePrompt(prompt);
      if (result) {
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