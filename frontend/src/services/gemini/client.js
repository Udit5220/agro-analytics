/**
 * client.js
 * 
 * Central Google Gemini REST API client. Uses browser fetch to interact 
 * directly with Google Generative AI endpoints, adhering to the zero external 
 * packages requirement. Dynamically registers the API key from Vite environment.
 */

// Retrieve key from Vite environment
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

/**
 * Sends a structured generation request to the Gemini 1.5 Flash model endpoint.
 * 
 * @param {string} prompt - Input query / system prompt instructions
 * @param {object} options - Generation parameters (temperature, maxOutputTokens, etc.)
 * @returns {Promise<string>} Clean text response from the model
 */
export async function generateContent(prompt, options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Please ensure VITE_GEMINI_API_KEY is registered in your frontend/.env file."
    );
  }

  // Support dynamic model override, defaulting to gemini-3.5-flash
  const model = options.model || "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxOutputTokens ?? 1000,
        ...options.generationConfig
      }
    };

    if (options.system_instruction) {
      requestBody.system_instruction = {
        parts: [{ text: options.system_instruction }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP error! status: ${response.status}`;
      throw new Error(`Gemini API Request Failed: ${errorMsg}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("Empty candidate list or invalid structure returned by Gemini API.");
    }

    return resultText.trim();
  } catch (error) {
    console.error("Gemini Client Error:", error);
    throw error;
  }
}
