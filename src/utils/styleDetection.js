const styleKeywords = {
  anime: ['anime', 'manga', 'japanese animation', 'cartoon', 'animated', 'kawaii', 'chibi', 'otaku', 'anime-style', 'japanese cartoon', 'anime art', 'manga art', 'anime character', 'manga character'],
  '3d': ['3d', 'three dimensional', 'render', 'blender', 'maya', 'cinema4d', 'octane', 'vray', '3d model', '3d render', '3d art', 'three-dimensional', '3d design', 'cgi', '3d graphics'],
  realistic: ['realistic', 'photorealistic', 'real', 'photograph', 'photo', 'camera', 'dslr', 'portrait', 'lifelike', 'true to life', 'natural', 'reality', 'photographic', 'authentic', 'hyperrealistic'],
  illustration: ['illustration', 'illustrated', 'drawing', 'sketch', 'art', 'artistic', 'painted', 'digital art', 'concept art', 'artwork', 'illustrative', 'digital illustration', 'hand-drawn', 'digital painting'],
  logo: ['logo', 'brand', 'icon', 'symbol', 'emblem', 'trademark', 'corporate', 'branding', 'logotype', 'company logo', 'brand mark', 'business logo', 'logo design', 'identity'],
  graphics: ['graphic', 'design', 'poster', 'typography', 'layout', 'print', 'commercial', 'graphic design', 'visual design', 'digital design', 'creative design', 'vector graphics', 'modern design'],
  fantasy: ['fantasy', 'magical', 'mythical', 'dragon', 'fairy', 'mystical', 'enchanted', 'mythological', 'supernatural', 'fairytale', 'epic fantasy', 'high fantasy', 'magical realism'],
  abstract: ['abstract', 'non-representational', 'geometric', 'modern art', 'contemporary', 'non-objective', 'abstract art', 'abstract design', 'abstract style', 'non-figurative', 'contemporary art'],
  sketch: ['sketch', 'pencil', 'hand-drawn', 'doodle', 'charcoal', 'graphite', 'line art', 'sketchy', 'rough sketch', 'quick sketch', 'pencil drawing', 'sketched', 'draft']
};

export const detectStyle = (prompt, selectedStyle) => {
  // Only perform auto-detection if 'auto' is explicitly selected
  if (selectedStyle !== 'auto' || !prompt) {
    return selectedStyle;
  }
  
  const lowercasePrompt = prompt.toLowerCase();
  const styleMatches = {};
  
  // Count matches for each style
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    styleMatches[style] = {
      count: keywords.filter(keyword => lowercasePrompt.includes(keyword)).length,
      lastIndex: Math.max(...keywords.map(keyword => lowercasePrompt.lastIndexOf(keyword)))
    };
  }

  // Filter out styles with no matches
  const matchedStyles = Object.entries(styleMatches).filter(([_, data]) => data.count > 0);
  
  if (matchedStyles.length === 0) {
    return 'auto';
  }

  // Sort by count (primary) and last occurrence (secondary)
  matchedStyles.sort(([_, a], [__, b]) => {
    if (a.count !== b.count) {
      return b.count - a.count; // Higher count first
    }
    return b.lastIndex - a.lastIndex; // Later occurrence first
  });

  return matchedStyles[0][0];
};