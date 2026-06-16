import 'dotenv/config';
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

const prompt = `Act as an agricultural research recommendation engine.
    Given the following scenario:
    - Location: Nashik
    - Crop: Grapes
    - Problem Statement: Fungal infection
    
    Structure your response as a valid JSON object. Do not include markdown tags, return raw JSON only.
    Keys required:
    1. "relevantPapers": Array of 3 objects containing "title", "authors", and "summary".
    2. "bestPractices": Array of 3 bullet points with direct solutions.
    3. "scientificRecommendations": A paragraph explaining the scientific approach to mitigate the problem.
    4. "caseStudies": Array of 2 similar successful case studies (brief 1-sentence summaries).`;

const requestBody = {
  contents: [{ parts: [{ text: prompt }] }],
  systemInstruction: { parts: [{ text: "You are an expert agricultural research AI. You must ALWAYS return your response as raw, valid JSON without any markdown formatting." }] },
  generationConfig: { temperature: 0.3 }
};

async function test() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Error:", errorData);
    } else {
      const data = await response.json();
      let text = data.candidates[0].content.parts[0].text;
      console.log("Raw Response:\n", text);
      let cleanJson = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      console.log("\nParsed JSON:", JSON.parse(cleanJson));
    }
  } catch(e) {
    console.error(e);
  }
}
test();
