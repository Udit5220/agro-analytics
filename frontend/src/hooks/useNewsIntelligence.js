import { useState, useEffect, useRef, useCallback } from 'react';

const cache = new Map();

/**
 * Custom hook for fetching and caching news intelligence data
 * @param {string} userRole - 'Farmer' | 'Trader' | 'Exporter'
 * @param {string} activeSubpage - 'Everything' | 'Wheat' | 'Mustard' | 'Mandi Prices' | 'Weather'
 * @param {string} location - City, State location string
 */
export function useNewsIntelligence(userRole, activeSubpage, location, language = 'English') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate cache key
  const cacheKey = `${userRole}_${activeSubpage}_${location}_${language}`;

  // Fetch function memoized
  const fetchIntel = useCallback(async (force = false) => {
    if (!force && cache.has(cacheKey)) {
      setData(cache.get(cacheKey));
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        role: userRole,
        subPath: activeSubpage,
        location: location
      });

      const res = await fetch(`http://localhost:5000/api/news/intelligence?${queryParams}`, {
        headers: {
          'x-user-role': userRole,
          'x-user-location': location,
          'x-language': language
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const result = await res.json();
      if (result.success && result.data) {
        cache.set(cacheKey, result.data);
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch news intelligence');
      }
    } catch (err) {
      console.error('[useNewsIntelligence] Error:', err);
      setError(err.message);
      
      // Serve stale cache if available, else null
      if (cache.has(cacheKey)) {
        setData(cache.get(cacheKey));
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, userRole, activeSubpage, location, language]);

  useEffect(() => {
    fetchIntel();
  }, [fetchIntel]);

  const refetch = () => fetchIntel(true);

  return { data, loading, error, refetch };
}
