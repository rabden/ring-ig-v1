import { useState, useEffect } from 'react';

const NSFW_STORAGE_KEY = 'nsfwEnabled';

export const useNsfwState = () => {
  // Initialize state from localStorage
  const [nsfwEnabled, setNsfwEnabled] = useState(() => {
    const savedState = localStorage.getItem(NSFW_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(NSFW_STORAGE_KEY, JSON.stringify(nsfwEnabled));
  }, [nsfwEnabled]);

  return [nsfwEnabled, setNsfwEnabled];
}; 