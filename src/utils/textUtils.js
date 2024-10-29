export const findCommonWords = (text1, text2) => {
  // Convert to lowercase and remove special characters
  const cleanText = (text) => text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Get unique words, filtering out common words and short words
  const getWords = (text) => {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    return new Set(
      cleanText(text)
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.has(word))
    );
  };

  const words1 = getWords(text1);
  const words2 = getWords(text2);
  
  // Find intersection of words
  const commonWords = [...words1].filter(word => words2.has(word));
  
  return commonWords.length > 0;
};