import { useState } from 'react';
import { improvePrompt } from '@/utils/promptImprovement';
import { toast } from 'sonner';

export const usePromptImprovement = () => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedPrompt, setImprovedPrompt] = useState('');

  const improveCurrentPrompt = async (prompt) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return null;
    }

    const toastId = toast.loading('Improving prompt...');
    try {
      const result = await improvePrompt(prompt);
      setImprovedPrompt(result);
      toast.success('Prompt improved!', { id: toastId });
      return result;
    } catch (error) {
      toast.error('Failed to improve prompt', { id: toastId });
      return null;
    }
  };

  return {
    isImproving,
    setIsImproving,
    improvedPrompt,
    setImprovedPrompt,
    improveCurrentPrompt
  };
};