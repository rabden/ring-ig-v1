import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    // Set initial value once mounted
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Setup listener for changes
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]); // Only re-run if query changes

  // Return null during SSR/initial render, then actual value once mounted
  return matches;
};