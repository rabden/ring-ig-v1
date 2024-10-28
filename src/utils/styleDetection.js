const styleKeywords = {
  anime: ['anime', 'manga', 'japanese animation', 'cartoon', 'animated', 'kawaii', 'chibi'],
  '3d': ['3d', 'three dimensional', 'render', 'blender', 'maya', 'cinema4d', 'octane', 'vray'],
  realistic: ['realistic', 'photorealistic', 'real', 'photograph', 'photo', 'camera', 'dslr', 'portrait'],
  illustration: ['illustration', 'illustrated', 'drawing', 'sketch', 'art', 'artistic', 'painted'],
  logo: ['logo', 'brand', 'icon', 'symbol', 'emblem', 'trademark', 'corporate'],
  graphics: ['graphic', 'design', 'poster', 'typography', 'layout', 'print', 'commercial'],
  fantasy: ['fantasy', 'magical', 'mythical', 'dragon', 'fairy', 'mystical', 'enchanted'],
  abstract: ['abstract', 'non-representational', 'geometric', 'modern art', 'contemporary', 'non-objective'],
  sketch: ['sketch', 'pencil', 'hand-drawn', 'doodle', 'charcoal', 'graphite', 'line art']
};

export const detectStyle = (prompt) => {
  if (!prompt) return 'auto';
  
  const lowercasePrompt = prompt.toLowerCase();
  
  // Check each style's keywords against the prompt
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    if (keywords.some(keyword => lowercasePrompt.includes(keyword))) {
      return style;
    }
  }
  
  // Default to auto if no style is detected
  return 'auto';
};