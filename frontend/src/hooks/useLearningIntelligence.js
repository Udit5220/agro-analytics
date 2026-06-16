import { useState, useEffect } from 'react';

export const useLearningIntelligence = (activeView, language, courseContext) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We don't need to fetch data for ai-tutor from this hook, it handles its own state
    if (activeView === 'ai-tutor') {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const userRole = localStorage.getItem('userRole') || 'Farmer';
        // For learning hub, we can map activeView to subPath directly
        // 'dashboard' -> 'dashboard'
        // 'catalog' -> 'catalog'
        // 'lesson' -> 'lesson'
        // 'quiz' -> 'quiz'
        // 'analytics' -> 'analytics'
        
        const contextParam = courseContext ? `&context=${encodeURIComponent(courseContext)}` : '';
        const response = await fetch(`http://localhost:5000/api/learning/dashboard?subPath=${activeView}&role=${encodeURIComponent(userRole)}&language=${encodeURIComponent(language)}${contextParam}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch learning intelligence data');
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [activeView, language, courseContext]);

  return { data, loading, error };
};
