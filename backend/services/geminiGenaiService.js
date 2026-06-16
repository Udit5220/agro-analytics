import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Fetch token-optimized News Intelligence from Gemini
 * @param {string} userRole - 'Farmer' | 'Trader' | 'Exporter'
 * @param {string} activeSubpage - 'Everything' | 'Wheat' | 'Mustard' | 'Mandi Prices' | 'Weather'
 * @param {string} userLoc - Location string
 * @param {Array} rawNews - Raw news feeds for context
 * @param {string} language - Target language (e.g. 'Hindi', 'English')
 */
export const fetchNewsIntelligenceAI = async (userRole, activeSubpage, userLoc, rawNews = [], language = 'English') => {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  // Compress raw news context to keep tokens minimal
  const compactNews = (rawNews || []).slice(0, 3).map(item => ({
    t: item.title ? item.title.substring(0, 60) : '',
    d: item.description ? item.description.substring(0, 100) : ''
  }));

  const prompt = [
    `Role:${userRole}`,
    `Page:${activeSubpage}`,
    `Loc:${userLoc}`,
    `Lang:${language}`,
    `News:${JSON.stringify(compactNews)}`
  ].join('|');

  const langInstruction = language !== 'English' ? ` You MUST translate ALL output text into ${language}.` : '';
  const countDesc = (userRole === 'Farmer' || userRole === 'FPO' || userRole === 'Commodity Trader' || userRole === 'Research Analyst' || userRole === 'Agribusiness Manager' || userRole === 'Government Official' || userRole === 'Company Admin') ? `5-8 structured news blocks focusing on the selected topic/subpage.${langInstruction}` : `3-4 structured news blocks.${langInstruction}`;

  const schema = {
    type: 'OBJECT',
    properties: {
      ban: {
        type: 'OBJECT',
        description: 'Update banner configuration',
        properties: {
          typ: { type: 'STRING', description: 'Alert type: MANDATORY UPDATE | CRITICAL | INFO | WEATHER ALERT' },
          ttl: { type: 'STRING', description: 'Short action-oriented title/headline' },
          dsc: { type: 'STRING', description: '1-2 sentence description' }
        },
        required: ['typ', 'ttl', 'dsc']
      },
      nws: {
        type: 'ARRAY',
        description: countDesc,
        items: {
          type: 'OBJECT',
          properties: {
            tag: { type: 'STRING', description: 'Sentiment: BULLISH | BEARISH | NEUTRAL | WARNING' },
            dur: { type: 'STRING', description: 'Read duration, e.g. 3 min read' },
            ttl: { type: 'STRING', description: 'Headline' },
            reg: { type: 'STRING', description: 'Geo-region/locality' },
            dsc: { type: 'STRING', description: 'Detailed news summary (3-4 sentences) focusing on the subpage topic, including actionable steps.' },
            img_keyword: { type: 'STRING', description: 'A single English word for an image search describing the news subject (e.g. tractor, wheat, rain, market, pest).' }
          },
          required: ['tag', 'dur', 'ttl', 'reg', 'dsc', 'img_keyword']
        }
      },
      ind_title: {
        type: 'STRING',
        description: `A 2-4 word title for the side widget (e.g., "Local Mandi Trends", "System Metrics"). MUST be translated to ${language} and relevant to the user role and subpage.`
      },
      ind_btn: {
        type: 'STRING',
        description: `A 3-5 word label for the button under the side widget (e.g., "View Full Report"). MUST be translated to ${language}.`
      },
      ind: {
        type: 'ARRAY',
        description: `3-4 local metrics/indicators highly relevant to the role "${userRole}" and topic "${activeSubpage}". MUST be translated to ${language}.`,
        items: {
          type: 'OBJECT',
          properties: {
            var: { type: 'STRING', description: 'Commodity/variant, e.g., Wheat (Kanak)' },
            loc: { type: 'STRING', description: 'Trading location/mandi' },
            val: { type: 'STRING', description: 'Current metric/price, e.g., ₹2,275/q' },
            dlt: { type: 'STRING', description: 'Delta value, e.g., +1.2%, -0.5%' }
          },
          required: ['var', 'loc', 'val', 'dlt']
        }
      },
      insight_title: {
        type: 'STRING',
        description: `A 2-3 word title for the insight block (e.g. "Farmer Insight", "Admin Alert"). MUST be translated to ${language}.`
      },
      ins: {
        type: 'STRING',
        description: `1-sentence strategic action insight tailored specifically for ${userRole}. MUST be translated to ${language}.`
      },
      weather_alert: {
        type: 'OBJECT',
        description: `A relevant alert widget data (weather, system, policy, etc depending on role). MUST be translated to ${language}.`,
        properties: {
          title: { type: 'STRING', description: 'Alert Title' },
          description: { type: 'STRING', description: 'Alert Description (1-2 sentences)' },
          temperature: { type: 'STRING', description: 'A short metric or value (e.g. 32°C, 99.9%, High Risk)' },
          probability: { type: 'STRING', description: 'A probability or secondary metric (e.g. 80% Chance, Critical)' }
        },
        required: ['title', 'description', 'temperature', 'probability']
      }
    },
    required: ['ban', 'nws', 'ind_title', 'ind_btn', 'ind', 'insight_title', 'ins']
  };

  const finalPrompt = prompt + `|You MUST respond strictly in valid JSON format matching the following schema. Do not include markdown code blocks (\`\`\`json) or any conversational text. Schema: ${JSON.stringify(schema)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: finalPrompt,
    config: {
      temperature: 0.2,
      tools: [{ googleSearch: {} }]
    }
  });

  const textResponse = response.text || response.response?.text;
  if (!textResponse) {
    throw new Error('Empty response from Gemini AI');
  }

  let cleanJson = textResponse.trim();
  if (cleanJson.startsWith("\`\`\`")) {
      cleanJson = cleanJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
  }

  return JSON.parse(cleanJson);
};

/**
 * Fetch detailed deep-dive news intelligence from Gemini
 * @param {string} title - The news headline
 * @param {string} location - The location
 * @param {string} language - The target language
 */
export const fetchNewsDetailsAI = async (title, location, language = 'English') => {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const langInstruction = language !== 'English' ? ` You MUST translate the entire response into ${language}.` : '';
  const prompt = `Act as an expert agricultural intelligence analyst. Provide a highly detailed, 3-4 sentence comprehensive analysis and actionable steps for a farmer/trader regarding the following news headline: "${title}" in the region "${location}". Make it professional and insightful.${langInstruction} Return ONLY the plain text paragraph, no markdown, no json.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
      tools: [{ googleSearch: {} }]
    }
  });

  const textResponse = response.text || response.response?.text;
  if (!textResponse) {
    throw new Error('Empty response from Gemini AI');
  }

  return textResponse.trim();
};

export const fetchLearningIntelligenceAI = async (role, language, subPath, location = 'India', searchContext = '', courseContext = '') => {
  try {
    const promptContext = courseContext ? `\nSpecific Course Context: ${courseContext}. Generate the response specifically about this course.` : '';
    let schemaDescription = '';
    let promptInstruction = '';

    switch (subPath) {
      case 'dashboard':
        schemaDescription = `
          {
            "banner_heading": "Personalized welcome heading (e.g., Welcome back, Ramesh!)",
            "banner_subtext": "Dynamic subtext mentioning the location '${location}' and relevant season/crops",
            "active_course": {
              "title": "Title of the course they are currently taking",
              "progress": 65,
              "time_spent": "12h 30m"
            },
            "recommended_courses": [
              {
                "title": "Course title",
                "duration": "e.g., 45 mins",
                "badge": "e.g., TRENDING",
                "keyword_for_image": "A single english keyword to search for a stock image"
              }
            ] // Exactly 4 courses
          }
        `;
        break;
      case 'catalog':
        schemaDescription = `
          {
            "activeRole": "${role}",
            "currentSubpage": "${subPath}",
            "timestamp": "ISO-8601 string",
            "searchQueryUsed": "search string used",
            "uiElements": {
              "pageTitle": "Browse Course Catalog",
              "subHeading": "Discover specialized tutorials and certifications to upgrade your skills.",
              "filters": ["All Courses", "Relevant Topic 1", "Relevant Topic 2"],
              "courses": [
                {
                  "id": "unique-string",
                  "badge": "RECOMMENDED | NEW | POPULAR | ESSENTIAL | TOP RATED | TRENDING",
                  "title": "Course title",
                  "rating": 4.8,
                  "reviewCount": "1.2k",
                  "enrollmentCount": "8k",
                  "duration": "2h 30m",
                  "thumbnailPlaceholder": "A single english keyword",
                  "actionText": "Enroll Now"
                }
              ] // Exactly 6 courses
            }
          }
        `;
        break;
      case 'lesson':
        schemaDescription = `
          {
            "module_title": "Module Title",
            "tags": ["Tag 1", "Tag 2"],
            "duration": "e.g., 24 mins",
            "notes": "Detailed notes paragraph (3-4 sentences)",
            "key_insight": "A critical insight or tip",
            "timeline": [
              { "title": "Module 1", "status": "completed", "duration": "15 mins" },
              { "title": "Module 2", "status": "active", "duration": "24 mins" },
              { "title": "Module 3", "status": "locked", "duration": "10 mins" }
            ]
          }
        `;
        break;
      case 'quiz':
        schemaDescription = `
          {
            "course_title": "Course Title",
            "question": "A challenging multiple choice question relevant to the role",
            "options": [
              { "id": "A", "text": "Option A text" },
              { "id": "B", "text": "Option B text" },
              { "id": "C", "text": "Option C text" },
              { "id": "D", "text": "Option D text" }
            ],
            "correct_option_id": "A, B, C, or D",
            "keyword_for_image": "A single english keyword"
          }
        `;
        break;
      case 'analytics':
        schemaDescription = `
          {
            "metrics": {
              "total_learners": "e.g., 42.5k",
              "average_score": "e.g., 86%",
              "certificates": "e.g., 12,450",
              "at_risk": "e.g., 4.2%"
            },
            "top_modules": [
              { "rank": 1, "title": "Module name", "score": "98%" },
              { "rank": 2, "title": "Module name", "score": "94%" },
              { "rank": 3, "title": "Module name", "score": "89%" },
              { "rank": 4, "title": "Module name", "score": "85%" }
            ],
            "activities": [
              { "title": "Activity 1", "desc": "Description 1", "time": "2 mins ago" },
              { "title": "Activity 2", "desc": "Description 2", "time": "1 hour ago" },
              { "title": "Activity 3", "desc": "Description 3", "time": "3 hours ago" }
            ]
          }
        `;
        break;
      default:
        schemaDescription = `
          {
            "activeRole": "${role}",
            "currentSubpage": "${subPath}",
            "timestamp": "ISO-8601 string",
            "searchQueryUsed": "search string used",
            "uiElements": {
              "pageTitle": "${subPath.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Topics",
              "subHeading": "Explore expert knowledge relevant to this domain.",
              "filters": ["All Courses", "Beginner", "Advanced"],
              "courses": [
                {
                  "id": "unique-string",
                  "badge": "RECOMMENDED | NEW | POPULAR | ESSENTIAL | TOP RATED | TRENDING",
                  "title": "Course title highly specific to the ${subPath} topic",
                  "rating": 4.8,
                  "reviewCount": "1.2k",
                  "enrollmentCount": "8k",
                  "duration": "2h 30m",
                  "thumbnailPlaceholder": "A single english keyword",
                  "actionText": "Enroll Now"
                }
              ] // Exactly 6 courses relevant to ${subPath}
            }
          }
        `;
    }

    const prompt = `
You are the primary intelligence and data-generation engine for the "AgroIndia" Learning Hub module. 
Your goal is to serve structured, role-specific content to the user interface based on the active role and selected subpage/topic.

### Active Role Context:
- Role: ${role}

### Location & Language Context:
- Location: ${location}
- Language: ${language}
- View Context / Topic: ${subPath}${promptContext}

### Operation Workflow:
1. PRIMARY APPROACH: Use internal knowledge combined with recent real-world data context to fetch localized data.
${searchContext ? `Recent real-world data context:\n${searchContext}\n` : ''}
2. OUTPUT REQUIREMENTS: You MUST respond strictly in valid JSON format matching the schema below. Do not wrap the JSON in markdown code blocks (e.g., do not use \`\`\`json). No conversational prose before or after the JSON. Translate ALL user-facing text (titles, descriptions, badges) into ${language}, EXCEPT 'thumbnailPlaceholder' which MUST remain in English.

${schemaDescription}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json"
      }
    });

    const textResponse = response.text || response.response?.text;
    if (!textResponse) {
      throw new Error('Empty response from Gemini AI');
    }

    const parsedData = JSON.parse(textResponse.trim());
    if (typeof parsedData !== 'object' || parsedData === null) {
      throw new Error('Invalid JSON structure returned by Gemini AI');
    }
    return parsedData;
  } catch (error) {
    console.error('[GeminiService] Error generating Learning Intelligence AI response:', error.message);
    throw error;
  }
};

/**
 * Generate a generic Gemini AI text response
 * @param {string} prompt - The prompt to send
 */
export const generateGeminiGenaiResponse = async (prompt) => {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      tools: [{ googleSearch: {} }]
    }
  });

  const textResponse = response.text || response.response?.text;
  if (!textResponse) {
    throw new Error('Empty response from Gemini AI');
  }

  return textResponse.trim();
};

/**
 * Fetch White Paper Dashboard AI
 * @param {string} userRole
 * @param {string} activeSubpage
 * @param {string} language
 * @param {string} searchQuery
 */
export const fetchWhitePaperDashboardAI = async (userRole, activeSubpage, language = 'English', searchQuery = '') => {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const searchContext = searchQuery ? `|UserSearchTopic:${searchQuery}` : '';
  const prompt = `Role:${userRole}|Page:${activeSubpage}|Lang:${language}${searchContext}
You are an advanced agricultural research assistant. Generate structured JSON data for a research dashboard. 
${searchQuery ? `Make sure the generated content heavily focuses on the user search topic: "${searchQuery}".` : ''}
Use the googleSearch tool to find a real, relevant image URL for each new publication.
You MUST respond strictly in valid JSON format matching the schema below. Do not include markdown code blocks (\`\`\`json) or any conversational text.
Schema:
{
  "emergingTrends": [
    { "type": "string", "title": "string", "abstract": "string", "date": "string", "author": "string", "badge": "string", "imageUrl": "string", "keyFindings": ["string", "string", "string"] }
  ],
  "industryReports": [
    { "title": "string", "region": "string", "author": "string", "status": "string" }
  ],
  "newPublications": [
    { "journal": "string", "title": "string", "description": "string", "readTime": "string", "imageKeyword": "string", "imageUrl": "string", "abstract": "string", "author": "string", "publishDate": "string", "keyFindings": ["string", "string", "string"] }
  ]
}
Generate 6 emergingTrends (make the last one a HOT TOPIC), 6 industryReports, and 6 newPublications highly relevant to the User Role, Subpage, and Search Topic. For both emergingTrends and newPublications, provide a comprehensive 'abstract', an 'author' name, a date (or 'publishDate'), and 3 'keyFindings'. Use googleSearch to find a valid 'imageUrl' from a reputable source for both (or leave empty if none found).`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      tools: [{ googleSearch: {} }]
    }
  });

  const textResponse = response.text || response.response?.text;
  if (!textResponse) {
    throw new Error('Empty response from Gemini AI');
  }

  let cleanJson = textResponse.trim();
  if (cleanJson.startsWith("\`\`\`")) {
      cleanJson = cleanJson.replace(/^\`\`\`json\s*/i, "").replace(/\`\`\`$/, "").trim();
  }

  return JSON.parse(cleanJson);
};
