import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    // Check if window exists (we're in browser)
    if (typeof window === 'undefined') return;

    // Create the media query
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Define listener
    const listener = (e) => setMatches(e.matches);
    
    // Add listener
    media.addEventListener('change', listener);
    
    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  // Return null during SSR/initial render to prevent React queue errors
  return matches;
};