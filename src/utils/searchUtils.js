export const formatSearchQuery = (text) => {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'or', 'in', 'on', 'at', 'with', 'to', 'of', 'a', 'an', 'is'].includes(word))
    .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(word => word)
    .map(word => `${word}:*`)
    .join(' | ');

  return words ? `(${words})` : '';
};