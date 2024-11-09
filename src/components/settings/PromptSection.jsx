import React from 'react';
import PromptInput from '../prompt/PromptInput';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';

const PromptSection = ({ 
  prompt, 
  setPrompt, 
  handlePromptKeyDown, 
  generateImage, 
  hasEnoughCredits,
  isGenerating,
  model
}) => {
  const { isImproving, improveCurrentPrompt } = usePromptImprovement();

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    
    if (model === 'turbo') {
      const promptLength = e.target.value.length;
      if (promptLength <= 100) {
        setSteps(4);
      } else if (promptLength <= 150) {
        setSteps(8);
      } else if (promptLength <= 200) {
        setSteps(10);
      } else {
        setSteps(12);
      }
    }
  };

  const handleClearPrompt = () => {
    setPrompt('');
  };

  const handleImprovePrompt = async () => {
    await improveCurrentPrompt(prompt, (improvedPrompt) => {
      setPrompt(improvedPrompt);
    });
  };

  return (
    <PromptInput
      value={prompt}
      onChange={handlePromptChange}
      onKeyDown={handlePromptKeyDown}
      onGenerate={generateImage}
      hasEnoughCredits={hasEnoughCredits}
      onClear={handleClearPrompt}
      onImprove={handleImprovePrompt}
      isGenerating={isGenerating}
      isImproving={isImproving}
    />
  );
};

export default React.memo(PromptSection);