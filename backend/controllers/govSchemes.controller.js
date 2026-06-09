import geminiKeyManager from '../utils/geminiKeyManager.js';

const fail = (res, msg, status = 500) => res.status(status).json({ success: false, message: msg });
const ok = (res, data) => res.json({ success: true, ...data });

export const chatWithSchemeAI = async (req, res) => {
  try {
    const { message, farmerProfile, schemeContext } = req.body;

    if (!message) {
      return fail(res, "Message is required", 400);
    }

    const defaultProfile = {
      name: "Suresh Kumar",
      location: "Faridabad, Haryana",
      landSize: 4.5,
      crops: ["Rice", "Wheat"],
      irrigation: "Drip",
      category: ["SC", "Small Farmer"]
    };

    const profile = farmerProfile || defaultProfile;

    // Build farmer profile context string for Gemini
    const contextString = `
Farmer Profile Context:
- Name: ${profile.name}
- Location: ${profile.location}
- Land Size: ${profile.landSize} Acres
- Crops grown: ${profile.crops ? profile.crops.join(', ') : 'None listed'}
- Irrigation Method: ${profile.irrigation}
- Category: ${profile.category ? profile.category.join(', ') : 'General'}
${schemeContext ? `Active Scheme Query Context: ${JSON.stringify(schemeContext)}` : ''}
`;

    const systemInstruction = `You are AgroIndia AI Schemes Advisor, a helpful and knowledgeable agricultural government schemes specialist. 
Your goal is to help Indian farmers navigate government schemes, subsidies, loans, crop insurance, and eligibility requirements.
Keep in mind the farmer's profile:
${contextString}
Provide highly relevant, actionable, and personalized schemes information based on their crop list, location (State/District), landholdings, and caste category.
Use simple, clear, and reassuring language. 
Adhere to the following rules:
1. Do not invent scheme benefits or application windows.
2. Provide step-by-step guidance on how to apply, which documents are needed, and how to resolve missing verification items.
3. Keep the tone helpful, professional, and empathetic to rural users.
4. Keep the response concise and structured (use bullet points).
`;

    let responseText = null;
    let attempts = 0;
    const maxAttempts = Math.max(geminiKeyManager.keyCount, 1);

    while (attempts < maxAttempts && !responseText) {
      try {
        const apiKey = geminiKeyManager.getNextKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: message }]
              }
            ],
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000
            }
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Gemini API Error');
        }

        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch (err) {
        console.warn(`[AI Schemes Advisor] Gemini call failed on attempt ${attempts + 1}: ${err.message}`);
        // If there's only 0 or 1 key, break out of loop on error
        if (geminiKeyManager.keyCount <= 1) {
          break;
        }
      }
      attempts++;
    }

    if (!responseText) {
      // Fallback response with seed intelligence if keys are blocked/quota hit
      responseText = `I apologize, but my live connection to the Gemini AI advisor is busy. Based on your profile (${profile.location}, ${profile.landSize} acres), here is what I recommend:
- Check your **PM Kisan** status (you are eligible for ₹6,000/year).
- Complete your **Bank-Aadhaar seeding** to unlock pending installments.
- Since you grow ${profile.crops ? profile.crops.join(', ') : 'crops'}, check the **PMFBY Crop Insurance** deadlines for the current season.
Please try again in a few moments for full interactive chat.`;
    }

    return ok(res, { answer: responseText });
  } catch (e) {
    console.error("[Schemes AI Controller Error]", e);
    return fail(res, "Internal Server Error", 500);
  }
};
