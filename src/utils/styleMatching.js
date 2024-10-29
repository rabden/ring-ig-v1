import { styleConfigs } from './styleConfigs';

// Keywords for each style
const styleKeywords = {
  general: ['photo', 'picture', 'image', 'realistic', 'natural'],
  anime: ['anime', 'manga', 'japanese', 'cartoon', 'kawaii', 'chibi'],
  '3d': ['3d', 'render', 'model', 'blender', 'cinema4d', 'maya', 'octane'],
  realistic: ['photorealistic', 'real', 'photograph', 'camera', 'dslr'],
  illustration: ['illustration', 'drawing', 'art', 'artistic', 'painted'],
  concept: ['concept', 'design', 'character', 'environment', 'prop'],
  watercolor: ['watercolor', 'paint', 'brush', 'wet', 'fluid'],
  comic: ['comic', 'superhero', 'panel', 'action', 'graphic novel'],
  minimalist: ['minimal', 'simple', 'clean', 'geometric', 'basic'],
  cyberpunk: ['cyber', 'neon', 'futuristic', 'sci-fi', 'dystopian'],
  retro: ['vintage', 'old', 'classic', 'nostalgic', '80s', '70s'],
  fantasy: ['fantasy', 'magical', 'mythical', 'dragon', 'fairy'],
  abstract: ['abstract', 'non-representational', 'geometric', 'modern'],
  sketch: ['sketch', 'pencil', 'drawing', 'hand drawn', 'doodle'],
  oil: ['oil painting', 'classical', 'canvas', 'brush strokes'],
  portrait: ['portrait', 'face', 'headshot', 'person', 'model'],
  architectural: ['architecture', 'building', 'interior', 'exterior', 'urban'],
  nature: ['nature', 'landscape', 'wildlife', 'botanical', 'outdoor'],
  pop: ['pop art', 'warhol', 'comic style', 'bold colors'],
  pixel: ['pixel', '8-bit', '16-bit', 'retro game', 'sprite']
};

export const findBestMatchingStyle = (prompt) => {
  if (!prompt) return 'general';
  
  const promptLower = prompt.toLowerCase();
  let maxMatches = 0;
  let bestStyle = 'general';

  Object.entries(styleKeywords).forEach(([style, keywords]) => {
    const matches = keywords.reduce((count, keyword) => {
      return count + (promptLower.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);

    if (matches > maxMatches) {
      maxMatches = matches;
      bestStyle = style;
    }
  });

  return bestStyle;
};