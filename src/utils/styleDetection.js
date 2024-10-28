const styleKeywords = {
  anime: ['anime', 'manga', 'japanese animation', 'cartoon', 'animated', 'kawaii', 'chibi', 'otaku', 'anime-style', 'japanese cartoon', 'anime art', 'manga art', 'anime character', 'manga character', 'anime illustration', 'manga illustration'],
  '3d': ['3d', 'three dimensional', 'render', 'blender', 'maya', 'cinema4d', 'octane', 'vray', '3d model', '3d render', '3d art', '3d design', 'three-dimensional', '3d visualization', 'cgi', 'rendered', '3d modeling'],
  realistic: ['realistic', 'photorealistic', 'real', 'photograph', 'photo', 'camera', 'dslr', 'portrait', 'lifelike', 'true to life', 'natural', 'reality', 'photographic', 'authentic', 'genuine', 'true-to-life', 'life-like', 'photography'],
  illustration: ['illustration', 'illustrated', 'drawing', 'art', 'artistic', 'painted', 'illustrative', 'digital art', 'digital illustration', 'artwork', 'illustrator style', 'digital painting', 'concept art', 'editorial illustration'],
  logo: ['logo', 'brand', 'icon', 'symbol', 'emblem', 'trademark', 'corporate', 'branding', 'logotype', 'company logo', 'brand mark', 'business logo', 'logo design', 'corporate identity', 'brand identity'],
  graphics: ['graphic', 'design', 'poster', 'typography', 'layout', 'print', 'commercial', 'graphic design', 'visual design', 'digital design', 'print design', 'marketing material', 'advertising design', 'promotional'],
  fantasy: ['fantasy', 'magical', 'mythical', 'dragon', 'fairy', 'mystical', 'enchanted', 'mythological', 'supernatural', 'fairytale', 'epic fantasy', 'high fantasy', 'magic', 'fantastical', 'otherworldly', 'legendary'],
  abstract: ['abstract', 'non-representational', 'geometric', 'modern art', 'contemporary', 'non-objective', 'abstraction', 'abstract art', 'non-figurative', 'avant-garde', 'experimental', 'minimalist', 'conceptual'],
  sketch: ['sketch', 'pencil', 'hand-drawn', 'doodle', 'charcoal', 'graphite', 'line art', 'sketchy', 'drawing', 'rough sketch', 'quick sketch', 'pencil drawing', 'sketched', 'draft', 'preliminary drawing']
};

export const detectStyle = (prompt) => {
  if (!prompt) return null;
  
  const lowercasePrompt = prompt.toLowerCase();
  const styleCounts = {};
  let lastMatchedStyle = null;
  
  // Count occurrences of each style's keywords
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    styleCounts[style] = 0;
    keywords.forEach(keyword => {
      const matches = lowercasePrompt.match(new RegExp(keyword, 'g'));
      if (matches) {
        styleCounts[style] += matches.length;
        lastMatchedStyle = style;
      }
    });
  }
  
  // Find the style with the most mentions
  let maxCount = 0;
  let dominantStyle = null;
  
  Object.entries(styleCounts).forEach(([style, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantStyle = style;
    }
  });
  
  // If there are matches, prefer the dominant style (most mentions)
  // If counts are equal, use the last mentioned style
  return maxCount > 0 ? dominantStyle : null;
};