import { styleConfig } from '@/config/styleConfig';

export const getCleanPrompt = (prompt, style) => {
  if (!prompt || !style || !styleConfig[style]) return prompt;
  
  const styleSuffix = styleConfig[style].suffix;
  if (!styleSuffix) return prompt;
  
  // Remove the style suffix and any trailing commas and spaces
  return prompt.replace(`, ${styleSuffix}`, '').trim();
};