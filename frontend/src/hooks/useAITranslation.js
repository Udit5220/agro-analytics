import { useState, useEffect } from 'react';

export const useAITranslation = (textsToTranslate) => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  
  const language = localStorage.getItem('language') || 'English';
  
  useEffect(() => {
    // Basic caching mechanism (v3 cache key to bust old broken cache during API failures)
    const cacheKey = `ai_trans_v3_${language}_${btoa(encodeURIComponent(JSON.stringify(textsToTranslate))).substring(0, 50)}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      setTranslations(JSON.parse(cached));
      return;
    }

    if (language === 'English' || !textsToTranslate || textsToTranslate.length === 0) {
      const mapped = {};
      textsToTranslate.forEach(t => mapped[t] = t);
      setTranslations(mapped);
      return;
    }

    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/research/translate-ui', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ texts: textsToTranslate, targetLanguage: language })
        });
        
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.translations) {
            setTranslations(json.translations);
            localStorage.setItem(cacheKey, JSON.stringify(json.translations));
          }
        }
      } catch (err) {
        console.error("AI Translation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [language, JSON.stringify(textsToTranslate)]);

  // Helper function to return translation with fallback
  const t = (text) => translations[text] || text;
  
  return { t, loading, translations };
};
