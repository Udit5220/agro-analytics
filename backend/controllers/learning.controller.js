import { generateGeminiGenaiResponse, fetchLearningIntelligenceAI } from '../services/geminiGenaiService.js';
import { searchGoogleGenai } from '../services/googleSearchService.js';
import { getFallbackContent } from '../utils/contentFallback.js';

const learningCache = new Map();
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours

export const handleAiTutorChat = async (req, res) => {
  try {
    const { query, role, language, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // 1. Perform a web search to get relevant context
    let searchContext = '';
    try {
      const searchResults = await searchGoogleGenai(`agricultural tutorial ${query}`);
      if (searchResults && searchResults.items) {
        searchContext = searchResults.items
          .slice(0, 3)
          .map((item) => `${item.title}: ${item.snippet}`)
          .join('\n');
      }
    } catch (searchError) {
      console.warn('Google Search failed for AI Tutor:', searchError.message);
    }

    // 2. Generate Gemini Response
    const systemPrompt = `You are the "Agro AI Tutor", an expert agricultural educator in the Greenleaf AI system.
The user is a ${role || 'learner'} taking courses in the Learning Hub.
Their language preference is ${language || 'English'}.
Context from current course/module: ${context || 'General Agriculture'}.
Recent web search context (if any):
${searchContext}

User Query: "${query}"

Provide an educational, clear, and structured response. 
Use Markdown. Format your advice using bullet points or short paragraphs. 
Keep the tone encouraging, instructional, and professional.
Respond STRICTLY in ${language || 'English'}.`;

    const aiResponse = await generateGeminiGenaiResponse(systemPrompt);

    res.json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    console.warn('Gemini AI Tutor failed. Activating fallback tutor response.', error.message);
    
    const queryLower = (req.body.query || '').toLowerCase();
    let fallbackResponse = `**Offline Mode Notice**\nI'm your Agro AI Tutor. Unfortunately, my live intelligence is currently offline due to high traffic.\n\n`;
    
    if (queryLower.includes('pest') || queryLower.includes('disease') || queryLower.includes('insect')) {
      fallbackResponse += `**Pest & Disease Control Advice:**\n- **Integrated Pest Management (IPM):** Combine biological, cultural, and mechanical tools rather than relying solely on chemical pesticides.\n- **Natural Predators:** Introduce ladybugs or lacewings to naturally control aphid populations.\n- **Neem Oil:** A highly effective organic spray that disrupts the life cycle of over 200 species of pests.`;
    } else if (queryLower.includes('water') || queryLower.includes('irrigat') || queryLower.includes('drought')) {
      fallbackResponse += `**Irrigation & Water Saving Advice:**\n- **Drip Irrigation:** Installing a drip system targets water directly to the root zone, reducing evaporation and saving up to 50% water.\n- **Mulching:** Apply organic mulch around crop bases to retain soil moisture.\n- **Water Scheduling:** Water early in the morning to minimize evaporation loss during the hottest parts of the day.`;
    } else if (queryLower.includes('soil') || queryLower.includes('fertiliz') || queryLower.includes('nutrient')) {
      fallbackResponse += `**Soil Health & Fertility Advice:**\n- **Compost:** Regularly add organic compost to improve soil structure and water retention.\n- **Crop Rotation:** Rotate different families of crops each season to prevent nutrient depletion.\n- **NPK Testing:** Always test your soil's Nitrogen, Phosphorus, and Potassium levels before applying heavy fertilizers.`;
    } else if (queryLower.includes('seed') || queryLower.includes('sow') || queryLower.includes('plant')) {
      fallbackResponse += `**Seed Selection & Planting Advice:**\n- **Certified Seeds:** Always purchase certified, disease-resistant seed varieties adapted to your local climate.\n- **Spacing:** Proper plant spacing ensures adequate airflow, reducing the risk of fungal infections.\n- **Seed Treatment:** Treat seeds with organic bio-fungicides (like Trichoderma) before sowing.`;
    } else {
      fallbackResponse += `Based on your query regarding "${req.body.query}", here are some general best practices:\n- Ensure consistent soil testing every year.\n- Maintain proper irrigation schedules based on local weather.\n- Adopt Integrated Pest Management (IPM) to protect your crops sustainably.\n\nPlease refer to the specific modules in the Course Catalog for deeper learning on this topic.`;
    }

    res.json({
      success: true,
      data: fallbackResponse,
      source: 'fallback'
    });
  }
};

export const getLearningDashboardData = async (req, res) => {
  try {
    const userRole = req.headers['x-user-role'] || req.query.role || 'Farmer';
    const language = req.headers['x-language'] || req.query.language || 'English';
    const subPath = req.query.subPath || 'dashboard';
    const location = req.headers['x-user-location'] || req.query.location || 'India';
    const context = req.query.context || '';

    const cacheKey = `learning_${userRole}_${language}_${subPath}_${location}_${context}`;

    // 1. Check Cache
    if (learningCache.has(cacheKey)) {
      const cached = learningCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.status(200).json({ success: true, data: cached.data });
      }
    }

    // 2. Perform Web Search for Context
    let searchContext = '';
    try {
      console.log(`[LearningController] Searching web context for ${userRole} in ${location}`);
      const searchQuery = `agriculture education training ${userRole} ${location}`;
      const searchResults = await searchGoogleGenai(searchQuery);
      if (searchResults && searchResults.items) {
        searchContext = searchResults.items
          .slice(0, 2)
          .map((item) => `${item.title}: ${item.snippet}`)
          .join('\n');
      }
    } catch (searchError) {
      console.warn('Google Search failed for Learning Hub:', searchError.message);
    }

    // 3. Generate AI Response or Fallback
    let aiData;
    let isFallback = false;
    try {
      console.log(`[LearningController] Generating AI response for subPath: ${subPath}, context: ${context}`);
      aiData = await fetchLearningIntelligenceAI(userRole, language, subPath, location, searchContext, context);
      console.log(`[LearningController] AI response generated successfully.`);
    } catch (aiError) {
      console.warn(`[LearningController] Gemini AI failed (${aiError.message}). Activating fallback content for role: ${userRole}, subPath: ${subPath}`);
      aiData = getFallbackContent(userRole, subPath, language, context);
      isFallback = true;
    }

    // 4. Transform Image Keywords into Wikipedia Image URLs
    const fetchImageFromWiki = async (keyword) => {
      try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&prop=pageimages&piprop=thumbnail&pithumbsize=400&format=json&gsrlimit=1`, { signal: controller.signal });
          clearTimeout(timeoutId);
          const data = await res.json();
          if (data?.query?.pages) {
              const pages = data.query.pages;
              const key = Object.keys(pages)[0];
              if (pages[key]?.thumbnail?.source) return pages[key].thumbnail.source;
          }
      } catch(e) { 
          console.warn(`[LearningController] Wiki fetch failed for ${keyword}:`, e.message);
      }
      return `https://picsum.photos/seed/${encodeURIComponent(keyword || 'farm')}/400/300`;
    };

    console.log(`[LearningController] Fetching images...`);
    if (subPath === 'dashboard' && aiData.recommended_courses) {
      for (let course of aiData.recommended_courses) {
        course.img = await fetchImageFromWiki(course.keyword_for_image || course.title);
      }
    } else if (aiData.uiElements?.courses) {
      for (let course of aiData.uiElements.courses) {
        course.img = await fetchImageFromWiki(course.thumbnailPlaceholder || course.title);
      }
    } else if (aiData.courses) {
      for (let course of aiData.courses) {
        course.img = await fetchImageFromWiki(course.keyword_for_image || course.title);
      }
    } else if (subPath === 'quiz' && aiData.keyword_for_image) {
      aiData.img = await fetchImageFromWiki(aiData.keyword_for_image);
    }
    console.log(`[LearningController] Request complete. Returning data.`);

    // 5. Cache & Return
    // Only cache if it's NOT fallback data, so we can retry the AI on the next request
    if (!isFallback) {
      learningCache.set(cacheKey, { data: aiData, timestamp: Date.now() });
    }

    res.json({
      success: true,
      data: aiData,
      source: isFallback ? 'fallback' : 'gemini'
    });
  } catch (error) {
    console.error('Error fetching Learning Dashboard Data:', error);
    res.status(500).json({ error: 'Failed to fetch learning data' });
  }
};

